//analytics
const diversification = require('../data-analytics/analytics/analytics');
const companyOverviews = require('../data-analytics/dynamic_data/company-overviews');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
const analytics = require('../data-analytics/analytics/analytics');
const stockTimeSeries = require('../data-analytics/dynamic_data/stock-time-series');
const stockModel = require("../models/stock");
const stockDetailedAnalysisModel = require('../models/stockDetailedAnalysis');
const balanceSheets = require('../data-analytics/dynamic_data/balance-sheets');


const fetch = require('node-fetch');
const { variance } = require('stats-lite');


const getExchangeRate = async(from_currency, to_currency) => {
    let rate = 1;
    if (from_currency != to_currency && from_currency !== undefined) {
        var params = new URLSearchParams({
            "base": from_currency,
            "symbols": to_currency
        });

        const api_url = `https://api.ratesapi.io/api/latest?${params}`;

        try {
            const api_response = await fetch(api_url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json_response = await api_response.json();
            if (json_response.rates)
                rate = json_response.rates[to_currency];
            else
                rate = 1
        } catch (err) {
            console.log(err.message);
        }
    }
    return rate;
}

const toEur = async(money, currency) => {
    if (money) {
        var exchangeRate = await getExchangeRate(currency, "EUR")
        return money * exchangeRate
    } else {
        return 0
    }
}

const percent = (nr1, nr2) => {
    if (nr1 && nr2 && !isNaN(nr1) && !isNaN(nr2))
        return nr1 / (nr2) * 100
    else
        return 0
}

const searchStock = async(searchString) => {
    let query = {};
    query["$or"] = [
        { "isin": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "wkn": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "name": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
        { "symbol": { $regex: ".*" + searchString + ".*", '$options': 'i' } },
    ]
    var stocks = await stockModel.find(query);
    return stocks
}

const returnValueIfDefined = (value) => {
    if (isFinite(value) && value) {
        return value
    } else {
        return 0
    }
}

function tofinAPIPortfolio(returnedPortfolio) {
    const reformattedPortfolio = {
        securities: []
    }
    returnedPortfolio.portfolio.positions.forEach(position => {
        const currSecurity = {};
        currSecurity["name"] = position.stock.name;
        currSecurity["symbol"] = position.stock.symbol;
        currSecurity["entryQuote"] = position.stock.entryQuote;
        currSecurity["quoteDate"] = position.stock.quoteDate;
        currSecurity["quantityNominal"] = position.qty;
        currSecurity["isin"] = position.stock.isin;
        reformattedPortfolio.securities.push(currSecurity)
    });
    return reformattedPortfolio;
}

// updates price, performance etc. of stock and converts all currencies to Euro
// the fields "marketValueCurrency" and "quoteCurrency" still refer to the original currency, because otherwise the analysis of how many different currencies are in the portfolio would be wrong
async function updateStock(position) {
    //search updated stock data in database
    var stockArray = await searchStock(position.stock.symbol);
    var stock = stockArray[0]
    if (stock) {
        position.stock.price = await toEur(stock.price, stock.currency)
            //position.stock.marketValueCurrency = "EUR"
        position.stock.quote = await toEur(stock.price, stock.currency)
            //position.stock.quoteCurrency = "EUR"
        position.stock.quoteDate = stock.date
        position.stock.perf7d = await toEur(stock.per7d, stock.currency)
        position.stock.perf1y = await toEur(stock.per365d, stock.currency)
        position.stock.perf7dPercent = percent(position.stock.perf7d, (position.stock.price * position.qty))
        position.stock.perf1yPercent = percent(position.stock.perf1y, (position.stock.price * position.qty))
            //volatility and debt equity is done in updatePortfolio()
        var detailedAnalysis = await stockDetailedAnalysisModel.findOne({ "symbol": stock.symbol })
        if (detailedAnalysis) {
            var score = 50
            score += ((detailedAnalysis.averageGoal - position.stock.price) / position.stock.price) * 200
            if (score > 100)
                score = 100
            if (score < 0)
                score = 0
            position.stock.score = score
            console.log("score: " + position.stock.score)
        } else {
            position.stock.score = 0
        }
        position.totalReturn = returnValueIfDefined(position.stock.quote * position.qty - position.stock.entryQuote * position.qty)
        position.totalReturnPercent = percent(position.totalReturn, position.stock.quote * position.qty)
    } else {
        position.stock.price = 0
        position.stock.quote = 0
        position.stock.quoteDate = 0
        position.stock.perf7d = 0
        position.stock.perf1y = 0
        position.stock.perf7dPercent = 0
        position.stock.perf1yPercent = 0
        position.stock.score = 0
        position.totalReturn = 0
        position.totalReturnPercent = 0
    }
}

async function updateStockWhenModifed(position) {
    await updateStock(position);
}

async function updateStockCronjob(position) {
    await updateStock(position)
}

// parameter: portfolio
// returns: array of stocks contained in the portfolio with their price converted to Eur
// it's useless now that all the values of the stocks are already calculated in EUR
async function calculateStockPricesInEur(portfolio) {
    var result = []
    var positions = portfolio.portfolio.positions
    for (var i = 0; i < positions.length; i++) {
        var newStock = { "stock": {} }
        newStock.stock.price = await toEur(positions[i].stock.price, positions[i].stock.marketValueCurrency)
        newStock.qty = positions[i].qty
        newStock.stock.score = positions[i].stock.score
        newStock.stock.perf7d = positions[i].stock.perf7d
        newStock.stock.perf1y = positions[i].stock.perf1y
        newStock.totalReturn = positions[i].totalReturn
        result.push(newStock)
    }
    return result
}

async function updatePortfolio(portfolio) {
    //overview
    var overview = portfolio.portfolio.overview
    overview.modified = Date.now() // current timestamp
    overview.positionCount = portfolio.portfolio.positions.length;
    if (overview.positionCount == 0) {
        //empty portfolio
        overview.value = 0;
        overview.score = 0
        overview.perf7d = 0
        overview.perf1y = 0
        overview.perf7dPercent = 0
        overview.perf1yPercent = 0
        portfolio.portfolio.risk = {
            "countries": {},
            "segments": {},
            "currency": {}
        }
        portfolio.portfolio.analytics = {
            "volatility": 0,
            "standardDeviation": 0,
            "sharpeRatio": 0,
            "treynorRatio": 0,
            "debtEquity": 0,
            "correlations": {}
        }
    } else {
        var stockArrayWithPriceInEur = portfolio.portfolio.positions
            //var stockArrayWithPriceInEur = await calculateStockPricesInEur(portfolio)
        overview.value = stockArrayWithPriceInEur.map(({ stock: { price: price }, qty: qty }) => returnValueIfDefined(price * qty)).reduce((a, b) => a + b, 0)

        if (overview.value) {
            overview.score = stockArrayWithPriceInEur.map(({ stock: { price: price, score: score }, qty: qty }) => returnValueIfDefined(price * qty * score)).reduce((a, b) => a + b, 0) / (overview.value)
        } else {
            overview.score = 0
        }
        overview.perf7d = stockArrayWithPriceInEur.map(({ stock: { perf7d: performance } }) => returnValueIfDefined(performance)).reduce((a, b) => a + b, 0)
        overview.perf1y = stockArrayWithPriceInEur.map(({ stock: { perf1y: performance } }) => returnValueIfDefined(performance)).reduce((a, b) => a + b, 0)
        overview.perf7dPercent = percent(overview.perf7d, overview.value)
        overview.perf1yPercent = percent(overview.perf1y, overview.value)
            //risk
        var currPortfolio = tofinAPIPortfolio(portfolio)
        var currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
        var currCompanyOverviews
        if (currSymbols)
            currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
        if (currCompanyOverviews) {
            var portfDiversification = diversification.calculateDiversification(currPortfolio, currCompanyOverviews)

            portfolio.portfolio.risk.countries = portfDiversification.countries
            portfolio.portfolio.risk.currency = portfDiversification.currencies
            portfolio.portfolio.risk.segments = portfDiversification.industries
        }

        //TODO keyfigures

        //analytics
        var currStocksData
        if (currSymbols)
            currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
        //SD and correlation and volatility
        var SDandCorr;
        if (currStocksData) {
            SDandCorr = analytics.calculateSDAndCorrelationAndVolatility(currPortfolio, currStocksData);
        } else {
            SDandCorr = {
                volatility: {},
                correlations: {},
                portfolioVolatility: 0,
                standardDeviation: 0
            }
        }
        var pAnalytics = portfolio.portfolio.analytics
        if (!pAnalytics)
            pAnalytics = {}
        pAnalytics.volatility = SDandCorr.portfolioVolatility
        pAnalytics.correlations = SDandCorr.correlations
            //volatility of positions
        portfolio.portfolio.positions.forEach(position => {
            position.stock.volatility = returnValueIfDefined(SDandCorr.volatility[position.stock.symbol])
        });
        pAnalytics.standardDeviation = SDandCorr.standardDeviation

        //sharpeRatio
        var analyzedData
        if (currStocksData) {
            try {
                analyzedData = analytics.calculateSharpeRatio(currPortfolio, currStocksData);
                pAnalytics.sharpeRatio = analyzedData.portfolioSharpeRatio
            } catch (err) {
                pAnalytics.sharpeRatio = 0
            }
        } else {
            pAnalytics.sharpeRatio = 0
        }

        // debtEquity
        var currBalanceSheetPerSymbol
        if (currSymbols) {
            currBalanceSheetPerSymbol = await balanceSheets.getBalanceSheetForSymbols(currSymbols);
        }
        if (currBalanceSheetPerSymbol) {
            const analyzedData = analytics.calculateDebtEquity(currPortfolio, currBalanceSheetPerSymbol);
            portfolio.portfolio.positions.forEach(position => {
                position.stock.debtEquity = returnValueIfDefined(analyzedData.debtEquityPerStock[position.stock.symbol])
            });
            pAnalytics.debtEquity = analyzedData.averageDebtEquity
        } else {
            pAnalytics.debtEquity = 0
            portfolio.portfolio.positions.forEach(position => {
                position.stock.debtEquity = 0
            });
        }


        // treynorRatio	
        var currCompanyOverviews2
        if (currSymbols)
            currCompanyOverviews2 = await companyOverviews.getCompanyOverviewsBySymbolsWithoutReformatting(currSymbols)
        if (currStocksData && currCompanyOverviews2) {
            try {
                const analyzedData = analytics.calculateTreynorRatio(currPortfolio, currStocksData, currCompanyOverviews2)
                pAnalytics.treynorRatio = analyzedData.treynorRatio
            } catch (err) {
                pAnalytics.treynorRatio = 0
            }
        } else {
            pAnalytics.treynorRatio = 0
        }

        //others
        portfolio.portfolio.totalReturn = stockArrayWithPriceInEur.map(({ totalReturn: performance }) => returnValueIfDefined(performance)).reduce((a, b) => a + b, 0)
        portfolio.portfolio.totalReturnPercent = percent(portfolio.portfolio.totalReturn, overview.value)
            //TODO nextDividend: Number,//no data, maybe Alpha Vantage
    }
}

async function updatePortfolioWhenModified(portfolio) {
    // update all stocks
    var positions = portfolio.portfolio.positions;
    for (var i = 0; i < positions.length; i++) {
        await updateStockWhenModifed(positions[i])
    }
    // update other values of portfolio
    await updatePortfolio(portfolio)
}

async function updatePortfolioCronjob(portfolio) {
    // update all stocks
    var positions = portfolio.portfolio.positions
    for (var i = 0; i < positions.length; i++) {
        await updateStockCronjob(positions[i])
    }

    // update other values of portfolio
    await updatePortfolio(portfolio)
        //performance
    var newDataPoint = [Date.now(), portfolio.portfolio.overview.value]
    portfolio.portfolio.performance.push(newDataPoint)

}


module.exports.updatePortfolioWhenModified = updatePortfolioWhenModified
module.exports.updatePortfolioCronjob = updatePortfolioCronjob
module.exports.searchStock = searchStock
module.exports.toEur = toEur