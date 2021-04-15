function getWeightingForPortfolio(portfolio, namesToSymbols) {
    let symbolsToQuantity = {};
    let totalQuantity = 0;
    portfolio.securities.forEach((element) => {
        symbolsToQuantity[namesToSymbols[element.name]] =
            element.quantityNominal * element.entryQuote;
        totalQuantity += element.quantityNominal * element.entryQuote;
    });
    Object.keys(symbolsToQuantity).forEach((symbol) => {
        symbolsToQuantity[symbol] /= totalQuantity
    });
    return symbolsToQuantity;
}

exports.getWeightingForPortfolio = getWeightingForPortfolio;
