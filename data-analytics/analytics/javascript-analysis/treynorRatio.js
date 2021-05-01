const backtesting = require("../backtesting/backtesting.js");

function treynorRatio(portfolio, stocksData, symbolToBeta, namesToSymbols) {
  const usedDates = backtesting.getDaysAvailableInAll(
    portfolio,
    stocksData,
    namesToSymbols
  );
  const portfolioReturn = backtesting.compoundAnnualGrowthRate(
    portfolio,
    stocksData,
    namesToSymbols
  );
  const riskFreeRate =
    backtesting.getRiskFreeRateOnDate(usedDates[usedDates.length - 1]) / 100;
  const weights = weightsToName(portfolio, stocksData, namesToSymbols);

  let portfolioBeta = 0;
  portfolio.securities.forEach((stock) => {
    portfolioBeta +=
      weights[stock.name] * symbolToBeta[namesToSymbols[stock.name]];
  });

  return (portfolioReturn - riskFreeRate) / portfolioBeta;
}

function weightsToName(portfolio, stocksData, namesToSymbols) {
  const usedDates = backtesting.getDaysAvailableInAll(
    portfolio,
    stocksData,
    namesToSymbols
  );
  const date = usedDates[0];

  let portfolioSum = 0;
  portfolio.securities.forEach((stock) => {
    portfolioSum +=
      stocksData[namesToSymbols[stock.name]][date]["4. close"] *
      stock.quantityNominal;
  });

  let nameToWeight = {};
  portfolio.securities.forEach((stock) => {
    nameToWeight[stock.name] =
      Number(
        stocksData[namesToSymbols[stock.name]][date]["4. close"] *
          stock.quantityNominal
      ) / portfolioSum;
  });

  return nameToWeight;
}

exports.weights = weightsToName;
exports.treynorRatio = treynorRatio;
