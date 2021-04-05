'use strict';
const express = require('express');
const router = express.Router();
const stockModel = require("../models/stock");

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

/**
 * @swagger
 * /stocks/:
 *  get:
 *   summary: Returns a list of all stocks.
 *   description: Returns a list of all stocks.
 *   produces:
 *     - application/json
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 */

// fixme: stocks from database are reformated wrongly

// router.get('/list', async (req, res) => {
//     //const stocks = await stockModel.find({});
//     const stocks = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
//     res.json(stocks);
// });

router.get('/list', async (req, res) => {
    let response;
    let isError = false;

    let currency = req.query.currency;
    let country = req.query.country;
    let industry = req.query.industry;
    let mc = req.query.mc; // either small, medium or large market capitalization

    if (currency === undefined && country === undefined && industry === undefined && mc === undefined) {
        response = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
    } else {
        if (currency === "USD") {   // currency
            response = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
        } else if (country === "USA") { // country
            response = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
        } else if ("Consumer Electronics".includes(industry)) { //industry
            response = {"stocks": [ibmStock]};
        } else if ("Information Technology Services".includes(industry)) {
            response = {"stocks": [appleStock]};
        } else if ("Software-Infrastructure".includes(industry)) {
            response = {"stocks": [microsoftStock]};
        } else if ("Capital Markets".includes(industry)) {
            response = {"stocks": [morganStanleyStock]};
        } else if (mc === "small") { // market capitalization
            response = {"stocks": [morganStanleyStock]};
        } else if (mc === "medium") {
            response = {"stocks": [ibmStock, microsoftStock]};
        } else if (mc === "large") {
            response = {"stocks": [appleStock]};
        } else {
            isError = true;
            response = {"error": "STOCK_ID_INVALID"}
        }
    }
    !isError && res.json(response);
    isError && res.status(404).json(response);
});

router.get('/search', async (req, res) => {
    let response;
    let isError = false;

    let id = req.query.id;

    if (id === "IBM" || id === "International Business Machines Corporation" || id === "US4592001014" || id === "851399") {
        response = {"stocks": [ibmStock]};
    } else if (id === "AAPL" || id === "Apple Inc" || id === "US0378331005" || id === "865985") {
        response = {"stocks": [appleStock]};
    } else if (id === "MSFT" || id === "Microsoft Corporation" || id === "US9278331005" || id === "358331") {
        response = {"stocks": [microsoftStock]};
    } else if (id === "MS" || id === "Morgan Stanley" || id === "US9383331005" || id === "871985") {
        response = {"stocks": [morganStanleyStock]};
    } else {
        isError = true;
        response = {"error": "STOCK_ID_INVALID"}
    }

    !isError && res.json(response);
    isError && res.status(404).json(response);
});

// router.get('/search', async (req, res) => {
//     let response;
//     let isError = false;
//
//     let input = req.query.input;
//     let currency = req.query.currency;
//     let country = req.query.country;
//     let industry = req.query.industry;
//
//     if (input !== undefined) {
//         if (input === "IBM" || input === "International Business Machines Corporation" || input === "US4592001014" || input === "851399") {
//             response = {"stocks": [ibmStock]};
//         } else if (input === "AAPL" || input === "Apple Inc" || input === "US0378331005" || input === "865985") {
//             response = {"stocks": [appleStock]};
//         } else if (input === "MSFT" || input === "Microsoft Corporation" || input === "US9278331005" || input === "358331") {
//             response = {"stocks": [microsoftStock]};
//         } else if (input === "MS" || input === "Morgan Stanley" || input === "US9383331005" || input === "871985") {
//             response = {"stocks": [morganStanleyStock]};
//         } else {
//             isError = true;
//             response = {"error": "STOCK_ID_INVALID"}
//         }
//     } else {
//         if (currency === "USD") {   // currency
//             response = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
//         } else if (country === "USA") { // country
//             response = {"stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock]};
//         } else if ("Consumer Electronics".includes(industry)) { //industry
//             response = {"stocks": [ibmStock]};
//         } else if ("Information Technology Services".includes(industry)) {
//             response = {"stocks": [appleStock]};
//         } else if ("Software-Infrastructure".includes(industry)) {
//             response = {"stocks": [microsoftStock]};
//         } else if ("Capital Markets".includes(industry)) {
//             response = {"stocks": [morganStanleyStock]};
//         } else {
//             isError = true;
//             response = {"error": "STOCK_ID_INVALID"}
//         }
//     }
//     !isError && res.json(response);
//     isError && res.status(404).json(response);
// });

