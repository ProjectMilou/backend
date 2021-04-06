'use strict';
const express = require('express');
const analytics = require('../data-analytics/analytics/analytics');
// Require analytics, alphaVantageAPI, dbConnection and data filtering module.


const router = express.Router();

const backtestMock = {
    "MDDMaxToMin": "-0.6242",
    "MDDInitialToMin": "0.0000",
    "dateMax": "2021-02-05",
    "dateMin": "2017-01-06",
    "maxValue": "17333.6900",
    "minValue": "6513.9700",
    "initialValue": "6513.9700",
    "bestYear": {
        "changeBest": "3914.8400",
        "yearBest": "2020",
        "growthRateBest": "0.3336"
    },
    "worstYear": {
        "changeWorst": "-137.9000",
        "yearWorst": "2018",
        "growthRateWorst": "-0.0153"
    },
    "finalPortfolioBalance": "10156.1700",
    "CAGR": 0.24892224713946032,
    "standardDeviation": 0.030303142486978612,
    "sharpeRatio": 0.46716646357345853
};

const diversificationMock = {
    industries: {
      'Consumer Electronics': 0.09523809523809523,
      'Internet Content & Information': 0.19047619047619047,
      'Internet Retail': 0.19047619047619047,
      'Information Technology Services': 0.14285714285714285,
      'Banks-Diversified': 0.38095238095238093
    },
    countries: { USA: 0.9999999999999999 },
    currencies: { USD: 0.9999999999999999 },
    assetClasses: { 'Common Stock': 0.9999999999999999 },
    sectors: {
      Technology: 0.23809523809523808,
      'Communication Services': 0.19047619047619047,
      'Consumer Cyclical': 0.19047619047619047,
      'Financial Services': 0.38095238095238093
    }
}

const PERatiosMock = {
    PERatios: {
      AAPL: '33.4662',
      GOOGL: '34.6457',
      AMZN: '74.3694',
      IBM: '20.945',
      BABA: '25.4694',
      JPM: '17.0011'
    },
    averagePEration: 28.763647619047617
}

const dividendsMock = {
    dividendyield: {
      AAPL: 0.0067,
      GOOGL: 0,
      AMZN: 0,
      IBM: 0.0505,
      BABA: 0,
      JPM: 0.0232
    },
    averageDividendyield: 0.01669047619047619
}

const gainLossMock = {
    totalGainLoss: 1020.6800000000001,
    AAPL: { symbolGainLoss: -22.599999999999994 },
    GOOGL: { symbolGainLoss: 1172.5999999999995 },
    AMZN: { symbolGainLoss: -362.39999999999964 },
    IBM: { symbolGainLoss: 29.940000000000055 },
    BABA: { symbolGainLoss: -1.7399999999999523 },
    JPM: { symbolGainLoss: 204.8800000000001 }
}

const volatilityCorrelationMock = {
    volatility: {
      Apple: 1.0304461557501514,
      Google: 0.5496680733681532,
      Amazon: 0.5993856976545141,
      IBM: 0.5765889119578946,
      'Alibaba group': 0.7140162113218156,
      'JPMorgan Chase & Co.': 0.6486754881067324
    },
    correlations: {
      'Apple to Google': 0.397373186,
      'Amazon to Apple': 0.352196405,
      'Amazon to Google': 0.57879282,
      'Apple to IBM': 0.274291102,
      'Google to IBM': 0.404049364,
      'Amazon to IBM': 0.293267182,
      'Alibaba group to Apple': 0.265261281,
      'Alibaba group to Google': 0.484715212,
      'Alibaba group to Amazon': 0.489600363,
      'Alibaba group to IBM': 0.296927759,
      'Apple to JPMorgan Chase & Co.': 0.223081253,
      'Google to JPMorgan Chase & Co.': 0.502319427,
      'Amazon to JPMorgan Chase & Co.': 0.223161337,
      'IBM to JPMorgan Chase & Co.': 0.609458275,
      'Alibaba group to JPMorgan Chase & Co.': 0.263935979
    }
}

const sharpeRatioMock = {
    Apple: -0.01677788742875957,
    Google: 0.3918344052565828,
    Amazon: 0.5882535062884182,
    IBM: -0.1304550726559575,
    'Alibaba group': 0.30004682245527253,
    'JPMorgan Chase & Co.': 0.18631715927443418
}

const debtEquityMock = {
    debtEquityPerStock: {
      AAPL: 3.957039440456695,
      GOOGL: 0.436192393414336,
      AMZN: 2.4387713588283155,
      IBM: 6.525015680030878,
      BABA: 0.5082281505442549,
      JPM: 11.121075767663967
    },
    averageDebtEquity: 4.164387131823074
}

/**
 * @swagger
 * /analytics/backtest:
 *  get:
 *   description: Backtests a real or a virtual portfolio for a given period of time
 *   summary: Backtests a real or a virtual portfolio for a given period of time
 *   produces:
 *      - application/json  
 *   tags:
 *    - analytics
 *   parameters:
 *      - in: body
 *        name: portfolioId
 *        required: true
 *        description: ID of portfolio
 *        type: number
 *        name: startDate
 *        required: true
 *        description: The starting date for the backtest
 *        type: string        
 *        name: endDate
 *        required: true
 *        description: The ending date for the backtest
 *        type: string         
 *   responses:
 *      '200':
 *          description: Success.
 */
router.get('/backtest', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request body

    // Fetch time series data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = backtestMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/diversification:
 *  get:
 *   description: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   summary: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/diversification/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = diversificationMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/dividends:
 *  get:
 *   description: Calculates the weighted average dividend and also returns the dividends per stock
 *   summary: Calculates the weighted average dividend and also returns the dividends per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/dividends/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = dividendsMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/peratios:
 *  get:
 *   description: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   summary: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/peratios/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = PERatiosMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/gainLoss:
 *  get:
 *   description: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   summary: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/gainLoss/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = gainLossMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/volatilityCorrelation:
 *  get:
 *   description: Calculates the volatility and correlation of stocks within a portfolio
 *   summary: Calculates the volatility and correlation of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/volatilityCorrelation/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = volatilityCorrelationMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/sharpeRatio:
 *  get:
 *   description: Calculates the sharpe ratio of stocks within a portfolio
 *   summary: Calculates the sharpe ratio of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/sharpeRatio/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = sharpeRatioMock;
    res.json(response)
})

/**
 * @swagger
 * /analytics/debtEquity:
 *  get:
 *   description: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   summary: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: id
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: number
 *   responses:
 *      '200':
 *          description: Success.
 */
 router.get('/debtEquity/:id', async (req, res) => {
    var response = {error: "", success: {}};
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

    response.success = debtEquityMock;
    res.json(response)
})



module.exports = router
