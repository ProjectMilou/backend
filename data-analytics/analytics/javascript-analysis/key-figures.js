const backtest = require('../backtesting/backtesting')

function getHistoricalPERatios(stocksData, keyFigures, balanceSheet) {
    const symbol = Object.keys(stocksData)[0]
    const years = backtest.getStocksDateAccordingToYears(stocksData)
    const today = new Date()
    const toDate = new Date()
    toDate.setFullYear(today.getFullYear()-1)
    toDate.setMonth(11)
    toDate.setDate(31)
    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(today.getFullYear()-5)
    const results = []
    const keyFiguresArray = keyFigures["keyFigures"].reverse()
    for (const keyFigure of keyFiguresArray) {
        
        const currDate = new Date(keyFigure.fiscalDateEnding)
        if (currDate >= fiveYearsAgo && currDate <= toDate && 
                currDate.getMonth() === 11 && currDate.getDate() === 31) {
            const latestDateOfAvailablePrice = years[currDate.getFullYear()][symbol][0]
            const latestPrice = stocksData[symbol][latestDateOfAvailablePrice]["4. close"]

            // https://www.investopedia.com/terms/p/price-earningsratio.asp
            const peratio = latestPrice / keyFigure.reportedEPS
            let epsLastYear = 0
            
            if(currDate.getFullYear() === fiveYearsAgo.getFullYear()){
                const myDate = new Date()
                myDate.setFullYear(currDate.getFullYear()-1)
                epsLastYear = getEpsFormYear(keyFigures, myDate)
            } else {
                epsLastYear = results[results.length-1].EPS
            }

            // https://www.investopedia.com/terms/p/pegratio.asp
            const epsGrowth = (keyFigure.reportedEPS / epsLastYear) -1
            const PEGrowthRatio = (peratio / keyFigure.reportedEPS) / (epsGrowth*100)  

            const bookValue = getBookValueForYear(balanceSheet, currDate)

            const PBRatio = latestPrice / bookValue
            results.push({
               date: currDate.toISOString().slice(0,10),
               PERatio: peratio,
               EPS: keyFigure.reportedEPS,
               PEGrowthRatio,
               PBRatio
            })
        }
    }
    return results
}

function getEpsFormYear(keyFigures, date) {
    let result = 0;
    for (const keyFigure of keyFigures["keyFigures"]) {
        const currDate = new Date(keyFigure.fiscalDateEnding)
        if (currDate.getFullYear() === date.getFullYear()) {
            result = keyFigure.reportedEPS;
            break;
        }
    }
    return result
}

function getBookValueForYear(balanceSheet, date) {
    let bookValue = 0
    for (const report of balanceSheet.annualReports) {
        if (date.getFullYear() === new Date(report.fiscalDateEnding).getFullYear()) {
            bookValue = (report.totalAssets - report.totalLiabilities) 
                / report.commonStockSharesOutstanding 
            break;
        }
    }
    return bookValue
}

exports.getHistoricalPERatios = getHistoricalPERatios;