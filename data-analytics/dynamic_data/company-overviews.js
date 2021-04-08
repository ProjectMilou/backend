const Stock = require('../../models/stock');

async function getCompanyOverviewBySymbol(symbol) {
    let data;
    try {
        data = await Stock.findOne({'symbol': symbol});
    } catch (err) {
        console.log(`Could not find a stock with symbol=${symbol}`)
        return undefined;
    }
    const companyOverview = {};
    // Other fields have to be included
    companyOverview["Country"] = data.country;
    companyOverview["Currency"] = data.currency;
    companyOverview["Industry"] = data.industry;
    companyOverview["DividendYield"] = data.div;
    return companyOverview;
}

async function getCompanyOverviewForSymbols(symbols) {
    const companyOverviews = {};
    try {
        for (const currSymbol of symbols) {
            const currCompanyOverview = await getCompanyOverviewBySymbol(currSymbol);
            if(!currCompanyOverview) {
                return undefined;
            }
            companyOverviews[currSymbol] = currCompanyOverview;
        }
    } catch (err) {
        return undefined;
    }
    return companyOverviews;
}

exports.getCompanyOverviewBySymbol = getCompanyOverviewBySymbol;
exports.getCompanyOverviewForSymbols = getCompanyOverviewForSymbols;