// router.get('/:id', (req, res) => {
//     var id = req.params.id;
//     let response;
//     if (id === "IBM") {
//         response = ibmStock;
//         res.json(response);
//     } else if (id === "AAPL") {
//         response = appleStock;
//         res.json(response);
//     } else if (id === "MSFT") {
//         response = microsoftStock;
//         res.json(response);
//     } else if (id === "MS") {
//         response = morganStanleyStock;
//         res.json(response);
//     } else {
//         response = {"error": "STOCK_ID_INVALID"}
//         res.status(404).json(response);
//     }
// });


// router.get('/:id/details', (req, res) => {
//     var id = req.params.id;
//     let response;
//     if (id === "IBM") {
//         response = ibmStockDetails;
//         res.json(response);
//     } else if (id === "AAPL") {
//         response = appleStockDetails;
//         res.json(response);
//     } else if (id === "MSFT") {
//         response = microsoftStockDetails;
//         res.json(response);
//     } else if (id === "MS") {
//         response = morganStanleyStockDetails;
//         res.json(response);
//     } else {
//         response = {"error": "STOCK_ID_INVALID"}
//         res.status(404).json(response);
//     }
// });

router.get('/details/search', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let response;
    if (id === "IBM") {
        response = ibmStockDetails;
    } else if (id === "AAPL") {
        response = appleStockDetails;
    } else if (id === "MSFT") {
        response = microsoftStockDetails;
    } else if (id === "MS") {
        response = morganStanleyStockDetails;
    } else {
        isError = true;
        response = {"error": "STOCK_ID_INVALID"}
    }
    !isError && res.json(response);
    isError && res.status(404).json(response);
});

const dataPoint1 = {"date": "2021-01-19", "close": "1.1770"}
const dataPoint2 = {"date": "2021-01-20", "close": "1.1727"}
const dataPoint3 = {"date": "2021-01-21", "close": "1.1718"}
const dataPoint4 = {"date": "2021-01-22", "close": "1.1766"}
const dataPoint5 = {"date": "2021-01-23", "close": "1.1793"}
const dataPoint6 = {"date": "2021-01-24", "close": "1.1768"}
const dataPoint7 = {"date": "2021-01-25", "close": "1.1812"}
const dataPoint8 = {"date": "2021-01-26", "close": "1.1849"}
const dataPoint9 = {"date": "2021-01-27", "close": "1.1932"}
const dataPoint10 = {"date": "2021-01-28", "close": "1.1904"}
const dataPoint11 = {"date": "2021-01-29", "close": "1.1912"}
const dataPoint12 = {"date": "2021-01-30", "close": "1.1770"}
const dataPoint13 = {"date": "2021-01-31", "close": "1.1727"}
const dataPoint14 = {"date": "2021-02-01", "close": "1.1718"}
const dataPoint15 = {"date": "2021-02-02", "close": "1.1766"}
const dataPoint16 = {"date": "2021-02-03", "close": "1.1793"}
const dataPoint17 = {"date": "2021-02-04", "close": "1.1768"}
const dataPoint18 = {"date": "2021-02-05", "close": "1.1812"}
const dataPoint19 = {"date": "2021-02-06", "close": "1.1849"}
const dataPoint20 = {"date": "2021-02-07", "close": "1.1932"}
const dataPoint21 = {"date": "2021-02-08", "close": "1.1904"}
const dataPoint22 = {"date": "2021-02-09", "close": "1.1912"}

const dataPointsLess = {
    "dataPoints": [dataPoint1, dataPoint2, dataPoint3, dataPoint4, dataPoint5,
        dataPoint6, dataPoint7, dataPoint8, dataPoint9, dataPoint10, dataPoint11]
};
const dataPointsMore = {
    "dataPoints": [dataPoint1, dataPoint2, dataPoint3, dataPoint4, dataPoint5, dataPoint6,
        dataPoint7, dataPoint8, dataPoint9, dataPoint10, dataPoint11, dataPoint12, dataPoint13, dataPoint14,
        dataPoint15, dataPoint16, dataPoint17, dataPoint18, dataPoint19, dataPoint20, dataPoint21, dataPoint22]
};

