const fetch = require("node-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const readline = require("readline");
const dataPointModel = require("../models/dataPoint");
const dividendModel = require("../models/dividend");
const keyFigureModel = require("../models/keyFigure");
const stockModel = require("../models/stock");
const exchangeRateModel = require("../models/exchangeRate");

dotenv.config();

module.exports.updateAllCharts = async function () {
  let api_key_alphavantage;
  let api_key_finhub;
  if (process.env.NODE_ENV == "development") {
    api_key_alphavantage = process.env.alpha_vantage_key;
    api_key_finhub = process.env.finnhub_key;
  } else {

  }

  let fileStream;
  if (process.env.NODE_ENV == "staging") {
    fileStream = fs.createReadStream(
      "./public/assets/company_symbols_staging.txt"
    );
  } else {
    fileStream = fs.createReadStream("./public/assets/company_symbols.txt");
  }

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const startFetching = async () => {
    // let counter = 0;
    for await (const symbol of rl) {
      // console.log(counter + ' - ' + symbol);
      await getDataPoints(symbol, api_key_alphavantage);
      // await getTimeIntervalPerformance(symbol, api_key_alphavantage);
      // await getYearlyPerformance(symbol, api_key_alphavantage);
      // await getImage(symbol, api_key_finhub);
      // await getDividends(symbol, api_key_alphavantage);    // there are 2 calls
      // await getKeyFigures(symbol, api_key_alphavantage);
      let numberOfCalls = 1;
      // counter++;
      await sleep(numberOfCalls * 1500);
    }
    rl.close();
    return;
  };
  startFetching();
};

async function getExhangeRateToEur(currencyFrom) {
  let query = {};
  query["base"] = "EUR";
  let exchangeRates = await exchangeRateModel.find(query, "-_id");
  let rate;
  try {
    rate = exchangeRates[0]["rates"][0][currencyFrom];
  } catch (e) {
    rate = 1;
  }
  return 1 / parseFloat(rate);
}

async function getDataPoints(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED" +
    "&outputsize=full" +
    "&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  let query = {};
  query["symbol"] = symbol;
  let stocks = await stockModel.find(query, "-_id");
  let currencyOfStock;
  try {
    currencyOfStock = stocks[0]["currency"];
  } catch (e) {
    currencyOfStock = "USD";
  }
  let exchangeRate = await getExhangeRateToEur(currencyOfStock);

  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      let timeSeriesData = data["Time Series (Daily)"];
      let closingPrice;
      let dataPoints = [];
      let closeType = "5. adjusted close";

      Object.keys(timeSeriesData).forEach(function (date) {
        closingPrice = timeSeriesData[date][closeType];
        dataPoints.push({
          date: date,
          close: Math.floor(closingPrice * exchangeRate), //await convertToEur(closingPrice, currencyOfStock) //closingPrice
        });
      });

      dataPointModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            dataPoints: dataPoints,
          },
        },
        {
          upsert: true,
          new: true,
        },
        function (err, _dataPointInstance) {
          if (err) console.log(err);
        }
      );
    })
    .catch((err) => console.log(err));
}

async function getDividends(symbol, api_key) {
  let urlOverview =
    "https://www.alphavantage.co/query?" +
    "function=OVERVIEW" +
    "&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  let urlCashFlow =
    "https://www.alphavantage.co/query?" +
    "function=CASH_FLOW" +
    "&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  let dividendDate;
  let quota;
  let dataPoints = [];

  await fetch(urlOverview)
    .then((res) => res.json())
    .then((json) => {
      dividendDate = json["DividendDate"];
      quota = json["PayoutRatio"];
    })
    .catch((err) => console.log(err));

  await fetch(urlCashFlow)
    .then((res) => res.json())
    .then((json) => {
      let annualReports = json["annualReports"];
      !!annualReports &&
        annualReports.forEach((annualReport) => {
          dataPoints.push({
            date: annualReport["fiscalDateEnding"],
            div: String(
              annualReport["dividendPayout"] / annualReport["netIncome"]
            ),
          });
        });
    })
    .catch((err) => console.log(err));

  dividendModel.findOneAndUpdate(
    { symbol: symbol },
    {
      $set: {
        dataPoints: dataPoints,
        date: dividendDate,
        quota: quota,
      },
    },
    {
      upsert: true,
      new: true,
    },
    function (err, _stockInstance) {
      if (err) console.log(err);
    }
  );
}

async function getKeyFigures(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=EARNINGS" +
    "&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  let symbolJson;
  let keyFigures = [];

  await fetch(url)
    .then((res) => res.json())
    .then((json) => {
      symbolJson = json["symbol"];
      keyFigures = json["quarterlyEarnings"];
    })
    .catch((err) => console.log(err));

  keyFigureModel.findOneAndUpdate(
    { symbol: symbolJson },
    {
      $set: {
        keyFigures: keyFigures,
      },
    },
    {
      upsert: true,
      new: true,
    },
    function (err, _stockInstance) {
      if (err) console.log(err);
    }
  );
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
