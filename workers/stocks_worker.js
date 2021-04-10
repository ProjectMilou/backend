const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const readline = require('readline');
const stockModel = require("../models/stock");
const balanceSheetModel = require("../models/balanceSheet");
const db = require('../db/worker_index.js');
dotenv.config();

module.exports.updateAllStocks = async function () {

    let api_key_alphavantage = process.env.alpha_vantage_key;
    let api_key_finhub = process.env.finnhub_key;

    const fileStream = fs.createReadStream('./public/assets/company_symbols.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });


    const startFetching = async () => {
        for await (const symbol of rl) {
            console.log(symbol)
            // await getStockOverview(symbol, api_key_alphavantage);
            // await getTimeIntervalPerformance(symbol, api_key_alphavantage);
            await updateMcSize(symbol, api_key_alphavantage)
            // await getYearlyPerformance(symbol, api_key_alphavantage);
            // await getImage(symbol, api_key_finhub);
            await getBalanceSheet(symbol, api_key_alphavantage);
            await sleep(1200)
        }
        rl.close()
        return
    }
    startFetching()
}

function getLastBusinessDay(currentDay) {
    let date = currentDay;
    while (!isBusinessDay(date)) { date.setDate(date.getDate() - 1) }
    return changeDateFormat(date);
}

function changeDateFormat(date) {
    let day = date.getDate();
    if (day < 10)
        day = '0' + day
    let month = date.getMonth() + 1; //Month of the Year: 0-based index
    if (month < 10)
        month = '0' + month
    let year = date.getFullYear()
    return year + '-' + month + '-' + day;
}

function isBusinessDay(date) {
    let day = date.getDay();
    if (day == 0 || day == 6) {
        return false;
    }
    return true;
}

async function getStockOverview(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + api_key;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            let stock = stockModel.findOneAndUpdate(
                { symbol: data.Symbol },
                {
                    $set:
                    {
                        "isin": 0,
                        "wkn": 0,
                        "name": data.Name,
                        "marketCapitalization": data.MarketCapitalization,
                        "analystTargetPrice": data.AnalystTargetPrice,
                        "currency": data.Currency,
                        "country": data.Country,
                        "industry": data.Industry,
                        "date": new Date(),
                        "valuation": data.PERatio,
                        "div": data.DividendPerShare,
                        "growth": 0,
                        "intro": data.Description,
                        "founded": "",
                        "employees": data.FullTimeEmployees,
                        "address": data.Address,
                        "assembly": "",
                        "assetType": data.AssetType,
                        "peRatio": data.PERatio,
                        "exchange": data.Exchange,
                        "cik": data.CIK,
                        "fiscalYearEnd": data.FiscalYearEnd,
                        "latestQuarter": data.LatestQuarter,
                        "ebitda": data.EBITDA,
                        "pegRatio": data.PEGRatio,
                        "bookValue": data.BookValue,
                        "dividendPerShare": data.DividendPerShare,
                        "eps": data.EPS,
                        "revenuePerShareTTM": data.RevenuePerShareTTM,
                        "profitMargin": data.ProfitMargin,
                        "operatingMarginTTMprofitMargin": data.OperatingMarginTTM,
                        "returnOnAssetsTTM": data.ReturnOnAssetsTTM,
                        "returnOnEquityTTM": data.ReturnOnEquityTTM,
                        "revenueTTM": data.RevenueTTM,
                        "grossProfitTTM": data.GrossProfitTTM,
                        "dilutedEPSTTM": data.DilutedEPSTTM,
                        "quarterlyEarningsGrowthYOY": data.QuarterlyEarningsGrowthYOY,
                        "quarterlyRevenueGrowthYOY": data.QuarterlyRevenueGrowthYOY,
                        "analystTargetPrice": data.AnalystTargetPrice,
                        "trailingPE": data.TrailingPE,
                        "forwardPE": data.ForwardPE,
                        "priceToSalesRatioTTM": data.PriceToSalesRatioTTM,
                        "priceToBookRatio": data.PriceToBookRatio,
                        "evToRevenue": data.EVToRevenue,
                        "evToEbitda": data.EVToEBITDA,
                        "beta": data.Beta,
                        "per52WeekHigh": data["52WeekHigh"],
                        "per52WeekLow": data["52WeekLow"],
                        "per50DayMovingAverage": data["50DayMovingAverage"],
                        "per200DayMovingAverage": data["200DayMovingAverage"],
                        "sharesOutstanding": data.SharesOutstanding,
                        "sharesFloat": data.SharesFloat,
                        "sharesShort": data.SharesShort,
                        "sharesShortPriorMonth": data.SharesShortPriorMonth,
                        "shortRatio": data.ShortRatio,
                        "shortPercentOutstanding": data.ShortPercentOutstanding,
                        "shortPercentFloat": data.ShortPercentFloat,
                        "percentInsiders": data.PercentInsiders,
                        "percentInstitutions": data.PercentInstitutions,
                        "forwardAnnualDividendRate": data.ForwardAnnualDividendRate,
                        "forwardAnnualDividendYield": data.ForwardAnnualDividendYield,
                        "payoutRatio": data.PayoutRatio,
                        "dividendDate": data.DividendDate,
                        "exDividendDate": data.ExDividendDate,
                        "lastSplitFactor": data.LastSplitFactor,
                        "lastSplitDate": data.LastSplitDate
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)

                });
        })
        .catch(err => console.log(err))
}

