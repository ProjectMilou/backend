function getInterestCoverageForPastFiveYears(incomeStatement) {
    const annualReports = incomeStatement.annualReports;
    const result = []
    for (var i = 0; i < 5; i++) {
        // Interest Coverage = ebit / interest expenses
        const iCoverage = annualReports[i].ebit / annualReports[i].interestExpense;
        const currDate = new Date(annualReports[i].fiscalDateEnding)
        result.push({
            date: currDate.toISOString().slice(0,10),
            interestCoverage: iCoverage
        })
    }
    return result
}

exports.getInterestCoverageForPastFiveYears = getInterestCoverageForPastFiveYears;