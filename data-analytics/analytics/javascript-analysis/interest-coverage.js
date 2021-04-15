function getInterestCoverageForPastFiveYears(incomeStatement) {
    const result = []
    for (var i = 0; i < 4; i++) {
        // = ebit / interest expenses
        result.push({
            date: 'dummy',
            interestCoverage: 0
        })
    }
}