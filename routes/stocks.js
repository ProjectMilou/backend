'use strict';
const express = require('express');
const router = express.Router();
const stockModel = require("../models/stock");
const dataPointModel = require('../models/dataPoint');
const stockAnalysisModel = require('../models/stockAnalysis');
const stockDetailedAnalysisModel = require('../models/stockDetailedAnalysis');
const dividendModel = require("../models/dividend");
const keyFigureModel = require("../models/keyFigure");
const balanceSheetModel = require("../models/balanceSheet");
const incomeStatementModel = require("../models/incomeStatement");
const cashFlowModel = require("../models/cashFlow");
const fetch = require('node-fetch');

const excludeFields = {
    _id: false,
    founded: false,
    intro: false,
    employees: false,
    website: false,
    assembly: false,
    address: false,
};

const listIncludeFields = {
    symbol: true,
    analystTargetPrice: true,
    country: true,
    currency: true,
    date: true,
    industry: true,
    marketCapitalization: true,
    name: true,
    valuation: true,
    per1d: true,
    per30d: true,
    per7d: true,
    per365d: true,
    div: true,
    growth: true,
    isin: true,
    picture: true,
    wkn: true,
    assetType: true,
};

// fixme: stocks from database are reformated wrongly

router.get('/list', async (req, res) => {
    let currency = req.query.currency;
    let country = req.query.country;
    let industry = req.query.industry;
    let mc = req.query.mc; // either small, medium or large market capitalization
    if (currency === undefined && country === undefined && industry === undefined && mc === undefined) {
        const stocks = await stockModel.find({}, excludeFields);
        res.json({ "stocks": stocks });
    } else {
        let query = {};
        if (currency != undefined) {
            if (currency.includes(',')) {
                const currencies = currency.split(',');
                query["currency"] = { $in: currencies }
            } else {
                query["currency"] = currency;
            }
        }
        if (country != undefined) {
            if (country.includes(',')) {
                const countries = country.split(',');
                query["country"] = { $in: countries }
            } else {
                query["country"] = country;
            }
        }
        if (industry != undefined) {
            query["industry"] = { $regex: ".*" + industry + ".*", '$options': 'i' };
        }
        if (mc != undefined) {
            if (mc.includes(',')) {
                // TODO: fix below
                const mc_values = mc.split(',');
                if (mc_values.includes["small"] && mc_values.includes["medium"] && mc_values.includes["large"]) {
                    ; // do nothing
                } else if (mc_values.includes["small"] && mc_values.includes["medium"]) {
                    query["$expr"] = { $lt: [{ $toDouble: "$marketCapitalization" }, 10000000000] }
                } else if (mc_values.includes["small"] && mc_values.includes["large"]) {
                    query["$or"] = [
                        { $expr: { $lt: [{ $toDouble: "$marketCapitalization" }, 2000000000] } },
                        { $expr: { $gt: [{ $toDouble: "$marketCapitalization" }, 10000000000] } }
                    ]
                } else if (mc_values.includes["medium"] && mc_values.includes["large"]) {
                    query["$expr"] = { $gte: [{ $toDouble: "$marketCapitalization" }, 2000000000] }
                }
            } else {
                if (mc === "small") {
                    query["$expr"] = { $lt: [{ $toDouble: "$marketCapitalization" }, 2000000000] }
                } else if (mc === 'medium') {
                    query["$and"] = [
                        { $expr: { $lt: [{ $toDouble: "$marketCapitalization" }, 10000000000] } },
                        { $expr: { $gt: [{ $toDouble: "$marketCapitalization" }, 2000000000] } }
                    ]
                } else if (mc === 'large') {
                    query["$expr"] = { $gte: [{ $toDouble: "$marketCapitalization" }, 10000000000] }
                }
            }
        }
        const stocks = await stockModel.find(query, listIncludeFields);
        res.json({ "stocks": stocks });
    }
});

