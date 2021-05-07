const fetch = require("node-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const readline = require("readline");
const stockModel = require("../models/stock");
const stockAnalysisModel = require("../models/stockAnalysis");
const stockDetailedAnalysisModel = require("../models/stockDetailedAnalysis");
const balanceSheetModel = require("../models/balanceSheet");
const incomeStatementModel = require("../models/incomeStatement");
const cashFlowModel = require("../models/cashFlow");
const exchangeRateModel = require("../models/exchangeRate");
dotenv.config();

module.exports.updateAllStocks = async function () {
  let api_key_alphavantage = process.env.alpha_vantage_key;
  let api_key_finhub = process.env.finnhub_key;
  let api_key_benzinga = process.env.benzinga_key;

  let fileStream;
  if(process.env.NODE_ENV == 'staging') {
    fileStream = fs.createReadStream("./public/assets/company_symbols_staging.txt");
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
      await getExchangeRates();
      await getStockOverview(symbol, api_key_alphavantage);
      // await updateIsinAndWknWithMockData(symbol);
      await getTimeIntervalPerformance(symbol, api_key_alphavantage);
      await getAnalysis(symbol, api_key_finhub);
      // await updateMcSize(symbol, api_key_alphavantage);
      // await getYearlyPerformance(symbol, api_key_alphavantage);
      // await getImage(symbol, api_key_finhub);
      // await getBalanceSheet(symbol, api_key_alphavantage);
      // await getDetailedAnalysis(symbol, api_key_benzinga);
      // await getIncomeStatement(symbol, api_key_alphavantage);
      // await getCashFlow(symbol, api_key_alphavantage);

      let numberOfCalls = 3;
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

// function getLastBusinessDay(currentDay) {
//   let date = currentDay;
//   while (!isBusinessDay(date)) {
//     date.setDate(date.getDate() - 1);
//   }
//   return changeDateFormat(date);
// }

// function changeDateFormat(date) {
//   let day = date.getDate();
//   if (day < 10) day = "0" + day;
//   let month = date.getMonth() + 1; //Month of the Year: 0-based index
//   if (month < 10) month = "0" + month;
//   let year = date.getFullYear();
//   return year + "-" + month + "-" + day;
// }

// function isBusinessDay(date) {
//   let day = date.getDay();
//   if (day == 0 || day == 6) {
//     return false;
//   }
//   return true;
// }

async function getExchangeRates() {
  let url = "https://api.ratesapi.io/api/latest";

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      exchangeRateModel.findOneAndUpdate(
        { base: data["base"] },
        {
          $set: {
            rates: data["rates"],
            date: data["date"],
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
    })
    .catch((err) => console.log(err));
}

async function getStockOverview(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      let exchangeRate = await getExhangeRateToEur(data.Currency);

      stockModel.findOneAndUpdate(
        { symbol: data.Symbol },
        {
          $set: {
            name: data.Name,
            marketCapitalization: Math.floor(data.MarketCapitalization * exchangeRate), //data.MarketCapitalization,
            analystTargetPrice: Math.floor(data.AnalystTargetPrice * exchangeRate),
            currency: data.Currency,
            country: data.Country,
            industry: data.Industry,
            date: new Date(),
            valuation: data.PERatio,
            div: (data.DividendPerShare * exchangeRate).toFixed(4), //div: data.DividendPerShare,
            growth: 0,
            intro: data.Description,
            founded: "",
            employees: data.FullTimeEmployees,
            address: data.Address,
            assembly: "",
            assetType: data.AssetType,
            peRatio: data.PERatio,
            exchange: data.Exchange,
            cik: data.CIK,
            fiscalYearEnd: data.FiscalYearEnd,
            latestQuarter: data.LatestQuarter,
            ebitda: data.EBITDA,
            pegRatio: data.PEGRatio,
            bookValue: data.BookValue,
            dividendPerShare: data.DividendPerShare,
            eps: data.EPS,
            revenuePerShareTTM: Math.floor(data.RevenuePerShareTTM * exchangeRate), //data.RevenuePerShareTTM,
            profitMargin: data.ProfitMargin,
            operatingMarginTTMprofitMargin: data.OperatingMarginTTM,
            returnOnAssetsTTM: data.ReturnOnAssetsTTM,
            returnOnEquityTTM: data.ReturnOnEquityTTM,
            revenueTTM: Math.floor(data.RevenueTTM * exchangeRate), //data.RevenueTTM,
            grossProfitTTM: data.GrossProfitTTM,
            dilutedEPSTTM: data.DilutedEPSTTM,
            quarterlyEarningsGrowthYOY: data.QuarterlyEarningsGrowthYOY,
            quarterlyRevenueGrowthYOY: data.QuarterlyRevenueGrowthYOY,
            trailingPE: data.TrailingPE,
            forwardPE: data.ForwardPE,
            priceToSalesRatioTTM: data.PriceToSalesRatioTTM,
            priceToBookRatio: data.PriceToBookRatio,
            evToRevenue: data.EVToRevenue,
            evToEbitda: data.EVToEBITDA,
            beta: data.Beta,
            per52WeekHigh: data["52WeekHigh"],
            per52WeekLow: data["52WeekLow"],
            per50DayMovingAverage: data["50DayMovingAverage"],
            per200DayMovingAverage: data["200DayMovingAverage"],
            sharesOutstanding: data.SharesOutstanding,
            sharesFloat: data.SharesFloat,
            sharesShort: data.SharesShort,
            sharesShortPriorMonth: data.SharesShortPriorMonth,
            shortRatio: data.ShortRatio,
            shortPercentOutstanding: data.ShortPercentOutstanding,
            shortPercentFloat: data.ShortPercentFloat,
            percentInsiders: data.PercentInsiders,
            percentInstitutions: data.PercentInstitutions,
            forwardAnnualDividendRate: data.ForwardAnnualDividendRate,
            forwardAnnualDividendYield: data.ForwardAnnualDividendYield,
            payoutRatio: data.PayoutRatio,
            dividendDate: data.DividendDate,
            exDividendDate: data.ExDividendDate,
            lastSplitFactor: data.LastSplitFactor,
            lastSplitDate: data.LastSplitDate,
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
    })
    .catch((err) => console.log(err));
}

async function updateIsinAndWknWithMockData(symbol) {
  const isinMax = 10000000000;
  const isinMin = 1000000000;
  const wknMax = 1000000;
  const wknMin = 100000;

  let isin = Math.floor(Math.random() * (isinMax - isinMin + 1)) + isinMin;
  isin = "US" + isin;
  const wkn = Math.floor(Math.random() * (wknMax - wknMin + 1)) + wknMin;
  stockModel.findOneAndUpdate(
    { symbol: symbol },
    {
      $set: {
        isin: isin,
        wkn: wkn,
        displayedCurrency: "EUR",
      },
    },
    function (err, _stockInstance) {
      if (err) console.log(err);
    }
  );
}

async function getImage(symbol, api_key) {
  let url =
    "https://finnhub.io/api/v1/stock/profile2?symbol=" +
    symbol +
    "&token=" +
    api_key;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      stockModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            website: data.weburl,
            picture: data.logo,
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
    })
    .catch((err) => console.log(err));
}

async function getAnalysis(symbol, api_key) {
  let url =
    "https://finnhub.io/api/v1/stock/recommendation?symbol=" +
    symbol +
    "&token=" +
    api_key;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data = data[0];
      let strategy;
      if (
        parseInt(data.buy) > parseInt(data.sell) &&
        parseInt(data.buy) > parseInt(data.hold)
      ) {
        strategy = "buy";
      } else if (
        parseInt(data.hold) >= parseInt(data.sell) &&
        parseInt(data.hold) >= parseInt(data.buy)
      ) {
        strategy = "hold";
      } else {
        strategy = "sell";
      }
      stockAnalysisModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            buy: data.buy,
            hold: data.hold,
            sell: data.sell,
            date: data.period,
            source: "finnhub.io/api",
            strategy: strategy,
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
    })
    .catch((err) => console.log(err));
}

async function getDetailedAnalysis(symbol, api_key) {
  let url =
    "https://api.benzinga.com/api/v2.1/calendar/ratings?parameters%5Btickers%5D=" + symbol +
    "&token=" + api_key;

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

  await fetch(url, { headers: { accept: "application/json" } })
    .then((response) => response.json())
    .then(async (data) => {
      data = data["ratings"];

      let ratings = [];
      let averageGoal = 0;
      let totalNumberOfRatings = 0;
      for (const rating of data) {
        if (rating.pt_current) {
          totalNumberOfRatings = totalNumberOfRatings + 1;
          averageGoal = averageGoal + parseInt(rating.pt_current);
        }
        ratings.push({
          source: rating.analyst,
          goal: Math.floor(rating.pt_current * exchangeRate), //rating.pt_current,
          date: rating.date,
          strategy: rating.rating_current,
        });
      }
      averageGoal = averageGoal / totalNumberOfRatings;
      stockDetailedAnalysisModel.create(
        {
          symbol: symbol,
          averageGoal: averageGoal,
          rating: ratings,
        },
        function (err, _stockInstance) {
          if (err) console.log(err);
        }
      );
    })
    .catch((err) => console.log(err));
}

async function updateMcSize(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + symbol +
    "&apikey=" + api_key;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let mcSize = "";
      if (parseInt(data.MarketCapitalization) > 10000000000) {
        mcSize = "large";
      } else if (parseInt(data.MarketCapitalization) > 2000000000) {
        mcSize = "medium";
      } else {
        mcSize = "small";
      }
      stockModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            mcSize: mcSize,
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
    })
    .catch((err) => console.log(err));
}

