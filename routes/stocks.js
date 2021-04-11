'use strict';
const express = require('express');
const router = express.Router();
const stockModel = require("../models/stock");
const dataPointModel = require('../models/dataPoint');
const dividendModel = require("../models/dividend");
const keyFigureModel = require("../models/keyFigure");
const fetch = require('node-fetch');

const ibmStock = {
    "symbol": "IBM",
    "isin": "US4592001014",
    "wkn": "851399",
    "name": "International Business Machines Corporation",
    "price": "175.29",
    "per1d": "2.25",
    "per7d": "1.52",
    "per30d": "0.92",
    "per365d": "0.71",
    "marketCapitalization": "114263867392",
    "analystTargetPrice": "137",
    "valuation": "20.6803",
    "growth": "1.5",
    "div": "0.0508",
    "currency": "USD",
    "country": "USA",
    "industry": "Consumer Electronics",
    "picture": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    "date": "2021-03-23T18:25:43.511Z"
}
const appleStock = {
    "symbol": "AAPL",
    "isin": "US0378331005",
    "wkn": "865985",
    "name": "Apple Inc",
    "price": "252.19",
    "per1d": "1.79",
    "per7d": "1.52",
    "per30d": "0.92",
    "per365d": "0.45",
    "marketCapitalization": "172637867392",
    "analystTargetPrice": "290.24",
    "valuation": "27.6803",
    "growth": "3.2",
    "div": "0.1208",
    "currency": "USD",
    "country": "USA",
    "industry": "Information Technology Services",
    "picture": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "date": "2021-03-23T18:25:43.511Z"
}
const sapStock = {
    "symbol": "SAP",
    "isin": "US0378331013",
    "wkn": "865984",
    "name": "SAP SE",
    "price": "252.19",
    "per1d": "1.79",
    "per7d": "1.52",
    "per30d": "0.92",
    "per365d": "0.45",
    "marketCapitalization": "172637867392",
    "analystTargetPrice": "290.24",
    "valuation": "27.6803",
    "growth": "3.2",
    "div": "0.1208",
    "currency": "EUR",
    "country": "Germany",
    "industry": "Information Technology Services",
    "picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/800px-SAP_2011_logo.svg.png",
    "date": "2021-03-23T18:25:43.511Z"
}
const microsoftStock = {
    "symbol": "MSFT",
    "isin": "US9278331005",
    "wkn": "358331",
    "name": "Microsoft Corporation",
    "price": "278.19",
    "per1d": "3.29",
    "per7d": "1.12",
    "per30d": "1.02",
    "per365d": "0.97",
    "marketCapitalization": "282737867392",
    "analystTargetPrice": "290.24",
    "valuation": "33.6803",
    "growth": "3.2",
    "div": "0.1208",
    "currency": "USD",
    "country": "USA",
    "industry": "Software-Infrastructure",
    "picture": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "date": "2021-03-23T18:25:43.511Z"
}
const morganStanleyStock = {
    "symbol": "MS",
    "isin": "US9383331005",
    "wkn": "871985",
    "name": "Morgan Stanley",
    "price": "97.22",
    "per1d": "1.19",
    "per7d": "1.22",
    "per30d": "0.75",
    "per365d": "0.67",
    "marketCapitalization": "23137867392",
    "analystTargetPrice": "150.34",
    "valuation": "33.2203",
    "growth": "3.2",
    "div": "0.518",
    "currency": "USD",
    "country": "USA",
    "industry": "Capital Markets",
    "picture": "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg",
    "date": "2021-03-23T18:25:43.511Z"
}

