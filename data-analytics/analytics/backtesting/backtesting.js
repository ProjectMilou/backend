// Just an example of how this file could look like

const fs = require("fs");
const stats = require("stats-lite");


const datesInterest = fs.readFileSync("./data-analytics/static/Rates.json");
const rates = JSON.parse(datesInterest);
/**
 *It should return the finalPortfolioBalance for a given timespan
 *Core idea: of all symbols of the two given years
 *and adds the difference between end and start portfolio value of each stock
 *
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol: {date: {"1. open": "20.6350", "2. high": "71.7300", "3. low": "70.5200","4. close": "71.4900", "5. volume": "114923"}}}} stocksData Stocks data according to symbols
 * @returns {{totalBalance:number}}depending whaether the final sum is negative or positive returns sum or 0
 */
function finalPortfolioBalance(portfolio, stocksData, namesToSymbols) {
    const [symbolToQuantity, symbols] = getSymbolsAndMappingToQuantity(
        portfolio, namesToSymbols
    );

    let years = getStocksDateAccordingToYears(stocksData);
    let startYear = Object.keys(years)[0];
    let endYear = Object.keys(years)[Object.keys(years).length - 1];
    let totalBalance = 0;
    let totalStartYear = 0;
    let totalEndYear = 0;
    symbols.forEach((symbol) => {
        //I assume the length of dates in the symbols is equal for both startYear and endYear
        let dateForStartSymbol =
            years[startYear][symbol][years[startYear][symbol].length - 1];
        let dateForEndSymbol = years[endYear][symbol][0];
        totalStartYear +=
            stocksData[symbol][dateForStartSymbol]["4. close"] *
            symbolToQuantity[symbol];
        totalEndYear +=
            stocksData[symbol][dateForEndSymbol]["4. close"] *
            symbolToQuantity[symbol];
    });
    totalBalance = totalEndYear - totalStartYear;
    if (totalBalance < 0) {
        return { finalPortfolioBalance: 0 };
    }
    return {
        // used to be totalBalance :)
        finalPortfolioBalance: totalEndYear
    };
}

/**
 * Returns the maximum drawdown of a portfolio.
 * MDDMaxToMin = Minimimum Value - Maximum Value  / Maximum Value
 * MDDInitialToMin = Minimum Value - Initial Value / Initial Value
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol: {date: {"1. open": number, "2. high": number, "3. low": number,"4. close": number, "5. volume": number}}}} stocksData Stocks data according to symbols
 * @returns {{MDDMaxToMin: number,MDDInitialToMin: number, dateMax: string, dateMin: string, maxValue: number, minValue: number, initialValue: number}}
 * An object containing the MDD value, maximum and minimum value and the corresponding dates.
 */
function mdd(portfolio, stocksData, namesToSymbols) {
    const [symbolToQuantity, symbols] = getSymbolsAndMappingToQuantity(
        portfolio, namesToSymbols
    );
    let aggregatedMax = -9999999;
    let aggregatedMin = 9999999;
    let dateMax = "";
    let dateMin = "";
    let initialValue = 0;

    // All the dates of all symbols
    let aggregatedDates = [];
    symbols.forEach((symbol) => {
        Object.keys(stocksData[symbol])
            .reverse()
            .forEach((currDate) => {
                if (!aggregatedDates.includes(currDate)) {
                    aggregatedDates.push(currDate);
                }
            });
    });

    // Used for dealing with the different dates of different stocks
    // Saves the last observed price for a stock
    let lastPriceForSymbol = {};

    symbols.forEach((symbol) => {
        const datesForSymbol = Object.keys(stocksData[symbol]).reverse();

        // Important for first for each loop - if there is no previously observed price
        // of a given stock - code breaks :) If it doesn't break, then the portfolio value
        // will probably be the minimal observed value => false calculation.
        lastPriceForSymbol[symbol] =
            stocksData[symbol][datesForSymbol[0]]["4. close"];

        // Used for MDD calculation according to Julien's definition
        initialValue +=
            stocksData[symbol][datesForSymbol[0]]["4. close"] *
            symbolToQuantity[symbol];
    });

    let portfolioValues = []
    // Main logic
    for (const date of aggregatedDates) {
        let aggregatedSumOfAllStocks = 0;

        // For each of symbols calculate the amount of Stocks * price of stocks
        // Add the result to an aggregated sum of all stocks
        // Also ASSUMING that the value is given in EUR.
        symbols.forEach((symbol) => {
            if (date in stocksData[symbol]) {
                aggregatedSumOfAllStocks +=
                    stocksData[symbol][date]["4. close"] *
                    symbolToQuantity[symbol];
                lastPriceForSymbol[symbol] =
                    stocksData[symbol][date]["4. close"] *
                    symbolToQuantity[symbol];
            } else {
                aggregatedSumOfAllStocks += lastPriceForSymbol[symbol];
            }
        });
        portfolioValues.push([new Date(date).getTime(), aggregatedSumOfAllStocks])

        // Simply check if this is a maximum or a minimum value based on the results untill now
        if (aggregatedMax < aggregatedSumOfAllStocks) {
            aggregatedMax = aggregatedSumOfAllStocks;
            dateMax = date;
        }
        if (aggregatedMin > aggregatedSumOfAllStocks) {
            aggregatedMin = aggregatedSumOfAllStocks;
            dateMin = date;
        }
    }
    // According to the definition
    let MDDMaxToMin = ((aggregatedMin - aggregatedMax) / aggregatedMax)
    // According to Julien
    let MDDInitialToMin = (
        (aggregatedMin - initialValue) /
        initialValue
    )

    return {
        MDDMaxToMin,
        MDDInitialToMin,
        dateMax,
        dateMin,
        maxValue: aggregatedMax,
        minValue: aggregatedMin,
        initialValue: initialValue,
        portfolioValues
    };
}