async function getYearlyPerformance(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=" +
    symbol +
    "&apikey=" +
    api_key;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const timeSeriesData = data["Weekly Adjusted Time Series"];
      const lastDay = Object.keys(timeSeriesData)[0];
      const lastYear = Object.keys(timeSeriesData)[52];
      const lastDayClose = timeSeriesData[lastDay]["5. adjusted close"];
      const lastYearClose = timeSeriesData[lastYear]["5. adjusted close"];
      const per365d = ((lastDayClose / lastYearClose) * 100 - 100).toFixed(2);

      stockModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            per365d: per365d,
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
    })
    .catch((err) => {
      // console.log(err)
    });
}

async function getTimeIntervalPerformance(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED" +
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
      let closeType = "5. adjusted close";
      const timeSeriesData = data["Time Series (Daily)"];
      const lastDay = Object.keys(timeSeriesData)[0];
      const previousDay = Object.keys(timeSeriesData)[1];
      const lastWeek = Object.keys(timeSeriesData)[5];
      const lastMonth = Object.keys(timeSeriesData)[20];
      const lastDayClose = timeSeriesData[lastDay][closeType];
      const previousDayClose = timeSeriesData[previousDay][closeType];
      const lastWeekClose = timeSeriesData[lastWeek][closeType];
      const lastMonthClose = timeSeriesData[lastMonth][closeType];
      const per1d = ((lastDayClose / previousDayClose) * 100 - 100).toFixed(2);
      const per7d = ((lastDayClose / lastWeekClose) * 100 - 100).toFixed(2);
      const per30d = ((lastDayClose / lastMonthClose) * 100 - 100).toFixed(2);

      let stock = stockModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            price: String((lastDayClose * exchangeRate).toFixed(2)), //await convertToEur(lastDayClose, String(currencyOfStock)), //lastDayClose,
            per1d: per1d,
            per7d: per7d,
            per30d: per30d,
            date: new Date(),
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
    })
    .catch((err) => {
      // console.log(err)
    });
}

