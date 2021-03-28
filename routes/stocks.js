'use strict';
const express = require('express');
const router = express.Router();

// todo implement all routes under 'stocks/...' like in user the way your front end team has specified them in the contract definition
// todo fill in mocks
const ibmStock = {
    "symbol": "IBM",
    "ISIN": "US4592001014",
    "WKN": "851399",
    "name": "International Business Machines Corporation",
    "price": "175.29",
    "1d": "2.25",
    "7d": "1.52",
    "30d": "0.92",
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
    "ISIN": "US0378331005",
    "WKN": "865985",
    "name": "Apple Inc",
    "price": "252.19",
    "1d": "1.79",
    "7d": "1.52",
    "30d": "0.92",
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
    "ISIN": "US9278331005",
    "WKN": "358331",
    "name": "Microsoft Corporation",
    "price": "278.19",
    "1d": "3.29",
    "7d": "1.12",
    "30d": "1.02",
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
    "ISIN": "US9383331005",
    "WKN": "871985",
    "name": "Morgan Stanley",
    "price": "97.22",
    "1d": "1.19",
    "7d": "1.22",
    "30d": "0.75",
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

router.get('/', (req, res) => {
    var response = { "stocks": [ibmStock, appleStock, microsoftStock, morganStanleyStock] };
    res.json(response);
});


/**
 * @swagger
 * /stocks/{id}: 
 *  get:
 *   summary: Returns a stock with given id.
 *   description: Returns a stock with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          $ref: '#/definitions/stockk'
 *    '400':
 *      description: Invalid
 */

router.get('/:id', (req, res) => {
    var id = req.params.id;
    let response;
    if (id == "IBM") {
        response = ibmStock;
        res.json(response);
    } else if (id == "AAPL") {
        response = appleStock;
        res.json(response);
    } else if (id == "MSFT") {
        response = microsoftStock;
        res.json(response);
    } else if (id == "MS") {
        response = morganStanleyStock;
        res.json(response);
    } else {
        response = { "error": "STOCK_ID_INVALID" }
        res.status(404).json(response);
    }
});


/**
 * @swagger
 * /stocks/{id}/details:
 *  get:
 *   summary: Returns details of a stock with given id.
 *   description: Returns details of a stock with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          $ref: '#/definitions/stockDetails'
 *    '400':
 *      description: Invalid
 */

router.get('/:id/details', (req, res) => {
    var id = req.params.id;
    let response;
    if (id == "IBM") {
        response = ibmStockDetails;
        res.json(response);
    } else if (id == "AAPL") {
        response = appleStockDetails;
        res.json(response);
    } else if (id == "MSFT") {
        response = microsoftStockDetails;
        res.json(response);
    } else if (id == "MS") {
        response = morganStanleyStockDetails;
        res.json(response);
    } else {
        response = { "error": "STOCK_ID_INVALID" }
        res.status(404).json(response);
    }
});

module.exports = router
