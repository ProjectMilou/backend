/**
 *  Debt/Equity = Total Liabilities / Total Shareholders Equity
 *  `WHERE`
 *  Total Shareholders Equity = Total Assets - Total Liabilites
 * @param {object} portfolio Portfolio from finAPI
 * @param {object} balanceSheetPerSymbol Balance sheet from finAPI by the symbols in the portfolio
 * @returns {{debtEquityPerStock: {symbol: number}, totalDebtEquity: number, averageDebtEquity: number}}
 * Returns the debt/equity for each stock in the portfolio, the total debt/equity and
 * the average debt/equity of the portfolio
 */
function debtEquity(portfolio, balanceSheetPerSymbol, namesToSymbols) {
    let symbolsToQuantity = {};

    let totalQuantity = 0;
    portfolio.securities.forEach((element) => {
        symbolsToQuantity[namesToSymbols[element.name]] =
            element.quantityNominal;
        totalQuantity += element.quantityNominal;
    });

    let lambda = 1 / totalQuantity;
    Object.keys(symbolsToQuantity).forEach((symbol) => {
        symbolsToQuantity[symbol] *= lambda
    });

    let results = {}

    let weightedAverageDebtEquity = 0;

    Object.keys(balanceSheetPerSymbol).forEach(symbol => {
        let totalAssets = balanceSheetPerSymbol[symbol].totalAssets;
        let totalLiabilities = balanceSheetPerSymbol[symbol].totalLiabilities;
        let currEquityDebt = totalLiabilities / (totalAssets - totalLiabilities);
        results[symbol] = currEquityDebt
        weightedAverageDebtEquity += currEquityDebt * symbolsToQuantity[symbol]
    });

    return {
        debtEquityPerStock: results,
        averageDebtEquity: weightedAverageDebtEquity
    };
}

exports.debtEquity = debtEquity;