async function getBalanceSheet(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=BALANCE_SHEET" +
    "&symbol=" + symbol +
    "&apikey=" + api_key;

  let annualReportsInEur = [];

  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      let exchangeRate = await getExhangeRateToEur(
        data["annualReports"][0]["reportedCurrency"]
      );

      annualReportsInEur = [];
      let annualReportsInOtherCurrency = data["annualReports"];
      !!annualReportsInOtherCurrency &&
        annualReportsInOtherCurrency.forEach((annualReport) => {
          annualReportsInEur.push({
            fiscalDateEnding: annualReport["fiscalDateEnding"],
            reportedCurrency: "EUR",
            totalAssets: Math.floor(annualReport["totalAssets"] * exchangeRate), //await convertToEur(annualReport["grossProfit"], currencyFrom), //annualReport['grossProfit'],
            totalCurrentAssets: Math.floor(annualReport["totalCurrentAssets"] * exchangeRate),
            cashAndCashEquivalentsAtCarryingValue: Math.floor(
              annualReport["cashAndCashEquivalentsAtCarryingValue"] *
                exchangeRate
            ),
            cashAndShortTermInvestments: Math.floor(annualReport["cashAndShortTermInvestments"] * exchangeRate),
            inventory: Math.floor(annualReport["inventory"] * exchangeRate),
            currentNetReceivables: Math.floor(annualReport["currentNetReceivables"] * exchangeRate),
            totalNonCurrentAssets: Math.floor(annualReport["totalNonCurrentAssets"] * exchangeRate),
            propertyPlantEquipment: Math.floor(annualReport["propertyPlantEquipment"] * exchangeRate),
            accumulatedDepreciationAmortizationPPE: Math.floor(
              annualReport["accumulatedDepreciationAmortizationPPE"] *
                exchangeRate
            ),
            intangibleAssets: Math.floor(annualReport["intangibleAssets"] * exchangeRate),
            intangibleAssetsExcludingGoodwill: Math.floor(annualReport["intangibleAssetsExcludingGoodwill"] * exchangeRate),
            goodwill: Math.floor(annualReport["goodwill"] * exchangeRate),
            investments: Math.floor(annualReport["investments"] * exchangeRate),
            longTermInvestments: Math.floor(annualReport["longTermInvestments"] * exchangeRate),
            shortTermInvestments: Math.floor(annualReport["shortTermInvestments"] * exchangeRate),
            otherCurrentAssets: Math.floor(annualReport["otherCurrentAssets"] * exchangeRate),
            otherNonCurrrentAssets: Math.floor(annualReport["otherNonCurrrentAssets"] * exchangeRate),
            totalLiabilities: Math.floor(annualReport["totalLiabilities"] * exchangeRate),
            totalCurrentLiabilities: Math.floor(annualReport["totalCurrentLiabilities"] * exchangeRate),
            currentAccountsPayable: Math.floor(annualReport["currentAccountsPayable"] * exchangeRate),
            deferredRevenue: Math.floor(annualReport["deferredRevenue"] * exchangeRate),
            currentDebt: Math.floor(annualReport["currentDebt"] * exchangeRate),
            shortTermDebt: Math.floor(annualReport["shortTermDebt"] * exchangeRate),
            totalNonCurrentLiabilities: Math.floor(annualReport["totalNonCurrentLiabilities"] * exchangeRate),
            capitalLeaseObligations: Math.floor(annualReport["capitalLeaseObligations"] * exchangeRate),
            longTermDebt: Math.floor(annualReport["longTermDebt"] * exchangeRate),
            currentLongTermDebt: Math.floor(annualReport["currentLongTermDebt"] * exchangeRate),
            longTermDebtNoncurrent: Math.floor(annualReport["longTermDebtNoncurrent"] * exchangeRate),
            shortLongTermDebtTotal: Math.floor(annualReport["shortLongTermDebtTotal"] * exchangeRate),
            otherCurrentLiabilities: Math.floor(annualReport["otherCurrentLiabilities"] * exchangeRate),
            otherNonCurrentLiabilities: Math.floor(annualReport["otherNonCurrentLiabilities"] * exchangeRate),
            totalShareholderEquity: Math.floor(annualReport["totalShareholderEquity"] * exchangeRate),
            treasuryStock: Math.floor(annualReport["treasuryStock"] * exchangeRate),
            retainedEarnings: Math.floor(annualReport["retainedEarnings"] * exchangeRate),
            commonStock: Math.floor(annualReport["commonStock"] * exchangeRate),
            commonStockSharesOutstanding: Math.floor(annualReport["commonStockSharesOutstanding"] * exchangeRate),
          });
        });

      let balanceSheet = balanceSheetModel.findOneAndUpdate(
        { symbol: data["symbol"] },
        {
          $set: {
            annualReports: annualReportsInEur,
            // "quarterlyReports": data['quarterlyReports'],
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
    })
    .catch((err) => console.log(err));
}

async function getIncomeStatement(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=INCOME_STATEMENT" +
    "&symbol=" +
    symbol +
    "&apikey=" +
    api_key;

  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      let exchangeRate = await getExhangeRateToEur(
        data["annualReports"][0]["reportedCurrency"]
      );

      annualReportsInEur = [];
      let annualReportsInOtherCurrency = data["annualReports"];
      !!annualReportsInOtherCurrency &&
        annualReportsInOtherCurrency.forEach((annualReport) => {
          annualReportsInEur.push({
            fiscalDateEnding: annualReport["fiscalDateEnding"],
            reportedCurrency: "EUR",
            grossProfit: Math.floor(annualReport["grossProfit"] * exchangeRate), //await convertToEur(annualReport["grossProfit"], currencyFrom), //annualReport['grossProfit'],
            totalRevenue: Math.floor(annualReport["totalRevenue"] * exchangeRate),
            costOfRevenue: Math.floor(annualReport["costOfRevenue"] * exchangeRate),
            costofGoodsAndServicesSold: Math.floor(annualReport["costofGoodsAndServicesSold"] * exchangeRate),
            operatingIncome: Math.floor(annualReport["operatingIncome"] * exchangeRate),
            sellingGeneralAndAdministrative: Math.floor(annualReport["sellingGeneralAndAdministrative"] * exchangeRate),
            researchAndDevelopment: Math.floor(annualReport["researchAndDevelopment"] * exchangeRate),
            operatingExpenses: Math.floor(annualReport["operatingExpenses"] * exchangeRate),
            investmentIncomeNet: Math.floor(annualReport["investmentIncomeNet"] * exchangeRate),
            netInterestIncome: Math.floor(annualReport["netInterestIncome"] * exchangeRate),
            interestIncome: Math.floor(annualReport["interestIncome"] * exchangeRate),
            interestExpense: Math.floor(annualReport["interestExpense"] * exchangeRate),
            nonInterestIncome: Math.floor(annualReport["nonInterestIncome"] * exchangeRate),
            otherNonOperatingIncome: Math.floor(annualReport["otherNonOperatingIncome"] * exchangeRate),
            depreciation: Math.floor(annualReport["depreciation"] * exchangeRate),
            depreciationAndAmortization: Math.floor(annualReport["depreciationAndAmortization"] * exchangeRate),
            incomeBeforeTax: Math.floor(annualReport["incomeBeforeTax"] * exchangeRate),
            incomeTaxExpense: Math.floor(annualReport["incomeTaxExpense"] * exchangeRate),
            interestAndDebtExpense: Math.floor(annualReport["interestAndDebtExpense"] * exchangeRate),
            netIncomeFromContinuingOperations: Math.floor(annualReport["netIncomeFromContinuingOperations"] * exchangeRate),
            comprehensiveIncomeNetOfTax: Math.floor(annualReport["comprehensiveIncomeNetOfTax"] * exchangeRate),
            ebit: Math.floor(annualReport["ebit"] * exchangeRate),
            ebitda: Math.floor(annualReport["ebitda"] * exchangeRate),
            netIncome: Math.floor(annualReport["netIncome"] * exchangeRate),
          });
        });

      let incomeStatement = incomeStatementModel.findOneAndUpdate(
        { symbol: data["symbol"] },
        {
          $set: {
            annualReports: annualReportsInEur, //data['annualReports'],
            // "quarterlyReports": data['quarterlyReports'],
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
    })
    .catch((err) => console.log(err));
}

async function getCashFlow(symbol, api_key) {
  let url =
    "https://www.alphavantage.co/query?function=CASH_FLOW" +
    "&symbol=" + symbol +
    "&apikey=" + api_key;

  let annualReportsInEur = [];

  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      let annualReportsInOtherCurrency = data["annualReports"];
      let exchangeRate = await getExhangeRateToEur(
        annualReportsInOtherCurrency[0]["reportedCurrency"]
      );
      !!annualReportsInOtherCurrency &&
        annualReportsInOtherCurrency.forEach(async (annualReport) => {
          let operatingCashflow = annualReport["operatingCashflow"] * exchangeRate;
          let paymentsForOperatingActivities = annualReport["paymentsForOperatingActivities"] * exchangeRate;
          let proceedsFromOperatingActivities = annualReport["proceedsFromOperatingActivities"] * exchangeRate;
          let changeInOperatingLiabilities = annualReport["changeInOperatingLiabilities"] * exchangeRate;
          let changeInOperatingAssets = annualReport["changeInOperatingAssets"] * exchangeRate;
          let depreciationDepletionAndAmortization = annualReport["depreciationDepletionAndAmortization"] * exchangeRate;
          let capitalExpenditures = annualReport["capitalExpenditures"] * exchangeRate;
          let changeInReceivables = annualReport["changeInReceivables"] * exchangeRate;
          let changeInInventory = annualReport["changeInInventory"] * exchangeRate;
          let profitLoss = annualReport["profitLoss"] * exchangeRate;
          let cashflowFromInvestment = annualReport["cashflowFromInvestment"] * exchangeRate;
          let cashflowFromFinancing = annualReport["cashflowFromFinancing"] * exchangeRate;
          let proceedsFromRepaymentsOfShortTermDebt = annualReport["proceedsFromRepaymentsOfShortTermDebt"] * exchangeRate;
          let paymentsForRepurchaseOfCommonStock = annualReport["paymentsForRepurchaseOfCommonStock"] * exchangeRate;
          let paymentsForRepurchaseOfEquity = annualReport["paymentsForRepurchaseOfEquity"] * exchangeRate;
          let paymentsForRepurchaseOfPreferredStock = annualReport["paymentsForRepurchaseOfPreferredStock"] * exchangeRate;
          let dividendPayout = annualReport["dividendPayout"] * exchangeRate;
          let dividendPayoutCommonStock = annualReport["dividendPayoutCommonStock"] * exchangeRate;
          let dividendPayoutPreferredStock = annualReport["dividendPayoutPreferredStock"] * exchangeRate;
          let proceedsFromIssuanceOfCommonStock = annualReport["proceedsFromIssuanceOfCommonStock"] * exchangeRate;
          let proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet =
            annualReport["proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet"] * exchangeRate;
          let proceedsFromIssuanceOfPreferredStock = annualReport["proceedsFromIssuanceOfPreferredStock"] * exchangeRate;
          let proceedsFromRepurchaseOfEquity = annualReport["proceedsFromRepurchaseOfEquity"] * exchangeRate;
          let proceedsFromSaleOfTreasuryStock = annualReport["proceedsFromSaleOfTreasuryStock"] * exchangeRate;
          let changeInCashAndCashEquivalents = annualReport["changeInCashAndCashEquivalents"] * exchangeRate;
          let changeInExchangeRate = annualReport["changeInExchangeRate"] * exchangeRate;
          let netIncome = annualReport["netIncome"] * exchangeRate;

          annualReportsInEur.push({
            fiscalDateEnding: annualReport["fiscalDateEnding"],
            reportedCurrency: "EUR",
            operatingCashflow: Math.floor(operatingCashflow),
            paymentsForOperatingActivities: Math.floor(
              paymentsForOperatingActivities
            ),
            proceedsFromOperatingActivities: Math.floor(
              proceedsFromOperatingActivities
            ),
            changeInOperatingLiabilities: Math.floor(
              changeInOperatingLiabilities
            ),
            changeInOperatingAssets: Math.floor(changeInOperatingAssets),
            depreciationDepletionAndAmortization: Math.floor(
              depreciationDepletionAndAmortization
            ),
            capitalExpenditures: Math.floor(capitalExpenditures),
            changeInReceivables: Math.floor(changeInReceivables),
            changeInInventory: Math.floor(changeInInventory),
            profitLoss: Math.floor(profitLoss),
            cashflowFromInvestment: Math.floor(cashflowFromInvestment),
            cashflowFromFinancing: Math.floor(cashflowFromFinancing),
            proceedsFromRepaymentsOfShortTermDebt: Math.floor(
              proceedsFromRepaymentsOfShortTermDebt
            ),
            paymentsForRepurchaseOfCommonStock: Math.floor(
              paymentsForRepurchaseOfCommonStock
            ),
            paymentsForRepurchaseOfEquity: Math.floor(
              paymentsForRepurchaseOfEquity
            ),
            paymentsForRepurchaseOfPreferredStock: Math.floor(
              paymentsForRepurchaseOfPreferredStock
            ),
            dividendPayout: Math.floor(dividendPayout),
            dividendPayoutCommonStock: Math.floor(dividendPayoutCommonStock),
            dividendPayoutPreferredStock: Math.floor(
              dividendPayoutPreferredStock
            ),
            proceedsFromIssuanceOfCommonStock: Math.floor(
              proceedsFromIssuanceOfCommonStock
            ),
            proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: Math.floor(
              proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet
            ),
            proceedsFromIssuanceOfPreferredStock: Math.floor(
              proceedsFromIssuanceOfPreferredStock
            ),
            proceedsFromRepurchaseOfEquity: Math.floor(
              proceedsFromRepurchaseOfEquity
            ),
            proceedsFromSaleOfTreasuryStock: Math.floor(
              proceedsFromSaleOfTreasuryStock
            ),
            changeInCashAndCashEquivalents: Math.floor(
              changeInCashAndCashEquivalents
            ),
            changeInExchangeRate: Math.floor(changeInExchangeRate),
            netIncome: Math.floor(netIncome),
          });
        });

      let cashFlow = cashFlowModel.findOneAndUpdate(
        { symbol: symbol },
        {
          $set: {
            annualReports: annualReportsInEur,
            // "quarterlyReports": data['quarterlyReports'],
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
    })
    .catch((err) => console.log(err));
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
