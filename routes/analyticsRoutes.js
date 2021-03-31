'use strict';
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /analytics/backtest:
 *  post:
 *   description:
 *   tags:
 *    - user
 *   responses:
 */

router.get('/backtest', async (req, res) => {

    // params: portfolioID, startdate, enddate

    /*
    procedure:





     */


    // res = analyticsdata

    //
    /*
    {
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
    }
     */
})



module.exports = router