/**
 * Returns the best and worst year performance of a portfolio.
 * Measurements: Change and growth rate
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol: {date: {"1. open": number, "2. high": number, "3. low": number,"4. close": number, "5. volume": number}}}} stocksData Stocks data according to symbols
 * @returns {{bestYear: {changeBest: number, yearBest: string, growthRateBest: number}, worstYear: {changeWorst: number, yearWorst: string, growthRateWorst: number}}}
 * An object containing data about the best and worst year
 */
function bestAndWorstYear(portfolio, stocksData, namesToSymbols) {
    const [symbolToQuantity, symbols] = getSymbolsAndMappingToQuantity(
        portfolio, namesToSymbols
    );

    let years = getStocksDateAccordingToYears(stocksData);

    let changeBest = -9999999999;
    let changeWorst = 9999999999;
    let yearBest = "";
    let yearWorst = "";
    let growthRateBest = 0;
    let growthRateWorst = 0;

    // For each years e.g 2015, 2016
    Object.keys(years).forEach((currYear) => {
        let startPortfolioValue = 0;
        let endPortfolioValue = 0;
        // For each symbol TSLA, ... in year 2015, 2016...
        Object.keys(years[currYear]).forEach((currSymbol) => {
            // Last date of the given year
            let endDateForSymbol = years[currYear][currSymbol][0];

            // First date of the given year
            let startDateForSymbol =
                years[currYear][currSymbol][
                years[currYear][currSymbol].length - 1
                ];

            // Summing up everything
            startPortfolioValue +=
                stocksData[currSymbol][startDateForSymbol]["4. close"] *
                symbolToQuantity[currSymbol];
            endPortfolioValue +=
                stocksData[currSymbol][endDateForSymbol]["4. close"] *
                symbolToQuantity[currSymbol];
        });
        // Calculate the change
        let currChange = endPortfolioValue - startPortfolioValue;
        // Calculate the growth rate
        let currGrowthRate =
            (endPortfolioValue - startPortfolioValue) / startPortfolioValue;
        // Simple checks
        if (currChange > changeBest) {
            changeBest = currChange.toFixed(4);
            growthRateBest = currGrowthRate.toFixed(4);
            yearBest = currYear;
        }
        if (currChange < changeWorst) {
            changeWorst = currChange.toFixed(4);
            growthRateWorst = currGrowthRate.toFixed(4);
            yearWorst = currYear;
        }
    });
    //changeBest = changeBest:changeBest
    return {
        bestYear: {
            changeBest,
            yearBest,
            growthRateBest
        },
        worstYear: {
            changeWorst,
            yearWorst,
            growthRateWorst
        }
    };
}
//standard deviation from average daily returns
//made for daily data
function standardDeviation(portfolio, stocksData, namesToSymbols) {
    const usedDates = Object.keys(
        stocksData[namesToSymbols[portfolio.securities[0].name]]
    );
    const numDays = usedDates.length;
    //return on each day
    let valueEachDay = [];
    let lastValues = {};

    portfolio.securities.forEach((stock) => {
        lastValues[stock.name] = 0;
    });

    //saves the sum on each day
    let sums = {};
    for (i = numDays - 1; i >= 0; i--) {
        let sum = 0;
        portfolio.securities.forEach((stock) => {
            if (usedDates[i] in stocksData[namesToSymbols[stock.name]]) {
                lastValues[stock.name] =
                    stocksData[namesToSymbols[stock.name]][usedDates[i]][
                    "4. close"
                    ] * stock.quantityNominal;
            }
            sum += lastValues[stock.name];
        });
        sums[i] = sum;
        if (i < numDays - 1) {
            valueEachDay.push((sum - sums[i + 1]) / sums[i + 1]);
        }
    }
    const standardDeviation = stats.stdev(valueEachDay) * Math.sqrt(252);

    return standardDeviation;
}
//need daily data
function sharpeRatio(portfolio, stocksData, namesToSymbols) {
    const usedDates = getDaysAvailableInAll(portfolio, stocksData, namesToSymbols);
    const startDate = usedDates[usedDates.length - 1];
    const endDate = usedDates[0];

    const returnRate = compoundAnnualGrowthRate(portfolio, stocksData, namesToSymbols);
    //saves riskfreeRate on Backtesting start
    const riskFreeRateStartDate = getRiskFreeRateOnDate(startDate) / 100;
    //calcs time period of Backtesting
    const volatility = standardDeviation(portfolio, stocksData, namesToSymbols) * Math.sqrt(252);

    return (returnRate - riskFreeRateStartDate) / volatility;
}
//growth per year
function compoundAnnualGrowthRate(portfolio, stocksData, namesToSymbols) {
    //checks if the date is available in all stocks
    const usedDates = getDaysAvailableInAll(portfolio, stocksData, namesToSymbols);
    const startDate = usedDates[usedDates.length - 1];
    const endDate = usedDates[0];
    let startValue = 0;
    let endValue = 0;

    portfolio.securities.forEach((stock) => {
        startValue +=
            stocksData[namesToSymbols[stock.name]][startDate]["4. close"] *
            stock.quantityNominal;
        endValue +=
            stocksData[namesToSymbols[stock.name]][endDate]["4. close"] *
            stock.quantityNominal;
    });

    const yearDif =
        (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24 / 365;
    return (CAGR = (endValue / startValue) ** (1 / yearDif) - 1);
}


//returns all dates available for every Stock
function getDaysAvailableInAll(portfolio, stocksData, namesToSymbols) {
    let usedDates = Object.keys(
        stocksData[namesToSymbols[portfolio.securities[0].name]]
    );
    usedDates.forEach((date) => {
        let dateInAll = true;
        portfolio.securities.forEach((stock) => {
            if (!(date in stocksData[namesToSymbols[stock.name]])) {
                dateInAll = false;
            }
        });
        if (!dateInAll) {
            const index = usedDates.indexOf(date);
            if (index > -1) {
                usedDates.splice(index, 1);
            }
        }
    });
    return usedDates;
}


//returns RiskFree Rate on the date if it is defined
function getRiskFreeRateOnDate(date) {
    const latestDefinedDate = latestDefinedDateForRiskFree();
    if (new Date(date) > new Date(latestDefinedDate)) {
        return rates[latestDefinedDate];
    } else return rates[date];
}

function latestDefinedDateForRiskFree() {
    const allDates = Object.keys(rates);
    let latestDate = "";
    for (i = 0; i < allDates.length; i++) {
        if (rates[allDates[i]] != undefined) {
            latestDate = allDates[i];
        }
    }
    return latestDate;
}

/**
 *  Extracts the symbols and the symbols to quantity mapping
 * @param {object} portfolio Portfolio from finAPI
 * @returns {[{symbol: number}, [string]]} [symbolToQuantity, symbols]
 *
 */
function getSymbolsAndMappingToQuantity(portfolio, namesToSymbols) {
    let symbolToQuantity = {};
    let symbols = [];

    portfolio.securities.forEach((element) => {
        symbolToQuantity[namesToSymbols[element.name]] =
            element.quantityNominal;
        symbols.push(namesToSymbols[element.name]);
    });
    return [symbolToQuantity, symbols];
}

// const [symbolToQuantity,symbols] = getSymbolsAndMappingToQuantity
/**
 *  Extracts the dates according to the symbols and orders them by years.
 * @param {{symbol: {date: {"1. open": number, "2. high": number, "3. low": number,"4. close": number, "5. volume": number}}}} stocksData Stocks data according to symbols
 * @returns {{year: {symbol: {date: { "1. open": number, "2. high": number, "3. low": number,"4. close": number, "5. volume": number}}}}}
 * An object: "2015" -> "IBM" -> "2015-01-01" -> "4. close": "150.00"
 */
function getStocksDateAccordingToYears(stocksData) {
    let years = {};
    Object.keys(stocksData).forEach((currSymbol) => {
        Object.keys(stocksData[currSymbol]).forEach((currDate) => {
            let jsDate = new Date(currDate);
            if (jsDate.getFullYear() in years) {
                if (currSymbol in years[jsDate.getFullYear()]) {
                    const yearsArray = years[jsDate.getFullYear()][currSymbol];
                    yearsArray.push(currDate);
                    years[jsDate.getFullYear()][currSymbol] = yearsArray;
                } else {
                    years[jsDate.getFullYear()][currSymbol] = [currDate];
                }
            } else {
                years[jsDate.getFullYear()] = {};
                years[jsDate.getFullYear()][currSymbol] = [currDate];
            }
        });
    });

    return years;
}

exports.finalPortfolioBalance = finalPortfolioBalance;
exports.mdd = mdd;
exports.bestAndWorstYear = bestAndWorstYear;
exports.standardDeviation = standardDeviation;
exports.sharpeRatio = sharpeRatio;
exports.compoundAnnualGrowthRate = compoundAnnualGrowthRate;
exports.getDaysAvailableInAll = getDaysAvailableInAll;
exports.getRiskFreeRateOnDate = getRiskFreeRateOnDate;
exports.getStocksDateAccordingToYears = getStocksDateAccordingToYears;
