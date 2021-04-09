const stats = require("stats-lite");
const calculateCorrelation = require("calculate-correlation");
const backtesting = require('../backtesting/backtesting.js');
//needs daily data
function standardDeviationAndCorrelation(portfolio, stocksData, namesToSymbols) {
    //may need to find starting date and combine all dates
    //need to use dailyinfo
    //either only use data available in all or use last updated value
    //only uses the start and enddate that is available in all stocks
    const usedDates = backtesting.getDaysAvailableInAll(portfolio, stocksData, namesToSymbols);
    const numDays = usedDates.length;
    let valuesOfStock = {};
    let correlations = {};

    //put allvalues for each stock in an array
    portfolio.securities.forEach((stock) => {
        let lastValue = 0;
        valuesOfStock[stock.name] = [];
        for (i = numDays - 2; i >= 0; i--) {
            if (
                usedDates[i] in stocksData[namesToSymbols[stock.name]] &&
                usedDates[i + 1] in stocksData[namesToSymbols[stock.name]]
            ) {
                //return in period
                const yesterday = Number(stocksData[namesToSymbols[stock.name]][usedDates[i + 1]]["4. close"])
                const today = Number(stocksData[namesToSymbols[stock.name]][usedDates[i]]["4. close"])
                lastValue = (today - yesterday) / yesterday;

            }
            valuesOfStock[stock.name].push(lastValue);
        }
    });
    //calculate correlation
    for (stock1 of portfolio.securities) {
        for (stock2 of portfolio.securities) {
            if (stock1 == stock2) {
                break;
            }
            const correlationKey = getCorrelationKey(stock1, stock2);
            if (correlationKey in correlations) {
                break;
            } else {
                correlations[correlationKey] = calculateCorrelation(
                    valuesOfStock[stock1.name],
                    valuesOfStock[stock2.name]
                );
            }
        }
    }

    let volatility = {};
    portfolio.securities.forEach((stock) => {
        volatility[stock.name] = stats.stdev(valuesOfStock[stock.name]) * Math.sqrt(252);
    });

    const standardDeviation = backtesting.standardDeviation(portfolio, stocksData, namesToSymbols);
    const portfolioVolatility = standardDeviation * Math.sqrt(252);
    return AnnualizedVolatilityAndCorrelation = {
        volatility,
        correlations,
        portfolioVolatility,
        standardDeviation
    }
}

//needs daily data
//weights the return by volatility and in comparison of the riskfreerate
function sharpeRatioStocks(portfolio, stocksData, namesToSymbols) {
    const usedDates = backtesting.getDaysAvailableInAll(portfolio, stocksData, namesToSymbols)
    const volatility = standardDeviationAndCorrelation(portfolio, stocksData, namesToSymbols).volatility;
    const riskFreeRate = backtesting.getRiskFreeRateOnDate(usedDates[usedDates.length - 1]) / 100;
    const returnOfStocks = returnAnnual(portfolio, stocksData, namesToSymbols);
    let sharpeRatio = {};
    portfolio.securities.forEach((stock) => {
        sharpeRatio[stock.name] = (returnOfStocks[stock.name] - riskFreeRate) / volatility[stock.name];

    });
    return { sharpeRatioPerSymbol: sharpeRatio, portfolioSharpeRatio: backtesting.sharpeRatio(portfolio, stocksData, namesToSymbols) };
}

function returnAnnual(portfolio, stocksData, namesToSymbols) {
    const usedDates = backtesting.getDaysAvailableInAll(portfolio, stocksData, namesToSymbols);
    const startDate = usedDates[usedDates.length - 1];
    const endDate = usedDates[0];
    const yearDif = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24 / 365;

    let returns = {};
    portfolio.securities.forEach((stock) => {
        const stockReturn =
            Number(stocksData[namesToSymbols[stock.name]][endDate]["4. close"])
            / Number(stocksData[namesToSymbols[stock.name]][startDate]["4. close"]);

        returns[stock.name] = stockReturn ** (1 / yearDif) - 1;
    });
    return returns;
}

function getCorrelationKey(stock1, stock2) {
    if (stock1.isin < stock2.isin) return stock1.isin + ";" + stock2.isin;
    else return stock2.isin + ";" + stock1.isin;
}

exports.standardDeviationAndCorrelation = standardDeviationAndCorrelation;
exports.sharpeRatioStocks = sharpeRatioStocks;