const ibmStockDetails = {
    "symbol": "IBM",
    "intro": "International Business Machines Corporation provides integrated solutions and services worldwide.",
    "founded": "2014",
    "website": "ibm.com",
    "fullTimeEmployees": "345900",
    "address": "One New Orchard Road, Armonk, NY, United States, 10504",
    "assembly": "2021-04-19"
}
const appleStockDetails = {
    "symbol": "AAPL",
    "intro": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    "founded": "1988",
    "website": "apple.com",
    "fullTimeEmployees": "345900",
    "address": "Adana Street, Washington, United States, 10504",
    "assembly": "2021-04-19"
}
const microsoftStockDetails = {
    "symbol": "MSFT",
    "intro": "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    "founded": "1992",
    "website": "microsoft.com",
    "fullTimeEmployees": "212900",
    "address": "Kensel Street, Boston, United States, 10504",
    "assembly": "2021-06-05"
}
const morganStanleyStockDetails = {
    "symbol": "MS",
    "intro": "Morgan Stanley, a financial holding company, provides various financial products and services to corporations, governments, financial institutions worldwide.",
    "founded": "1935",
    "website": "morganstanley.com",
    "fullTimeEmployees": "142300",
    "address": "One New Worshe Road, Armark, NY, United States, 10514",
    "assembly": "2021-05-19"
}
const sapStockDetails = {
    "symbol": "SAP",
    "intro": "SAP, software services company",
    "founded": "1935",
    "website": "sap.com",
    "fullTimeEmployees": "142300",
    "address": "Walldorf, 10237, Germany",
    "assembly": "2021-05-23"
}

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
    let response;
    let isError = false;

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
    let response;
    let isError = false;

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
    let response;
    let isError = false;

    let symbol = req.query.id;
    const stock = await stockModel.find({ "symbol": symbol }, {
        _id: false,
        founded: false,
        intro: false,
        employees: false,
        website: false,
        assembly: false,
        address: false,
    });
    res.json({ "stocks": stock });
});

router.get('/details', async (req, res) => {
    let response;
    let isError = false;

    let symbol = req.query.id;

    const stock = await stockModel.find({ "symbol": symbol }, { _id: false });
    res.json({ "stocks": stock });
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


const rating1 = { "date": "2021-01-19", "goal": "345770", "strategy": "buy", "source": "investing.com" }
const rating2 = { "date": "2021-01-20", "goal": "345727", "strategy": "hold", "source": "investing.com" }
const rating3 = { "date": "2021-01-21", "goal": "346718", "strategy": "sell", "source": "investing.com" }
const rating4 = { "date": "2021-01-22", "goal": "346766", "strategy": "sell", "source": "investing.com" }
const rating5 = { "date": "2021-01-23", "goal": "346793", "strategy": "sell", "source": "investing.com" }
const rating6 = { "date": "2021-01-24", "goal": "344768", "strategy": "sell", "source": "investing.com" }
const rating7 = { "date": "2021-01-25", "goal": "344812", "strategy": "hold", "source": "investing.com" }
const rating8 = { "date": "2021-01-26", "goal": "345849", "strategy": "buy", "source": "investing.com" }
const rating9 = { "date": "2021-01-27", "goal": "345932", "strategy": "hold", "source": "investing.com" }
const rating10 = { "date": "2021-01-28", "goal": "345904", "strategy": "hold", "source": "investing.com" }
const rating11 = { "date": "2021-01-29", "goal": "345912", "strategy": "sell", "source": "investing.com" }
const rating12 = { "date": "2021-01-30", "goal": "345770", "strategy": "sell", "source": "investing.com" }
const rating13 = { "date": "2021-01-31", "goal": "345727", "strategy": "sell", "source": "investing.com" }
const rating14 = { "date": "2021-02-01", "goal": "346718", "strategy": "sell", "source": "investing.com" }
const rating15 = { "date": "2021-02-02", "goal": "347766", "strategy": "sell", "source": "investing.com" }
const rating16 = { "date": "2021-02-03", "goal": "346793", "strategy": "hold", "source": "investing.com" }
const rating17 = { "date": "2021-02-04", "goal": "345768", "strategy": "hold", "source": "investing.com" }
const rating18 = { "date": "2021-02-05", "goal": "343812", "strategy": "hold", "source": "investing.com" }
const rating19 = { "date": "2021-02-06", "goal": "345849", "strategy": "buy", "source": "investing.com" }
const rating20 = { "date": "2021-02-07", "goal": "345932", "strategy": "sell", "source": "investing.com" }

const ratings = [rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9, rating10, rating11,
    rating12, rating13, rating14, rating15, rating16, rating17, rating18, rating19, rating20];

router.get('/charts/analysts', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let response;

    if (id === "IBM") {
        response = { "ratings": ratings, "averageGoal": "345961" };
    } else if (id === "AAPL") {
        response = { "ratings": ratings, "averageGoal": "345961" };
    } else if (id === "MSFT") {
        response = { "ratings": ratings, "averageGoal": "345961" };
    } else if (id === "MS") {
        response = { "ratings": ratings, "averageGoal": "345961" };
    } else {
        isError = true;
        response = { "error": "STOCK_ID_INVALID" }
    }

    !isError && res.json(response);
    isError && res.status(404).json(response);

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
        res.json({"symbol" : id, dataPoints, date, quota});
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }
});