async function getImage(symbol, api_key) {
    let url = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + symbol + '&token=' + api_key;

    console.log(api_key)
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            let stock = stockModel.findOneAndUpdate(
                { symbol: symbol },
                {
                    $set:
                    {
                        "website": data.weburl,
                        "picture": data.logo,
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)

                });
        })
        .catch(err => console.log(err))
}

async function updateMcSize(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + api_key;

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            let mcSize = "";
            if (parseInt(data.MarketCapitalization) > 10000000000) {
                mcSize = "large"
            } else if (parseInt(data.MarketCapitalization) > 2000000000) {
                mcSize = "medium"
            } else {
                mcSize = "small"
            }
            let stock = stockModel.findOneAndUpdate(
                { symbol: symbol },
                {
                    $set:
                    {
                        "mcSize": mcSize,
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)

                });
        })
        .catch(err => console.log(err))
}

async function getYearlyPerformance(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=' + symbol + '&apikey=' + api_key;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeriesData = data["Weekly Time Series"];
            const lastDay = Object.keys(timeSeriesData)[0];
            const lastYear = Object.keys(timeSeriesData)[52];
            const lastDayClose = timeSeriesData[lastDay]["4. close"]
            const lastYearClose = timeSeriesData[lastYear]["4. close"]
            const per365d = (lastDayClose / lastYearClose).toFixed(3);


            let stock = stockModel.findOneAndUpdate(
                { symbol: symbol },
                {
                    $set:
                    {
                        "per365d": per365d,
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)

                });
        })
        .catch(err => {
            // console.log(err)
        })
}




async function getTimeIntervalPerformance(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=' + api_key;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeriesData = data["Time Series (Daily)"];
            const lastDay = Object.keys(timeSeriesData)[0];
            const previousDay = Object.keys(timeSeriesData)[1];
            const lastWeek = Object.keys(timeSeriesData)[5];
            const lastMonth = Object.keys(timeSeriesData)[20];
            const lastDayClose = timeSeriesData[lastDay]["4. close"]
            const previousDayClose = timeSeriesData[previousDay]["4. close"]
            const lastWeekClose = timeSeriesData[lastWeek]["4. close"]
            const lastMonthClose = timeSeriesData[lastMonth]["4. close"]
            const per1d = (lastDayClose / previousDayClose).toFixed(3);
            const per7d = (lastDayClose / lastWeekClose).toFixed(3);
            const per30d = (lastDayClose / lastMonthClose).toFixed(3);

            let stock = stockModel.findOneAndUpdate(
                { symbol: symbol },
                {
                    $set:
                    {
                        "price": lastDayClose,
                        "per1d": per1d,
                        "per7d": per7d,
                        "per30d": per30d,
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)

                });
        })
        .catch(err => {
            // console.log(err)
        })
}

async function getBalanceSheet(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=BALANCE_SHEET' +
        '&symbol=' + symbol +
        '&apikey=' + api_key;

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data['symbol']);
            let balanceSheet = balanceSheetModel.findOneAndUpdate(
                { symbol: data['symbol'] },
                {
                    $set:
                    {
                        "totalAssets": data['annualReports'][0]['totalAssets'],
                        "totalLiabilities": data['annualReports'][0]['totalLiabilities'],
                    },
                },
                {
                    upsert: true,
                    new: true
                },
                function (err, _stockInstance) {
                    if (err)
                        console.log(err)
                });
        })
        .catch(err => console.log(err))
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
