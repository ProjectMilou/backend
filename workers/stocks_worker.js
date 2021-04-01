const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const readline = require('readline');
const stockModel = require("../models/stock");
const db = require('../db/worker_index.js');
dotenv.config();

module.exports.updateAllStocks = async function () {
    let api_key;
    if (process.env.NODE_ENV == 'development') {
        api_key = process.env.alphavantage_api_key
    } else {
        // TODO: Add api_key to AWS Secret Manager
    }

    const fileStream = fs.createReadStream('./public/assets/company_symbols.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    rl.on('line', async function (symbol) {
        await getStockOverview(symbol, api_key);
        await sleep(500)
    })
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
                        "name": data.Name,
                        "marketCapitalization": data.MarketCapitalization,
                        "analystTargetPrice": data.AnalystTargetPrice,
                        "currency": data.Currency,
                        "country": data.Country,
                        "industry": data.Industry,
                        "date": new Date(),
                        "valuation": data.PERatio,
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
