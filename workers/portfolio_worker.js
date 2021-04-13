//analytics
const diversification = require('../data-analytics/analytics/analytics');
const companyOverviews = require('../data-analytics/dynamic_data/company-overviews');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
const analytics = require('../data-analytics/analytics/analytics');
const stockTimeSeries = require('../data-analytics/dynamic_data/stock-time-series');

const percent = (nr1, nr2) => {
    if (nr1 && nr2 && !isNaN(nr1) && !isNaN(nr2))
        return nr1 / (nr2) * 100
    else
        return 0
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


async function updatePortfolio(portfolio) {

    if (portfolio.portfolio.overview.virtual) {
        //TODO import from finAPI, if real
    }
    portfolio.portfolio.overview.modified = Date.now() // current timestamp
    var overview = portfolio.portfolio.overview
    overview.positionCount = portfolio.portfolio.positions.length;
    overview.perf7d = portfolio.portfolio.positions.map(({ stock: { perf7d: performance } }) => performance).reduce((a, b) => a + b)
    overview.perf1y = portfolio.portfolio.positions.map(({ stock: { perf1y: performance } }) => performance).reduce((a, b) => a + b)
    overview.perf7dPercent = percent(overview.perf7d, overview.value)
    overview.perf1yPercent = percent(overview.perf1y, overview.value)
    //DONE risk
    var currPortfolio = tofinAPIPortfolio(portfolio)
    var currSymbols = portfolioFetcher.extractSymbolsFromPortfolio(currPortfolio);
    var currCompanyOverviews = await companyOverviews.getCompanyOverviewForSymbols(currSymbols);
    var portfDiversification = diversification.calculateDiversification(currPortfolio, currCompanyOverviews)//TODO
    //console.log(portfDiversification)
    portfolio.portfolio.risk.countries = portfDiversification.countries
    portfolio.portfolio.risk.currency = portfDiversification.currencies
    portfolio.portfolio.risk.segments = portfDiversification.industries
    //TODO keyfigures
    portfolio.portfolio.totalReturn = portfolio.portfolio.positions.map(({ totalReturn: performance }) => performance).reduce((a, b) => a + b)
    portfolio.portfolio.totalReturnPercent = percent(portfolio.portfolio.totalReturn, overview.value)
    //TODO nextDividend: Number,//no data, maybe Alpha Vantage
    //dividendPayoutRatio: Number,//?
    //TODO score
    //TODO analytics
    var currStocksData = await stockTimeSeries.getStocksDataForSymbols(currSymbols);
    var SDandCorr = analytics.calculateSDAndCorrelationAndVolatility(currPortfolio, currStocksData);

    var pAnalytics = portfolio.portfolio.analytics
    if (!pAnalytics)
        pAnalytics = {}
    pAnalytics.volatility = SDandCorr.portfolioVolatility
    portfolio.portfolio.positions.forEach(position => {
        position.stock.volatility = SDandCorr.volatility[position.stock.name]
    });
    pAnalytics.standardDeviation = SDandCorr.standardDeviation
    pAnalytics.sharpeRatio
    pAnalytics.debtEquity
    pAnalytics.correlations = SDandCorr.correlations
    //TODOvar debtEquity = analytics.calculateDebtEquity(currPortfolio)
    //TODO treynorRatio	
    //TODO performance

}


async function updateStock(position) {
    var stockArray = await searchStock(position.stock.symbol);//?
    var stock = stockArray[0]
    position.stock.price = stock.price
    // TODO check if this makes sense
    position.totalReturn += (stock.per7d - position.stock.perf7d) * position.qty
    position.totalReturnPercent = percent(position.totalReturn, position.stock.price * position.qty)
    //TODO quote etc
    position.stock.perf7d = stock.per7d
    position.stock.perf1y = stock.per365d
    position.stock.perf7dPercent = percent(stock.per7d, (stock.price * qty))
    position.stock.perf1yPercent = percent(stock.per365d, (stock.price * qty))
    //TODO score


    return result;
}

module.exports = updatePortfolio