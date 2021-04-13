const DataPoints = require('../../models/dataPoint');

async function getStocksDataBySymbol(symbol) {
    let data;
    try {
        data = await DataPoints.findOne({'symbol': symbol});
    } catch (err) {
        console.log(`Could not find a stock with symbol=${symbol}`)
        return undefined;
    }
    if(!data){//please keep this thanks ~Rebecca
        return undefined;
    }
    const stocksData = {};
    data.dataPoints.forEach(currDataPoint => {
        const currFourthClose = {
            "4. close": currDataPoint.close
        }
        const dateString = String(currDataPoint.date);
        const myDate = new Date(dateString).toISOString().slice(0, 10)
        stocksData[myDate] = currFourthClose;
    })
    return stocksData;
}

async function getStocksDataForSymbols(symbols) {
    const stocksDataForSymbols = {};
    try {
        for (const currSymbol of symbols) {
            const currStockData = await getStocksDataBySymbol(currSymbol);
            if(!currStockData) {
                return undefined;
            }
            stocksDataForSymbols[currSymbol] = currStockData;
        }
    }catch(err) {
        console.log(err)
        return undefined;
    }
    return stocksDataForSymbols;
}

exports.getStocksDataForSymbols = getStocksDataForSymbols;