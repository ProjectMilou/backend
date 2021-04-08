// Entry point for any analytics

const backtesting = require('./backtesting/backtesting')

const diversification = require("./javascript-analysis/diversification");
const priceEarningRatio = require("./javascript-analysis/PriceEarningRatio");
const dividendYield = require("./javascript-analysis/Dividendyield");
const stockStandardDeviationAndCorrelation = require("./javascript-analysis/stockStandardDeviationAndCorrelation");
const GL = require("./javascript-analysis/gainLoss")
const DE = require("./javascript-analysis/debt-equity")

/**
 * Calculates the Maximum Drawdown, Best and Worst year, Final Portfolio Balance,
 * Compound Annual Growth Rate, Standard Deviation and Sharpe Ratio of a portfolio
 * over a historical time span
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol: {date: {"1. open": "20.6350", "2. high": "71.7300", "3. low": "70.5200","4. close": "71.4900", "5. volume": "114923"}}}} stocksData Stocks data according to symbols
 * @returns An object containing the analyzed data
 */
function backtest(portfolio, stocksData) {
    const MDD = backtesting.mdd(portfolio, stocksData);
    const BWY = backtesting.bestAndWorstYear(portfolio, stocksData);
    const FPV = backtesting.finalPortfolioBalance(portfolio, stocksData);

    const CAGR = backtesting.compoundAnnualGrowthRate(portfolio, stocksData);
    const standardDeviation = backtesting.standardDeviation(portfolio, stocksData);
    const sharpeRatio = backtesting.sharpeRatio(portfolio, stocksData);

    const backTestedPortfolio = {
        ...MDD,
        ...BWY,
        ...FPV,
        CAGR,
        standardDeviation,
        sharpeRatio
    }

    return backTestedPortfolio
}

function calculateDiversification(portfolio, symbolCompanyOverviews) {
    return diversification.getDiversification(portfolio, symbolCompanyOverviews);
}

function calculatePERatios(portfolio, symbolCompanyOverviews) {
    return priceEarningRatio.getPriceEarningRatio(portfolio, symbolCompanyOverviews);
}

function calculateDividendYields(portfolio, symbolCompanyOverviews) {
    const namesToSymbols = extractNamesToSymbolsMapping(portfolio)
    return dividendYield.getDividendyield(portfolio, symbolCompanyOverviews, namesToSymbols);
}

function calculateSDAndCorrelationAndVolatility(portfolio, stocksData) {
    return stockStandardDeviationAndCorrelation.standardDeviationAndCorrelation(portfolio, stocksData);
}

function calculateSharpeRatio(portfolio, stocksData) {
    return stockStandardDeviationAndCorrelation.sharpeRatioStocks(portfolio, stocksData);
}

function calculateGainAndLoss(portfolio, stocksData) {
    return GL.gainOrLossLastYearOrMonth(portfolio, stocksData);
}

function calculateDebtEquity(portfolio, balanceSheetPerSymbol) {
    return DE.debtEquity(portfolio, balanceSheetPerSymbol);
}

function extractNamesToSymbolsMapping(portfolio) {
    const namesToSymbols = {}
    portfolio.securities.forEach(security => {
        namesToSymbols[security.name] = security.symbol;
    })
    return namesToSymbols;
}

exports.backtest = backtest;
exports.calculateDebtEquity = calculateDebtEquity;
exports.calculateDiversification = calculateDiversification;
exports.calculateDividendYields = calculateDividendYields;
exports.calculatePERatios = calculatePERatios;
exports.calculateGainAndLoss = calculateGainAndLoss;
exports.calculateSDAndCorrelationAndVolatility = calculateSDAndCorrelationAndVolatility;
exports.calculateSharpeRatio = calculateSharpeRatio;