// router.get('/charts/dividend', async (req, res) => {
//     let id = req.query.id;
//     let max = req.query.max;
//
//     let query = {};
//     query["symbol"] = id;
//     let stocks = await stockModel.find(query, '-_id');
//     let name;
//     try {
//         name = stocks[0]["name"];
//     } catch (e) {
//         res.status(404).json({ "error": "STOCK_ID_INVALID" });
//     }
//
//     let urlOverview = 'https://www.alphavantage.co/query?' +
//         'function=OVERVIEW' +
//         '&symbol=' + id +
//         '&apikey=' + process.env.alpha_vantage_key;
//
//     let urlCashFlow = 'https://www.alphavantage.co/query?' +
//         'function=CASH_FLOW' +
//         '&symbol=' + id +
//         '&apikey=' + process.env.alpha_vantage_key;
//
//     let settings = { method: "Get" };
//
//     if (!!id && !!max) {
//         let dividendDate;
//         let quota;
//         let dataPoints = [];
//
//         await fetch(urlOverview, settings)
//             .then(res => res.json())
//             .then((json) => {
//                 dividendDate = json['DividendDate'];
//                 quota = json['PayoutRatio'];
//             });
//         await fetch(urlCashFlow, settings)
//             .then(res => res.json())
//             .then((json) => {
//                 let annualReports = json['annualReports'];
//                 let counter = 0;
//                 !!annualReports && annualReports.forEach(annualReport => {
//                     if (counter < 5) {
//                         dataPoints.push(
//                             {
//                                 "date": annualReport['fiscalDateEnding'],
//                                 "div": String(annualReport['dividendPayout'] / annualReport['netIncome'])
//                             }
//                         )
//                     }
//                     if (max !== 'true') counter++;
//                 })
//
//             });
//
//         res.json({ "symbol" : id, "dataPoints": dataPoints, "date": dividendDate, "quota": quota });
//     } else {
//         res.status(404).json({ "error": "STOCK_ID_INVALID" });
//     }
//
// });

router.get('/news', async (req, res) => {
    var date = new Date();
    date.setDate(date.getDate() - 3);
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
                        "url": article["url"]
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
    var id = req.query.id;

    let query = {};
    query["symbol"] = id;
    let stocks = await stockModel.find(query, '-_id');
    try {
        stocks[0]["name"];
    } catch (e) {
        res.status(404).json({ "error": "STOCK_ID_INVALID" });
    }

    let url = 'https://www.alphavantage.co/query?function=BALANCE_SHEET' +
        '&symbol=' + id +
        '&apikey=' + process.env.alpha_vantage_key;

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
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
        res.json({"symbol" : id, keyFigures});
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }

});


// router.get('/charts/key_figures', async (req, res) => {
//     var id = req.query.id;
//     var max = req.query.max;
//
//     let query = {};
//     query["symbol"] = id;
//     let stocks = await stockModel.find(query, '-_id');
//     let name;
//     try {
//         name = stocks[0]["name"];
//     } catch (e) {
//         res.status(404).json({ "error": "STOCK_ID_INVALID" });
//     }
//
//     let url = 'https://www.alphavantage.co/query?function=EARNINGS' +
//         '&symbol=' + id +
//         '&apikey=' + process.env.alpha_vantage_key;
//
//     await fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             let symbol = data["symbol"];
//             let quarterlyEarnings = data["quarterlyEarnings"];
//             let keyFigures;
//
//             if (max !== false) {
//                 keyFigures = quarterlyEarnings.slice(0, 20);
//             } else {
//                 keyFigures = quarterlyEarnings;
//             }
//
//             res.json({ "symbol": symbol, "keyFigures": keyFigures });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(404).json(err);
//         })
// });

module.exports = router