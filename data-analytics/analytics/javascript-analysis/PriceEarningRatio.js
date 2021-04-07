const { namesToSymbols } = require("../../static/names-symbols-mapping")
/**
 * Returns the price-earning and average  ratio from the company overview
 * regarding the quantity of stocks bought
 * @param {object} portfolio Portfolio from finAPI 
 * @param {{symbol1: {}, symbolN: {}}} symbolCompanyOverview 
 * @returns  {{
 * peRatio: {peRatio: number},
 * averagePEration: {averagePEration: totalPEratio}
 * }}
 */
function getPriceEarningRatio(portfolio, symbolCompanyOverview) {
    let peRation = {};
    let totalPEratio = 0;
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

        peRation[symbol] = symbolCompanyOverview[symbol].PERatio;

        totalPEratio += symbolCompanyOverview[symbol].PERatio *
            symbolsToQuantity[symbol];

    });
    totalPEratio = totalPEratio;

    return {
        peRation,
        averagePEration: totalPEratio,
    };
}

exports.getPriceEarningRatio = getPriceEarningRatio;