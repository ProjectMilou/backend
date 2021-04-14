const Stock = require('../../models/stock');

async function generatePortfolioForSymbol(symbol) {
    let data;
    try {
        data = await Stock.findOne({'symbol': symbol});
    } catch (err) {
        console.log(`Could not find a stock with symbol=${symbol}`)
        return undefined;
    }

    const portfolio = {}
    const securities = []
    const exampleSecurity = {
        name: data.name,
        quantity: 1,
        symbol: symbol,
    }
    securities.push(exampleSecurity)
    portfolio["securities"] = securities;
    return portfolio
}

exports.generatePortfolioForSymbol = generatePortfolioForSymbol;