router.get('/charts/historic/search', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let max = req.query.max;
    let response;

    if (id !== undefined && max !== undefined) {

        if (max === "false") {
            if (id === "IBM") {
                response = dataPointsLess;
            } else if (id === "AAPL") {
                response = dataPointsLess;
            } else if (id === "MSFT") {
                response = dataPointsLess;
            } else if (id === "MS") {
                response = dataPointsLess;
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else if (max === "true") {
            if (id === "IBM") {
                response = dataPointsMore;
            } else if (id === "AAPL") {
                response = dataPointsMore;
            } else if (id === "MSFT") {
                response = dataPointsMore;
            } else if (id === "MS") {
                response = dataPointsMore;
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else {
            isError = true;
            response = {"error": "STOCK_ID_INVALID"}
        }
    } else {
        response = {"error": "STOCK_ID_INVALID"}
    }

    !isError && res.json(response);
    isError && res.status(404).json(response);

});

const keyFigure1 = {"date": "2021-01-19", "pte": "1.587", "PriceToBookRatio": "5.345", "ptg": "1.7978", "eps": "1.789"}
const keyFigure2 = {"date": "2021-01-20", "pte": "1.678", "PriceToBookRatio": "5.645", "ptg": "1.789", "eps": "1.789"}
const keyFigure3 = {"date": "2021-01-21", "pte": "1.786", "PriceToBookRatio": "5.789", "ptg": "1.7897", "eps": "1.97"}
const keyFigure4 = {"date": "2021-01-22", "pte": "1.543", "PriceToBookRatio": "5.34", "ptg": "1.798", "eps": "1.678"}
const keyFigure5 = {"date": "2021-01-23", "pte": "1.687", "PriceToBookRatio": "5.435", "ptg": "1.978", "eps": "1.6798"}
const keyFigure6 = {
    "date": "2021-01-24",
    "pte": "1.45654",
    "PriceToBookRatio": "5.345",
    "ptg": "1.789",
    "eps": "1.6798"
}
const keyFigure7 = {"date": "2021-01-25", "pte": "1.456", "PriceToBookRatio": "5.345", "ptg": "1.789", "eps": "1.6789"}
const keyFigure8 = {"date": "2021-01-26", "pte": "1.456", "PriceToBookRatio": "5.435", "ptg": "1.97", "eps": "1.6789"}
const keyFigure9 = {"date": "2021-01-27", "pte": "1.54", "PriceToBookRatio": "5.45", "ptg": "1.978", "eps": "1.956"}
const keyFigure10 = {
    "date": "2021-01-28",
    "pte": "1.45654",
    "PriceToBookRatio": "5.786",
    "ptg": "1.789",
    "eps": "1.769"
}
const keyFigure11 = {"date": "2021-01-29", "pte": "1.456", "PriceToBookRatio": "5.345", "ptg": "1.789", "eps": "1.7698"}
const keyFigure12 = {"date": "2021-01-30", "pte": "1.687", "PriceToBookRatio": "5.45", "ptg": "1.997", "eps": "1.67"}
const keyFigure13 = {"date": "2021-01-31", "pte": "1.546", "PriceToBookRatio": "5.645", "ptg": "1.798", "eps": "1.6789"}
const keyFigure14 = {"date": "2021-02-01", "pte": "1.768", "PriceToBookRatio": "5.786", "ptg": "1.789", "eps": "1.7689"}
const keyFigure15 = {"date": "2021-02-02", "pte": "1.354", "PriceToBookRatio": "5.456", "ptg": "1.78", "eps": "1.7698"}
const keyFigure16 = {"date": "2021-02-03", "pte": "1.678", "PriceToBookRatio": "5.245", "ptg": "1.789", "eps": "1.7698"}
const keyFigure17 = {"date": "2021-02-04", "pte": "1.876", "PriceToBookRatio": "5.786", "ptg": "1.978", "eps": "1.7689"}
const keyFigure18 = {"date": "2021-02-05", "pte": "1.645", "PriceToBookRatio": "5.94", "ptg": "1.789", "eps": "1.97"}
const keyFigure19 = {"date": "2021-02-06", "pte": "1.786", "PriceToBookRatio": "5.78", "ptg": "1.978", "eps": "1.7"}
const keyFigure20 = {"date": "2021-02-07", "pte": "1.456", "PriceToBookRatio": "5.456", "ptg": "1.789", "eps": "1.68"}

const keyFiguresLess = {
    "keyFigures": [keyFigure1, keyFigure2, keyFigure3, keyFigure4, keyFigure5, keyFigure6,
        keyFigure7, keyFigure8, keyFigure9, keyFigure10]
};
const keyFiguresMore = {
    "keyFigures": [keyFigure1, keyFigure2, keyFigure3, keyFigure4, keyFigure5, keyFigure6,
        keyFigure7, keyFigure8, keyFigure9, keyFigure10,
        keyFigure11, keyFigure12, keyFigure13, keyFigure14, keyFigure15,
        keyFigure16, keyFigure17, keyFigure18, keyFigure19, keyFigure20]
};

router.get('/charts/key_figures/search', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let max = req.query.max;
    let response;

    if (id !== undefined && max !== undefined) {

        if (max === "false") {
            if (id === "IBM") {
                response = keyFiguresLess;
            } else if (id === "AAPL") {
                response = keyFiguresLess;
            } else if (id === "MSFT") {
                response = keyFiguresLess;
            } else if (id === "MS") {
                response = keyFiguresLess;
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else if (max === "true") {
            if (id === "IBM") {
                response = keyFiguresMore;
            } else if (id === "AAPL") {
                response = keyFiguresMore;
            } else if (id === "MSFT") {
                response = keyFiguresMore;
            } else if (id === "MS") {
                response = keyFiguresMore;
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else {
            isError = true;
            response = {"error": "STOCK_ID_INVALID"}
        }
    } else {
        response = {"error": "STOCK_ID_INVALID"}
    }

    !isError && res.json(response);
    isError && res.status(404).json(response);

});

const dp1 = {"date": "2021-01-19", "div": "0.0770"}
const dp2 = {"date": "2021-01-20", "div": "0.0727"}
const dp3 = {"date": "2021-01-21", "div": "0.0718"}
const dp4 = {"date": "2021-01-22", "div": "0.0766"}
const dp5 = {"date": "2021-01-23", "div": "0.0793"}
const dp6 = {"date": "2021-01-24", "div": "0.0768"}
const dp7 = {"date": "2021-01-25", "div": "0.0812"}
const dp8 = {"date": "2021-01-26", "div": "0.0849"}
const dp9 = {"date": "2021-01-27", "div": "0.0932"}
const dp10 = {"date": "2021-01-28", "div": "0.0904"}
const dp11 = {"date": "2021-01-29", "div": "0.0912"}
const dp12 = {"date": "2021-01-30", "div": "0.0770"}
const dp13 = {"date": "2021-01-31", "div": "0.0727"}
const dp14 = {"date": "2021-02-01", "div": "0.0718"}
const dp15 = {"date": "2021-02-02", "div": "0.0766"}
const dp16 = {"date": "2021-02-03", "div": "0.0793"}
const dp17 = {"date": "2021-02-04", "div": "0.0768"}
const dp18 = {"date": "2021-02-05", "div": "0.0812"}
const dp19 = {"date": "2021-02-06", "div": "0.0849"}
const dp20 = {"date": "2021-02-07", "div": "0.0932"}
const dp21 = {"date": "2021-02-08", "div": "0.0904"}
const dp22 = {"date": "2021-02-09", "div": "0.0912"}

const dpLess = [dp1, dp2, dp3, dp4, dp5, dp6, dp7, dp8, dp9, dp10, dp11];
const dpMore = [dp1, dp2, dp3, dp4, dp5, dp6, dp7, dp8, dp9, dp10, dp11,
    dp12, dp13, dp14, dp15, dp16, dp17, dp18, dp19, dp20, dp21, dp22];

router.get('/charts/dividend/search', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let max = req.query.max;
    let response;

    if (id !== undefined && max !== undefined) {

        if (max === "false") {
            if (id === "IBM") {
                response = {"dataPoints": dpLess, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "AAPL") {
                response = {"dataPoints": dpLess, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "MSFT") {
                response = {"dataPoints": dpLess, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "MS") {
                response = {"dataPoints": dpLess, "date": "2021-05-03", "quota": "0.03"};
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else if (max === "true") {
            if (id === "IBM") {
                response = {"dataPoints": dpMore, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "AAPL") {
                response = {"dataPoints": dpMore, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "MSFT") {
                response = {"dataPoints": dpMore, "date": "2021-05-03", "quota": "0.03"};
            } else if (id === "MS") {
                response = {"dataPoints": dpMore, "date": "2021-05-03", "quota": "0.03"};
            } else {
                isError = true;
                response = {"error": "STOCK_ID_INVALID"}
            }
        } else {
            isError = true;
            response = {"error": "STOCK_ID_INVALID"}
        }
    } else {
        response = {"error": "STOCK_ID_INVALID"}
    }

    !isError && res.json(response);
    isError && res.status(404).json(response);

});

const rating1 = {"date": "2021-01-19", "goal": "345770", "strategy": "buy", "source": "investing.com"}
const rating2 = {"date": "2021-01-20", "goal": "345727", "strategy": "hold", "source": "investing.com"}
const rating3 = {"date": "2021-01-21", "goal": "346718", "strategy": "sell", "source": "investing.com"}
const rating4 = {"date": "2021-01-22", "goal": "346766", "strategy": "sell", "source": "investing.com"}
const rating5 = {"date": "2021-01-23", "goal": "346793", "strategy": "sell", "source": "investing.com"}
const rating6 = {"date": "2021-01-24", "goal": "344768", "strategy": "sell", "source": "investing.com"}
const rating7 = {"date": "2021-01-25", "goal": "344812", "strategy": "hold", "source": "investing.com"}
const rating8 = {"date": "2021-01-26", "goal": "345849", "strategy": "buy", "source": "investing.com"}
const rating9 = {"date": "2021-01-27", "goal": "345932", "strategy": "hold", "source": "investing.com"}
const rating10 = {"date": "2021-01-28", "goal": "345904", "strategy": "hold", "source": "investing.com"}
const rating11 = {"date": "2021-01-29", "goal": "345912", "strategy": "sell", "source": "investing.com"}
const rating12 = {"date": "2021-01-30", "goal": "345770", "strategy": "sell", "source": "investing.com"}
const rating13 = {"date": "2021-01-31", "goal": "345727", "strategy": "sell", "source": "investing.com"}
const rating14 = {"date": "2021-02-01", "goal": "346718", "strategy": "sell", "source": "investing.com"}
const rating15 = {"date": "2021-02-02", "goal": "347766", "strategy": "sell", "source": "investing.com"}
const rating16 = {"date": "2021-02-03", "goal": "346793", "strategy": "hold", "source": "investing.com"}
const rating17 = {"date": "2021-02-04", "goal": "345768", "strategy": "hold", "source": "investing.com"}
const rating18 = {"date": "2021-02-05", "goal": "343812", "strategy": "hold", "source": "investing.com"}
const rating19 = {"date": "2021-02-06", "goal": "345849", "strategy": "buy", "source": "investing.com"}
const rating20 = {"date": "2021-02-07", "goal": "345932", "strategy": "sell", "source": "investing.com"}

const ratings = [rating1, rating2, rating3, rating4, rating5, rating6, rating7, rating8, rating9, rating10, rating11,
    rating12, rating13, rating14, rating15, rating16, rating17, rating18, rating19, rating20];

router.get('/charts/analysts/search', (req, res) => {
    let isError = false;
    let id = req.query.id;
    let response;

    if (id === "IBM") {
        response = {"ratings": ratings, "averageGoal": "345961"};
    } else if (id === "AAPL") {
        response = {"ratings": ratings, "averageGoal": "345961"};
    } else if (id === "MSFT") {
        response = {"ratings": ratings, "averageGoal": "345961"};
    } else if (id === "MS") {
        response = {"ratings": ratings, "averageGoal": "345961"};
    } else {
        isError = true;
        response = {"error": "STOCK_ID_INVALID"}
    }


    !isError && res.json(response);
    isError && res.status(404).json(response);

});
module.exports = router