const weight = require("./weighting");

/**
 * Returns the distribution of a portfolio over different
 * industries, countries, currencies, asset classes and sectors.
 * @param {object} portfolio Portfolio from finAPI
 * @param {{symbol1: {}, symbolN: {}}} symbolCompanyOverview
 * @returns {{
 * industries: {industry: number},
 * countries: {country: number}
 * currencies: {currency: number},
 * assetClasses: {assetClass: number},
 * sectors: {sector: number}
 * }} Diversification among different criterion
 */
function getDiversification(portfolio, symbolCompanyOverview, namesToSymbols) {
  let symbolsToQuantity = weight.getWeightingForPortfolio(
    portfolio,
    namesToSymbols
  );

  let industries = {};
  let countries = {};
  let currencies = {};
  let assetClasses = {};

  Object.keys(symbolCompanyOverview).forEach((symbol) => {
    let currIndustry = symbolCompanyOverview[symbol].Industry;
    let currCountry = symbolCompanyOverview[symbol].Country;
    let currCurrency = symbolCompanyOverview[symbol].Currency;
    let currAssetClass = symbolCompanyOverview[symbol].AssetType;

    if (!(currIndustry in industries)) {
      industries[currIndustry] = symbolsToQuantity[symbol];
    } else {
      industries[currIndustry] += symbolsToQuantity[symbol];
    }

    if (!(currCountry in countries)) {
      countries[currCountry] = symbolsToQuantity[symbol];
    } else {
      countries[currCountry] += symbolsToQuantity[symbol];
    }

    if (!(currCurrency in currencies)) {
      currencies[currCurrency] = symbolsToQuantity[symbol];
    } else {
      currencies[currCurrency] += symbolsToQuantity[symbol];
    }

    if (!(currAssetClass in assetClasses)) {
      assetClasses[currAssetClass] = symbolsToQuantity[symbol];
    } else {
      assetClasses[currAssetClass] += symbolsToQuantity[symbol];
    }
  });

  return {
    industries: sortObject(industries),
    countries: sortObject(countries),
    currencies: sortObject(currencies),
    assetClasses: sortObject(assetClasses),
  };
}

function sortObject(obj) {
  return Object.entries(obj)
    .sort(([, a], [, b]) => a - b)
    .reverse()
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

exports.getDiversification = getDiversification;
