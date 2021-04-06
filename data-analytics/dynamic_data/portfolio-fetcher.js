const Portfolio = require('../../models/portfolio');

async function findPortfolioByID(id) {
    let returnedPortfolio;
    try {
        returnedPortfolio = await Portfolio.findById(id).exec();
    } catch (err) {
        console.log(`ERROR: Portfolio with an id of ${id} was not found`)
        return undefined
    }
    const reformattedPortfolio = {
        securities: []
    }
    if (returnedPortfolio) {
        returnedPortfolio.portfolio.positions.forEach(position => {
            const currSecurity = {};
            currSecurity["name"] = position.stock.name;
            currSecurity["symbol"] = position.stock.symbol;
            currSecurity["entryQuote"] = position.stock.entryQuote;
            currSecurity["quoteDate"] = position.stock.quoteDate;
            currSecurity["quantityNominal"] = position.qty;
            currSecurity["isin"] = position.stock.isin;
            reformattedPortfolio.securities.push(currSecurity)
        });
    }
    return reformattedPortfolio;
}

exports.findPortfolioByID = findPortfolioByID;