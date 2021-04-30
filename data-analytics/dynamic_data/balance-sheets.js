const BalanceSheet = require("../../models/balanceSheet");

async function getBalanceSheetBySymbol(symbol) {
  let data;
  try {
    data = await BalanceSheet.findOne({ symbol: symbol });
  } catch (err) {
    console.log(`Could not find a stock with symbol=${symbol}`);
    return undefined;
  }
  return data;
}

async function getBalanceSheetForSymbols(symbols) {
  const balanceSheetPerSymbol = {};
  try {
    for (const currSymbol of symbols) {
      const currBalanceSheet = await getBalanceSheetBySymbol(currSymbol);
      if (!currBalanceSheet) {
        return undefined;
      }
      balanceSheetPerSymbol[currSymbol] = currBalanceSheet;
    }
  } catch (err) {
    return undefined;
  }
  return balanceSheetPerSymbol;
}

exports.getBalanceSheetForSymbols = getBalanceSheetForSymbols;
