const backtest = require('../backtesting/backtesting')

function getHistoricalPERatios(stocksData, keyFigures) {
    const symbol = Object.keys(stocksData)[0]
    const years = backtest.getStocksDateAccordingToYears(stocksData)
    const today = new Date()
    const toDate = new Date().setFullYear(today.getFullYear()-1)
    const fiveYearsAgo = new Date().setFullYear(today.getFullYear()-6)

    const results = []

    keyFigures["keyFigures"].forEach(keyFigure => {
        const currDate = new Date(keyFigure.fiscalDateEnding)
        if (currDate >= fiveYearsAgo && currDate <= toDate && 
                currDate.getMonth() === 11 && currDate.getDate() === 31) {
            const latestDateOfAvailablePrice = years[currDate.getFullYear()][symbol][0]
            const latestPrice = stocksData[symbol][latestDateOfAvailablePrice]["4. close"]
            const peratio = latestPrice / keyFigure.reportedEPS
            results.push({
               date: currDate.toISOString().slice(0,10),
               peratio
            })
        }
    })
    return results
}

exports.getHistoricalPERatios = getHistoricalPERatios;