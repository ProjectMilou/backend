'use strict';
const express = require('express');
const analytics = require('../data-analytics/analytics/analytics');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
const companyOverviews = require('../data-analytics/dynamic_data/company-overviews');
const stockTimeSeries = require('../data-analytics/dynamic_data/stock-time-series');
const balanceSheets = require('../data-analytics/dynamic_data/balance-sheets');

const router = express.Router();

router.get('/backtest/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.json(response)
    }
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    if (!currStocksData) {
        response.error = "No data for all the stocks in the given portfolio."
        return res.json(response)
    }
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    if (!fromDate || !toDate) {
        response.error = "Please provide fromDate and toDate as query parameters"
        return res.json(response)
    }
    fromDate = new Date(fromDate)
    toDate = new Date(toDate)
    if(fromDate.toString() === 'Invalid Date' || toDate.toString() === 'Invalid Date') {
        response.error = "Dates are not in the correct format"
        return res.status(404).json(response)
    }
    const analyzedData = analytics.backtest(currPortfolio, currStocksData, fromDate, toDate)
    response.success = analyzedData;

    return res.json(response)
})

 router.get('/diversification/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
    if (!currCompanyOverviews) {
        response.error = "No company overview data for all the stocks in the given portfolio."
        return res.status(404).json(response)
    }
    
    const analyzedData = analytics.calculateDiversification(currPortfolio, currCompanyOverviews);
    response.success = analyzedData;

    return res.json(response)
})

 router.get('/dividends/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
    if (!currCompanyOverviews) {
        response.error = "No company overview data for all the stocks in the given portfolio."
        return res.status(404).json(response)
    }

    const analyzedData = analytics.calculateDividendYields(currPortfolio, currCompanyOverviews)
    response.success = analyzedData;

    return res.json(response)

})

 router.get('/peratios/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
    if (!currCompanyOverviews) {
        response.error = "No company overview data for all the stocks in the given portfolio."
        return res.status(404).json(response)
    }

    const analyzedData = analytics.calculatePERatios(currPortfolio, currCompanyOverviews)
    response.success = analyzedData;

    return res.json(response)
})

 router.get('/gainLoss/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    if(!currStocksData) {
        response.error = "No stock time series data for some of the stocks"
        return res.status(404).json(response)
    }
    const analyzedData = analytics.calculateGainAndLoss(currPortfolio, currStocksData);
    response.success= analyzedData;
    return res.json(response)

})

 router.get('/volatilityCorrelation/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    if(!currStocksData) {
        response.error = "No stock time series data for some of the stocks"
        return res.status(404).json(response)
    }
    const analyzedData = analytics.calculateSDAndCorrelationAndVolatility(currPortfolio, currStocksData);
    response.success= analyzedData;
    return res.json(response)

})

 router.get('/sharpeRatio/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }
    
    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    if(!currStocksData) {
        response.error = "No stock time series data for some of the stocks"
        return res.status(404).json(response)
    }
    const analyzedData = analytics.calculateSharpeRatio(currPortfolio, currStocksData);
    response.success= analyzedData;
    return res.json(response)
})

 router.get('/debtEquity/:id', async (req, res) => {
    let response = {error: "", success: {}};
    const id = req.params.id;
    const currPortfolio = await portfolioFetcher.findPortfolioByID(id)
    if (!currPortfolio) {
        response.error="Portfolio with ID: " + id + " was not found!"
        return res.status(404).json(response)
    }

    const currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    const currBalanceSheetPerSymbol = await balanceSheets.getBalanceSheetForSymbols(currSymbols);
    if(!currBalanceSheetPerSymbol) {
        response.error = "No balance sheet data for some of the stocks"
        return res.status(404).json(response)
    }
    const analyzedData = analytics.calculateDebtEquity(currPortfolio, currBalanceSheetPerSymbol);
    response.success= analyzedData;
    return res.json(response)
})


module.exports = router