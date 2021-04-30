const Stock = require("../../models/stock");

async function getCompanyOverviewBySymbol(symbol) {
  let data;
  try {
    data = await Stock.findOne({ symbol: symbol });
  } catch (err) {
    console.log(`Could not find a stock with symbol=${symbol}`);
    return undefined;
  }
  const companyOverview = {};
  // TODO: Other fields have to be included: PERatios
  companyOverview["Country"] = data.country;
  companyOverview["Currency"] = data.currency;
  companyOverview["Industry"] = data.industry;
  companyOverview["DividendYield"] = data.div;
  companyOverview["AssetType"] = data.assetType;
  companyOverview["PERatio"] = data.peRatio;
  return companyOverview;
}

async function getCompanyOverviewForSymbols(symbols) {
  const companyOverviews = {};
  try {
    for (const currSymbol of symbols) {
      const currCompanyOverview = await getCompanyOverviewBySymbol(currSymbol);
      if (!currCompanyOverview) {
        return undefined;
      }
      companyOverviews[currSymbol] = currCompanyOverview;
    }
  } catch (err) {
    return undefined;
  }
  return companyOverviews;
}

async function getCompanyOverviewBySymbolWithoutReformatting(symbol) {
  let data;
  try {
    data = await Stock.findOne({ symbol: symbol });
  } catch (err) {
    console.log(`Could not find a stock with symbol=${symbol}`);
    return undefined;
  }
  return data;
}

async function getCompanyOverviewsBySymbolsWithoutReformatting(symbols) {
  const companyOverviews = {};
  try {
    for (const currSymbol of symbols) {
      const currCompanyOverview = await getCompanyOverviewBySymbolWithoutReformatting(
        currSymbol
      );
      if (!currCompanyOverview) {
        return undefined;
      }
      companyOverviews[currSymbol] = currCompanyOverview;
    }
  } catch (err) {
    return undefined;
  }
  return companyOverviews;
}

exports.getCompanyOverviewForSymbols = getCompanyOverviewForSymbols;
exports.getCompanyOverviewsBySymbolsWithoutReformatting = getCompanyOverviewsBySymbolsWithoutReformatting;
