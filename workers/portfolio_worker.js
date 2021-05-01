//analytics
const diversification = require('../data-analytics/analytics/analytics');
const companyOverviews = require('../data-analytics/dynamic_data/company-overviews');
const portfolioFetcher = require('../data-analytics/dynamic_data/portfolio-fetcher');
const analytics = require('../data-analytics/analytics/analytics');
const stockTimeSeries = require('../data-analytics/dynamic_data/stock-time-series');
const stockModel = require("../models/stock");
const stockDetailedAnalysisModel = require('../models/stockDetailedAnalysis');
const balanceSheets = require('../data-analytics/dynamic_data/balance-sheets');
const KeyFigure = require('../models/keyFigure');
const dividendModel = require("../models/dividend");


const fetch = require('node-fetch');
const { variance } = require('stats-lite');


const getExchangeRate = async (from_currency, to_currency) => {
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

const toEur = async (money, currency) => {
    if (currency == "EUR")
        return money;
    if (money) {
        var exchangeRate = await getExchangeRate(currency, "EUR")
        return money / exchangeRate
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

const searchStock = async (searchString) => {
    let query = {};
    query["$or"] = [
        { "isin": searchString },
        { "wkn": searchString },
        { "name": searchString },
        { "symbol": searchString },
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
async function updateStock(position, virtual) {
    //search updated stock data in database
    var stockArray = await searchStock(position.stock.symbol);
    var stock = stockArray[0]
    if (stock) {
        position.stock.missingData = false;
        if (virtual) {
            position.stock.displayedCurrency = stock.displayedCurrency
            position.stock.price = stock.price
            position.stock.quote = stock.price
            position.stock.quoteDate = stock.date
        } else {
            //convert to EUR
            position.stock.price = await toEur(position.stock.price, position.stock.marketValueCurrency)
            position.stock.displayedCurrency = "EUR"
        }

        position.stock.perf7d = stock.per7d, stock.displayedCurrency
        position.stock.perf1y = stock.per365d, stock.displayedCurrency
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
        } else {
            position.stock.score = 0
        }
        if (virtual) {
            position.totalReturn = returnValueIfDefined(position.stock.quote * position.qty - position.stock.entryQuote * position.qty)
        }
    } else {
        position.stock.missingData = true;
        if (virtual) {
            position.stock.price = 0
            position.stock.quote = 0
            position.stock.quoteDate = 0
            position.totalReturn = 0
        }
    }
    position.totalReturnPercent = percent(position.totalReturn, position.stock.quote * position.qty)
}

async function updateStockWhenModifed(position, virtual) {
    await updateStock(position, virtual);
}

async function updateStockCronjob(position, virtual) {
    await updateStock(position, virtual)
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
        //var stockArrayWithPriceInEur = await calculateStockPricesInEur(portfolio) //this is useless now that the prices in the database of the stocks are also in euro
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


        // keyfigures
        if (currStocksData && currBalanceSheetPerSymbol && portfolio.portfolio.positions) {
            var keyFigures = []
            //find values
            for (var i = 0; i < portfolio.portfolio.positions.length; i++) {
                var position = portfolio.portfolio.positions[i]
                if (!position.stock.missingData) {
                    //keyFigures
                    let keyFigureData = await KeyFigure.findOne({ 'symbol': position.stock.symbol });

                    const today = new Date()
                    const toDate = new Date().setFullYear(today.getFullYear() - 1)
                    const fiveYearsAgo = new Date().setFullYear(today.getFullYear() - 5)
                    const result = analytics.calculateKeyFigures(currStocksData, keyFigureData,
                        currBalanceSheetPerSymbol[position.stock.symbol], fiveYearsAgo, toDate)
                    //weigh the result
                    var weight = position.stock.price * position.stock.qty / portfolio.portfolio.overview.value
                    if (result.length > 0) {
                        result.map(({
                            "date": date,
                            "PERatio": PERatio,
                            "EPS": EPS,
                            "PEGrowthRatio": PEGrowthRatio,
                            "PBRatio": PBRatio
                        }) => {
                            return {
                                "date": date,
                                "PERatio": parseFloat(PERatio) * weight,
                                "EPS": EPS * weight,
                                "PEGrowthRatio": PEGrowthRatio * weight,
                                "PBRatio": PBRatio * weight
                            }
                        }
                        );
                    }
                    result.symbol = position.stock.symbol
                    keyFigures.push(result)
                }
            }

            var nextDividend
            // weighted average of keyfigures for stock
            var keyFiguresMappedToDate = {}
            var dates = []
            for (var i = 0; i < keyFigures.length; i++) {
                //dividends
                const dataPointDividend = await dividendModel.findOne({ "symbol": keyFigures[i].symbol }, {
                    symbol: false,
                    _id: false
                });
                // get the earliest dividend payout date
                var nextDividendOfThisStock = new Date(dataPointDividend.date)
                if ((!nextDividend || nextDividendOfThisStock < nextDividend) && dataPointDividend && !isNaN(nextDividendOfThisStock)) {
                    nextDividend = nextDividendOfThisStock
                }
                for (var j = 0; j < keyFigures[i].length; j++) {
                    if (keyFiguresMappedToDate[keyFigures[i][j].date]) {
                        var keyFigure = keyFiguresMappedToDate[keyFigures[i][j].date]
                        keyFigure.pte += keyFigures[i][j].PERatio
                        keyFigure.ptb += keyFigures[i][j].PBRatio
                        keyFigure.ptg += keyFigures[i][j].PEGrowthRatio
                        keyFigure.eps += parseFloat(keyFigures[i][j].EPS)
                        if (dataPointDividend) {
                            var dataPointOfThisYear = dataPointDividend.dataPoints.find((dataPoint) => {
                                return dataPoint.date.slice(0, 4) == keyFigures[i][j].date.slice(0, 4)
                            });
                            if (dataPointOfThisYear) {
                                if (dataPointOfThisYear.div && !isNaN(dataPointOfThisYear.div)) {
                                    keyFigure.div = returnValueIfDefined(keyFigure.div) + parseFloat(dataPointOfThisYear.div)
                                    keyFigure.countHowManyValidDivs++
                                }
                                if (dataPointDividend.quota) {
                                    keyFigure.dividendPayoutRatio = returnValueIfDefined(keyFigure.dividendPayoutRatio) + parseFloat(returnValueIfDefined(dataPointDividend.quota))
                                    keyFigure.countHowManyValidDPR++
                                }
                            }
                        }
                    } else {
                        var keyFigure = { "year": keyFigures[i][j].date.slice(0, 4) }
                        keyFiguresMappedToDate[keyFigures[i][j].date] = keyFigure
                        keyFigure.pte = keyFigures[i][j].PERatio
                        keyFigure.ptb = keyFigures[i][j].PBRatio
                        keyFigure.ptg = keyFigures[i][j].PEGrowthRatio
                        keyFigure.eps = parseFloat(keyFigures[i][j].EPS)
                        keyFigure.countHowManyValidDivs = 0
                        keyFigure.countHowManyValidDPR = 0
                        //dividends
                        if (dataPointDividend) {
                            var dataPointOfThisYear = dataPointDividend.dataPoints.find((dataPoint) => {
                                return dataPoint.date.slice(0, 4) == keyFigures[i][j].date.slice(0, 4)
                            });
                            if (dataPointOfThisYear) {
                                if (dataPointOfThisYear.div && !isNaN(dataPointOfThisYear.div)) {
                                    keyFigure.div = parseFloat(dataPointOfThisYear.div)
                                    keyFigure.countHowManyValidDivs++
                                }
                                if (dataPointDividend.quota) {
                                    keyFigure.dividendPayoutRatio = parseFloat(returnValueIfDefined(dataPointDividend.quota))
                                    keyFigure.countHowManyValidDPR++
                                }
                            }
                        }
                        dates.push(keyFigures[i][j].date)
                    }
                }

            }

            keyFiguresNotMappedToDate = []
            //change it to the right format
            for (var i = 0; i < dates.length; i++) {
                const keyFigure = keyFiguresMappedToDate[dates[i]]
                //average
                if (keyFigure.countHowManyValidDivs && keyFigure.div) {
                    keyFigure.div /= keyFigure.countHowManyValidDivs;
                } else {
                    keyFigure.div = 0;
                }
                if (keyFigure.countHowManyValidDPR && keyFigure.dividendPayoutRatio) {
                    keyFigure.dividendPayoutRatio /= keyFigure.countHowManyValidDPR
                } else {

                    keyFigure.dividendPayoutRatio = 0
                }
                delete keyFigure.countHowManyValidDivs
                delete keyFigure.countHowManyValidDPR
                keyFiguresNotMappedToDate.push(keyFigure)
            }
            portfolio.portfolio.keyFigures = keyFiguresNotMappedToDate
            if (!isNaN(nextDividendOfThisStock)) {
                portfolio.portfolio.nextDividend = nextDividend;
            } else {
                portfolio.portfolio.nextDividend = 0;
            }
            //console.log(portfolio.portfolio.keyFigures)
        } else {
            //console.log(portfolio.id)
        }



    }
}

async function updatePortfolioWhenModified(portfolio) {
    // update all stocks
    var positions = portfolio.portfolio.positions;
    for (var i = 0; i < positions.length; i++) {
        await updateStockWhenModifed(positions[i], portfolio.portfolio.overview.virtual)
    }
    // update other values of portfolio
    await updatePortfolio(portfolio)
}

async function updatePortfolioCronjob(portfolio) {
    // update all stocks
    var positions = portfolio.portfolio.positions
    for (var i = 0; i < positions.length; i++) {
        await updateStockCronjob(positions[i], portfolio.portfolio.overview.virtual)
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