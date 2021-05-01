const weight = require("./weighting");

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
function getPriceEarningRatio(
  portfolio,
  symbolCompanyOverview,
  namesToSymbols
) {
  let peRatios = {};
  let totalPEratio = 0;
  let symbolsToQuantity = weight.getWeightingForPortfolio(
    portfolio,
    namesToSymbols
  );

  Object.keys(symbolCompanyOverview).forEach((symbol) => {
    peRatios[symbol] = symbolCompanyOverview[symbol].PERatio;

    totalPEratio +=
      symbolCompanyOverview[symbol].PERatio * symbolsToQuantity[symbol];
  });
  totalPEratio = totalPEratio;

  return {
    peRatios,
    averagePEration: totalPEratio,
  };
}

exports.getPriceEarningRatio = getPriceEarningRatio;
