//analytics
const diversification = require('../data-analytics/analytics/analytics');
const companyOverviews = require('../data-analytics/dynamic_data/company-overviews');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
const analytics = require('../data-analytics/analytics/analytics');
const stockTimeSeries = require('../data-analytics/dynamic_data/stock-time-series');
const stockModel = require("../models/stock");

const percent = (nr1, nr2) => {
    if (nr1 && nr2 && !isNaN(nr1) && !isNaN(nr2))
        return nr1 / (nr2) * 100
    else
        return 0
}

const searchStock = async (searchString) => {
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



async function updateStock(position) {
    //search updated stock data in database
    var stockArray = await searchStock(position.stock.symbol);
    var stock = stockArray[0]
    position.stock.price = stock.price
    position.stock.quote = stock.price
    position.stock.quoteDate = stock.date
    position.stock.perf7d = stock.per7d
    position.stock.perf1y = stock.per365d
    position.stock.perf7dPercent = percent(stock.per7d, (stock.price * position.qty))
    position.stock.perf1yPercent = percent(stock.per365d, (stock.price * position.qty))
    //volatility and debt equity is done in updatePortfolio()
    //TODO score
}

async function updateStockWhenModifed(position) {
    await updateStock(position)
    //entryQuote is the price of the Stock at buy time, therefore it should only be changed when we modify it, not when the cronjob happens
    position.stock.entryQuote = position.stock.quote
}

async function updateStockCronjob(position) {
    var oldPerf7d = position.stock.perf7d
    await updateStock(position)
    // TODO check if this makes sense
    position.totalReturn += (position.stock.perf7d - oldPerf7d) * position.qty
    position.totalReturnPercent = percent(position.totalReturn, position.stock.price * position.qty)
}


async function updatePortfolio(portfolio) {
    //overview
    portfolio.portfolio.overview.modified = Date.now() // current timestamp
    var overview = portfolio.portfolio.overview
    overview.positionCount = portfolio.portfolio.positions.length;
    if (overview.positionCount == 0) {
        overview.value = 0;
    }
    overview.perf7d = portfolio.portfolio.positions.map(({ stock: { perf7d: performance } }) => performance).reduce((a, b) => a + b, 0)
    overview.perf1y = portfolio.portfolio.positions.map(({ stock: { perf1y: performance } }) => performance).reduce((a, b) => a + b, 0)
    overview.perf7dPercent = percent(overview.perf7d, overview.value)
    overview.perf1yPercent = percent(overview.perf1y, overview.value)
    //TODO score

    //risk
    var currPortfolio = tofinAPIPortfolio(portfolio)
    var currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    var currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
    var portfDiversification = diversification.calculateDiversification(currPortfolio, currCompanyOverviews)//TODO
    portfolio.portfolio.risk.countries = portfDiversification.countries
    portfolio.portfolio.risk.currency = portfDiversification.currencies
    portfolio.portfolio.risk.segments = portfDiversification.industries

    //TODO keyfigures

    //analytics
    var currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    var SDandCorr;
    if (portfolio.portfolio.positions.length > 0) {
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
    //volatility of positions
    if (portfolio.portfolio.positions.length > 0)
        portfolio.portfolio.positions.forEach(position => {
            position.stock.volatility = SDandCorr.volatility[position.stock.name]
        });
    pAnalytics.standardDeviation = SDandCorr.standardDeviation
    pAnalytics.sharpeRatio//TODO
    //TODO var debtEquity = analytics.calculateDebtEquity(currPortfolio)
    pAnalytics.debtEquity
    //TODO treynorRatio	
    pAnalytics.correlations = SDandCorr.correlations

    //others
    portfolio.portfolio.totalReturn = portfolio.portfolio.positions.map(({ totalReturn: performance }) => performance).reduce((a, b) => a + b, 0)
    portfolio.portfolio.totalReturnPercent = percent(portfolio.portfolio.totalReturn, overview.value)
    //TODO nextDividend: Number,//no data, maybe Alpha Vantage
}

async function updatePortfolioWhenModified(portfolio) {
    if (portfolio.portfolio.positions.length > 0)
        // update all stocks
        await portfolio.portfolio.positions.forEach(async (position) => {
            await updateStockWhenModifed(position)
        });

    // update other values of portfolio
    await updatePortfolio(portfolio)
}

async function updatePortfolioCronjob(portfolio) {

    if (portfolio.portfolio.overview.virtual) {
        //TODO import from finAPI, if real
    }

    if (portfolio.portfolio.positions.length > 0)
        // update all stocks
        await portfolio.portfolio.positions.forEach(async (position) => {
            await updateStockCronjob(position)
        });
    //TODO performance

    // update other values of portfolio
    await updatePortfolio(portfolio)

}


module.exports.updatePortfolioWhenModified = updatePortfolioWhenModified
module.exports.updatePortfolioCronjob = updatePortfolioCronjob
module.exports.searchStock = searchStock
