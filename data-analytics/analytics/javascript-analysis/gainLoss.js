const { namesToSymbols } = require("../../static/names-symbols-mapping")
/**
 * Calculates the total and per stock gain or loss by comparing the buying price
 * and the price at which the stock can be sold today
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol: {date: {"1. open": "20.6350", "2. high": "71.7300", "3. low": "70.5200","4. close": "71.4900", "5. volume": "114923"}}}} stocksData Stocks data according to symbols
 * @returns {{totalGainLoss: number, symbol:{symbolGainLoss: number}}} The gain or loss for a portfolio.
 * 
 */
function gainOrLossLastYearOrMonth(portfolio, stocksData) {
    let symbolsToQuantity = {};

    let stockEntryQuote = {
        totalEntry: 0
    };
    portfolio.securities.forEach((element) => {
        symbolsToQuantity[namesToSymbols[element.name]] =
            element.quantityNominal;
        stockEntryQuote[namesToSymbols[element.name]] =
            element.entryQuote * element.quantityNominal;
        stockEntryQuote.totalEntry += element.entryQuote * element.quantityNominal;
    });

    let gainLoss = {
        totalGainLoss: 0
    }

    Object.keys(stocksData).forEach(symbol => {
        let lastDate = Object.keys(stocksData[symbol])[0];
        let currGainLoss = stocksData[symbol][lastDate]["4. close"] * symbolsToQuantity[symbol] -
            stockEntryQuote[symbol]
        gainLoss.totalGainLoss += currGainLoss;
        gainLoss[symbol] = { symbolGainLoss: currGainLoss }
    });

    return gainLoss
}

exports.gainOrLossLastYearOrMonth = gainOrLossLastYearOrMonth;