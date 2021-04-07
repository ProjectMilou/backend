'use strict';
const express = require('express');
const analytics = require('../data-analytics/analytics/analytics');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
// Require analytics, alphaVantageAPI, dbConnection and data filtering module.


const router = express.Router();

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