router.get('/search', async (req, res) => {
    let searchString = req.query.id;
    let query = {};
    query["$or"] = [
        { "isin": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "wkn": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "name": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "symbol": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
    ]
    console.log(query)
    const stocks = await stockModel.find(query, excludeFields);

    res.json({ "stocks": stocks })
});

router.get('/overview', async (req, res) => {
    let symbol = req.query.id;
    const stock = await stockModel.find({ "symbol": symbol }, {
        isin: true,	
        wkn: true,
        symbol: true,
        name: true,	
        price: true,
        per1d: true,
        per7d: true,
        per30d: true,
        per365d: true,
        marketCapitalization: true,
        analystTargetPrice: true,
        valuation: true,
        growth: true,
        div: true,
        mc: true,
        currency: true,	
        country: true,	
        industry: true,	
        picture: true,
        date: true,
        mcSize: true,
    });
    res.json({ "stocks": stock });
});

router.get('/details', async (req, res) => {
    let symbol = req.query.id;

    const stock = await stockModel.find({ "symbol": symbol }, { _id: false });
    res.json({ "stocks": stock });
});

router.get('/charts/analysts', async (req, res) => {
    let symbol = req.query.id;
    let stockAnalysis;

    stockAnalysis = await stockAnalysisModel.find({ "symbol": symbol }, {
        _id: false
    });

    if (stockAnalysis) {
        res.json(stockAnalysis);
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }

});

router.get('/charts/detailed-analysts', async (req, res) => {
    let symbol = req.query.id;
    let stockDetailedAnalysis;

    stockDetailedAnalysis = await stockDetailedAnalysisModel.find({ "symbol": symbol }, {
        _id: false
    });

    if (stockDetailedAnalysis) {
        res.json(stockDetailedAnalysis);
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/charts/historic', async (req, res) => {
    let symbol = req.query.id;
    let maxParam = req.query.max;
    let dataPoints;
    if (maxParam === 'false') {
        dataPoints = await dataPointModel.find({ "symbol": symbol }, {
            symbol: false,
            _id: false
        });
        dataPoints = { "dataPoints": dataPoints[0]["dataPoints"].slice(0, 1260) };
    } else {
        dataPoints = await dataPointModel.find({ "symbol": symbol }, {
            symbol: false,
            _id: false
        });
        dataPoints = dataPoints[0]
    }

    if (dataPoints) {
        res.json(dataPoints);
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }

});

router.get('/charts/dividend', async (req, res) => {
    let id = req.query.id;
    let max = req.query.max;
    let date;
    let quota;
    let dataPoints;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
    } catch (e) {
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    if (max !== 'true') {
        dataPoints = await dividendModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        date = dataPoints[0]["date"];
        quota = dataPoints[0]["quota"];
        dataPoints = dataPoints[0]["dataPoints"].slice(0, 5);
    } else {
        dataPoints = await dividendModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        date = dataPoints[0]["date"];
        quota = dataPoints[0]["quota"];
        dataPoints = dataPoints[0]["dataPoints"];
    }

    if (dataPoints) {
        res.json({ "symbol": id, dataPoints, date, quota });
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/news', async (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    var threeDaysAgoString = date.toISOString().slice(0, 10);

    var id = req.query.id;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    let name;
    try {
        name = stocks[0]["name"];
    } catch (e) {
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + name +
        '&from=' + threeDaysAgoString +
        '&sortBy=popularity' +
        '&language=en' +
        '&domains=yahoo.com,seekingalpha.com,marketwatch.com,investors.com,bloomberg.com' +
        '&apiKey=' + process.env.news_api_key;

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            let articles = data["articles"];
            let news = []

            articles.forEach(article => {
                news.push(
                    {
                        "id": id,
                        "headline": article["title"],
                        "summary": article["description"].replace(/\n/g, ""),
                        "url": article["url"],
                        "publishedAt" : article["publishedAt"]
                    }
                )
            })
            res.json({ "news": news });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
});

router.get('/balanceSheet', async (req, res) => {
    let id = req.query.id;
    let isExist = false;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
        isExist = true;
    } catch (e) {
        isExist = false;
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    if (isExist) {
        let balanceSheet = await balanceSheetModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        res.json({
            "symbol": id,
            "annualReports": balanceSheet[0]["annualReports"],
            "quarterlyReports": balanceSheet[0]["quarterlyReports"]
        });
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/incomeStatement', async (req, res) => {
    let id = req.query.id;
    let isExist = false;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
        isExist = true;
    } catch (e) {
        isExist = false;
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    if (isExist) {
        let incomeStatement = await incomeStatementModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        res.json({
            "symbol": id,
            "annualReports": incomeStatement[0]["annualReports"],
            "quarterlyReports": incomeStatement[0]["quarterlyReports"]
        });
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/cashFlow', async (req, res) => {
    let id = req.query.id;
    let isExist = false;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
        isExist = true;
    } catch (e) {
        isExist = false;
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    if (isExist) {
        let cashFlow = await cashFlowModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        res.json({
            "symbol": id,
            "annualReports": cashFlow[0]["annualReports"],
            "quarterlyReports": cashFlow[0]["quarterlyReports"]
        });
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/charts/key_figures', async (req, res) => {
    let id = req.query.id;
    let max = req.query.max;
    let keyFigures;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
    } catch (e) {
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    if (max !== 'true') {
        keyFigures = await keyFigureModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        keyFigures = keyFigures[0]["keyFigures"].slice(0, 20);
    } else {
        keyFigures = await keyFigureModel.find({ "symbol": id }, {
            symbol: false,
            _id: false
        });
        keyFigures = keyFigures[0]["keyFigures"];
    }

    if (keyFigures) {
        res.json({ "symbol": id, keyFigures });
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});

router.get('/finanzen', async (req, res) => {
    let id = req.query.id;
    if (id.toLowerCase() === 'sp_500' || id.toLowerCase() === 'sp500')
        id = 's&p_500';
    console.log(id);

    let url = "https://www.finanzen.net/index/" + id;
    let html;

    await fetch(url)
        .then(res => res.text())
        .then(text => {
            html = text;
        })
        .catch(err => console.log(err));

    html = html.replace(/\s/g, "");

    let result1 = html.match(/(?<=col-xs-5col-sm-4text-sm-righttext-nowrap\">).*?(?=<\/span>)/gs);
    if (!result1 || result1.length === 0) {
        res.json({ "error": "STOCK_ID_INVALID" });
    }
    if (!!result1) {
        for (let i = 0; i < result1.length; i++) {
            result1[i] = result1[i].replace(/<span>/g, "");
            result1[i] = result1[i].replace(/PKT/g, "");
            result1[i] = result1[i].replace(".", "");
            result1[i] = result1[i].replace(",", ".");
        }
    }
    let result2 = html.match(/(?<=col-xs-4col-sm-3text-sm-righttext-nowraptext-centergreen\">).*?(?=<\/span>)/gs);
    let result22 = html.match(/(?<=col-xs-4col-sm-3text-sm-righttext-nowraptext-centerred\">).*?(?=<\/span>)/gs);

    result2 = result2.concat(result22);

    if (!!result2) {
        for (let i = 0; i < result2.length; i++) {
            if (result2[i] !== null) {
                result2[i] = result2[i].replace(/<span>/g, "");
                result2[i] = result2[i].replace(/PKT/g, "");
                result2[i] = result2[i].replace(".", "");
                result2[i] = result2[i].replace(",", ".");
            }
        }
    }

    result2 = result2.filter(item => item !== null);

    let result3 = html.match(/(?<=col-xs-3col-sm-3text-righttext-nowrapred\">).*?(?=<\/span>)/gs);

    if (!result3 || result3 === null) {
        result3 = html.match(/(?<=col-xs-3col-sm-3text-righttext-nowrapgreen\">).*?(?=<\/span>)/gs);
    }
    if (!!result3 && result3 !== null) {
        for (let i = 0; i < result3.length; i++) {
            result3[i] = result3[i].replace(/<span>/g, "");
            result3[i] = result3[i].replace(/PKT/g, "");
            result3[i] = result3[i].replace(/%/g, "");
            result3[i] = result3[i].replace(".", "");
            result3[i] = result3[i].replace(",", ".");
        }
    }

    let result4 = html.match(/(?<=col-xs-3col-sm-2text-righttext-nowrapred\">).*?(?=<\/span>)/gs);
    if (!result4 || result4 === null) {
        result4 = html.match(/(?<=col-xs-3col-sm-2text-righttext-nowrapgreen\">).*?(?=<\/span>)/gs);
    }
    if (!!result4 && result4 !== null) {
        for (let i = 0; i < result4.length; i++) {
            result4[i] = result4[i].replace(/<span>/g, "");
            result4[i] = result4[i].replace(/PKT/g, "");
            result4[i] = result4[i].replace(/%/g, "");
            result4[i] = result4[i].replace(".", "");
            result4[i] = result4[i].replace(",", ".");
        }
    }

    let result5 = result3.concat(result4);

    res.json({"id" : id, "first" : result1, "second" : result2, "third" : result5});

});

module.exports = router