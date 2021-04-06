'use strict';
const express = require('express');
const analytics = require('../data-analytics/analytics/analytics');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
// Require analytics, alphaVantageAPI, dbConnection and data filtering module.


const router = express.Router();

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
router.get('/backtest/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request body

    // Fetch time series data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results
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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results
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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results
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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results

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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results
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
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    response.success = currPortfolio;
    

    return res.json(response)
    // Extract parameters from request path

    // Fetch company overviews data from DB, if data does not exist there or it's not enough
    // => Fetch from AlphaVantage

    // Call data filtering

    // Analyse

    // If no errors return results
})



module.exports = router
