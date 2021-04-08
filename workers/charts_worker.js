const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const readline = require('readline');
const dataPointModel = require("../models/dataPoint");
const db = require('../db/worker_index.js');
dotenv.config();

module.exports.updateAllCharts = async function () {
    let api_key_alphavantage;
    let api_key_finhub;
    if (process.env.NODE_ENV == 'development') {
        api_key_alphavantage = process.env.alphavantage_api_key;
        api_key_finhub = process.env.finnhub_api_key;
    } else {
        // TODO: Add api_keys to AWS Secret Manager
    }

    const fileStream = fs.createReadStream('./public/assets/company_symbols.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });


    const startFetching = async () => {
        for await (const symbol of rl) {
            console.log(symbol)
            await getDataPoints(symbol, api_key_alphavantage);
            // await getTimeIntervalPerformance(symbol, api_key_alphavantage);
            // await getYearlyPerformance(symbol, api_key_alphavantage);
            // await getImage(symbol, api_key_finhub);
            await sleep(1200)
        }
        rl.close()
        return
    }
    startFetching()
}

async function getDataPoints(symbol, api_key) {
    let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=' + symbol + '&apikey=' + api_key;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeriesData = data["Time Series (Daily)"];
            let closingPrice;
            let dataPoints = [];
            Object.keys(timeSeriesData).forEach(function (date) {
                closingPrice = timeSeriesData[date]["4. close"];
                dataPoints.push({ date: date, close: closingPrice })
            })
            dataPointModel.create(
                {
                    symbol: symbol,
                    dataPoints: dataPoints
                },
                function (err, _dataPointInstance) {
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
