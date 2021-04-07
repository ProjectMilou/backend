const { namesToSymbols } = require("../../static/names-symbols-mapping")
/**
 * Returns the average and the dividendyield in % of the company overview
 * regarding the quantity of stocks bought
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol1: {}, symbolN: {}}} symbolCompanyOverview 
 * @returns  {{
 * dividendyield: {dividendyield: number}
 * averageDividendyield: {averageDividendyield: totalDividendyield}
 * }}
 */
function getDividendyield(portfolio, symbolCompanyOverview) {
    let dividendyield = {};
    let totalDividendyield = 0;
    let averageDividendyield = 0;

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

    Object.keys(symbolCompanyOverview).forEach((symbol) => {
        let content = symbolCompanyOverview[symbol].DividendYield;

        totalDividendyield += symbolsToQuantity[symbol] * parseFloat(content);

        dividendyield[symbol] = parseFloat(content);

    });
    averageDividendyield = totalDividendyield / totalQuantity;

    // Why converting everything to strings ?
    totalDividendyield = totalDividendyield;
    return {
        dividendyield,
        averageDividendyield: totalDividendyield
    };
}

exports.getDividendyield = getDividendyield;