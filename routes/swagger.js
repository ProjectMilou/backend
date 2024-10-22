/**
 * @swagger
 * definitions:
 *  positionQty:
 *    type: object
 *    properties:
 *      symbol:
 *        type: string
 *      qty:
 *        type: number
 *  error:
 *    type: object
 *    properties:
 *      error:
 *        type: string
 *        enum:
 *        - PORTFOLIO_ID_INVALID
 *        - PORTFOLIO_NAME_INVALID
 *        - PORTFOLIO_NAME_DUPLICATE
 *        - TIMESTAMP_INVALID
 *        - SYMBOL_INVALID
 *        - QTY_INVALID
 *        - REAL_PORTFOLIO_MODIFICATION
 *  error2:
 *    type: object
 *    properties:
 *      error:
 *        type: string
 *        enum:
 *        - DATABASE_ERROR
 *      message:
 *          type: string
 *  range:
 *    type: string
 *    enum:
 *      - "7D"
 *      - "1M"
 *      - "6M"
 *      - "YTD"
 *      - "1J"
 *      - "5J"
 *      - "MAX"
 *  stock:
 *    type: object
 *    properties:
 *      isin:
 *        type: string
 *      wkn:
 *          type: string
 *      symbol:
 *        type: string
 *      name:
 *        type: string
 *      price:
 *        type: number
 *      displayedCurrency: 
 *          type: string
 *      marketValueCurrency:
 *          type: string
 *      perf7d:
 *        type: number
 *      perf1y:
 *        type: number
 *      perf7dPercent:
 *          type: number
 *      perf1yPercent:
 *          type: number
 *      volatility:
 *          type: number
 *      debtEquity:
 *          type: number
 *      country:
 *        type: string
 *      industry:
 *        type: string
 *      score:
 *        type: number
 *      missingData:
 *        type: boolean
 *  stockk:
 *    type: object
 *    properties:
 *      symbol:
 *        type: string
 *      analystTargetPrice:
 *        type: string
 *      country:
 *        type: string
 *      currency:
 *        type: string
 *      date:
 *        type: string
 *      industry:
 *        type: string
 *      marketCapitalization:
 *        type: string
 *      name:
 *        type: string
 *      valuation:
 *        type: string
 *      per1d:
 *        type: string
 *      per30d:
 *        type: string
 *      per7d:
 *        type: string
 *      per365d:
 *        type: string
 *      div:
 *        type: string
 *      growth:
 *        type: string
 *      isin:
 *        type: string
 *      picture:
 *        type: string
 *      wkn:
 *        type: string
 *      assetType:
 *        type: string
 *      beta:
 *        type: string
 *      bookValue:
 *        type: string
 *      cik:
 *        type: string
 *      dilutedEPSTTM:
 *        type: string
 *      dividendDate:
 *        type: string
 *      dividendPerShare:
 *        type: string
 *      ebitda:
 *        type: string
 *      eps:
 *        type: string
 *      evToEbitda:
 *        type: string
 *      evToRevenue:
 *        type: string
 *      exDividendDate:
 *        type: string
 *      exchange:
 *        type: string
 *      fiscalYearEnd:
 *        type: string
 *      forwardAnnualDividendRate:
 *        type: string
 *      forwardAnnualDividendYield:
 *        type: string
 *      forwardPE:
 *        type: string
 *      grossProfitTTM:
 *        type: string
 *      lastSplitDate:
 *        type: string
 *      lastSplitFactor:
 *        type: string
 *      latestQuarter:
 *        type: string
 *      operatingMarginTTMprofitMargin:
 *        type: string
 *      payoutRatio:
 *        type: string
 *      peRatio:
 *        type: string
 *      pegRatio:
 *        type: string
 *      per200DayMovingAverage:
 *        type: string
 *      per50DayMovingAverage:
 *        type: string
 *      per52WeekHigh:
 *        type: string
 *      per52WeekLow:
 *        type: string
 *      percentInsiders:
 *        type: string
 *      percentInstitutions:
 *        type: string
 *      priceToBookRatio:
 *        type: string
 *      priceToSalesRatioTTM:
 *        type: string
 *      profitMargin:
 *        type: string
 *      quarterlyEarningsGrowthYOY:
 *        type: string
 *      quarterlyRevenueGrowthYOY:
 *        type: string
 *      returnOnAssetsTTM:
 *        type: string
 *      returnOnEquityTTM:
 *        type: string
 *      revenuePerShareTTM:
 *        type: string
 *      revenueTTM:
 *        type: string
 *      sharesFloat:
 *        type: string
 *      sharesOutstanding:
 *        type: string
 *      sharesShort:
 *        type: string
 *      sharesShortPriorMonth:
 *        type: string
 *      shortPercentFloat:
 *        type: string
 *      shortPercentOutstanding:
 *        type: string
 *      shortRatio:
 *        type: string
 *      trailingPE:
 *        type: string
 *      price:
 *        type: string
 *      mcSize:
 *        type: string
 *  stockks:
 *        type: array
 *        items:
 *          $ref: '#/definitions/stockk'
 *
 *  stockDetails:
 *    type: object
 *    properties:
 *      symbol:
 *        type: string
 *      analystTargetPrice:
 *        type: string
 *      country:
 *        type: string
 *      currency:
 *        type: string
 *      date:
 *        type: string
 *      industry:
 *        type: string
 *      marketCapitalization:
 *        type: string
 *      name:
 *        type: string
 *      valuation:
 *        type: string
 *      per1d:
 *        type: string
 *      per30d:
 *        type: string
 *      per7d:
 *        type: string
 *      per365d:
 *        type: string
 *      address:
 *        type: string
 *      assembly:
 *        type: string
 *      div:
 *        type: string
 *      employees:
 *        type: string
 *      founded:
 *        type: string
 *      growth:
 *        type: string
 *      isin:
 *        type: string
 *      picture:
 *        type: string
 *      website:
 *        type: string
 *      wkn:
 *        type: string
 *      assetType:
 *        type: string
 *      beta:
 *        type: string
 *      bookValue:
 *        type: string
 *      cik:
 *        type: string
 *      dilutedEPSTTM:
 *        type: string
 *      dividendDate:
 *        type: string
 *      dividendPerShare:
 *        type: string
 *      ebitda:
 *        type: string
 *      eps:
 *        type: string
 *      evToEbitda:
 *        type: string
 *      evToRevenue:
 *        type: string
 *      exDividendDate:
 *        type: string
 *      exchange:
 *        type: string
 *      fiscalYearEnd:
 *        type: string
 *      forwardAnnualDividendRate:
 *        type: string
 *      forwardAnnualDividendYield:
 *        type: string
 *      forwardPE:
 *        type: string
 *      grossProfitTTM:
 *        type: string
 *      lastSplitDate:
 *        type: string
 *      lastSplitFactor:
 *        type: string
 *      latestQuarter:
 *        type: string
 *      operatingMarginTTMprofitMargin:
 *        type: string
 *      payoutRatio:
 *        type: string
 *      peRatio:
 *        type: string
 *      pegRatio:
 *        type: string
 *      per200DayMovingAverage:
 *        type: string
 *      per50DayMovingAverage:
 *        type: string
 *      per52WeekHigh:
 *        type: string
 *      per52WeekLow:
 *        type: string
 *      percentInsiders:
 *        type: string
 *      percentInstitutions:
 *        type: string
 *      priceToBookRatio:
 *        type: string
 *      priceToSalesRatioTTM:
 *        type: string
 *      profitMargin:
 *        type: string
 *      quarterlyEarningsGrowthYOY:
 *        type: string
 *      quarterlyRevenueGrowthYOY:
 *        type: string
 *      returnOnAssetsTTM:
 *        type: string
 *      returnOnEquityTTM:
 *        type: string
 *      revenuePerShareTTM:
 *        type: string
 *      revenueTTM:
 *        type: string
 *      sharesFloat:
 *        type: string
 *      sharesOutstanding:
 *        type: string
 *      sharesShort:
 *        type: string
 *      sharesShortPriorMonth:
 *        type: string
 *      shortPercentFloat:
 *        type: string
 *      shortPercentOutstanding:
 *        type: string
 *      shortRatio:
 *        type: string
 *      trailingPE:
 *        type: string
 *      price:
 *        type: string
 *      mcSize:
 *        type: string
 *  stockDetailsss:
 *          type: array
 *          items:
 *              $ref: '#/definitions/stockDetails'
 *
 *  dataPoint:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      close:
 *        type: string
 *  dataPoints:
 *        type: array
 *        items:
 *          $ref: '#/definitions/dataPoint'
 *  keyFigureee:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedDate:
 *        type: string
 *      reportedEPS:
 *        type: string
 *      estimatedEPS:
 *        type: string
 *      surprise:
 *        type: string
 *      surprisePercentage:
 *        type: string
 *  keyFigureees:
 *        type: array
 *        items:
 *          $ref: '#/definitions/keyFigureee'
 *
 *  dataPointtt:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      div:
 *        type: string
 *  dataPointtts:
 *        type: array
 *        items:
 *          $ref: '#/definitions/dataPointtt'
 *
 *
 *  annualReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      totalAssets:
 *        type: string
 *      totalCurrentAssets:
 *        type: string
 *      cashAndCashEquivalentsAtCarryingValue:
 *        type: string
 *      cashAndShortTermInvestments:
 *        type: string
 *      inventory:
 *        type: string
 *      currentNetReceivables:
 *        type: string
 *      totalNonCurrentAssets:
 *        type: string
 *      propertyPlantEquipment:
 *        type: string
 *      accumulatedDepreciationAmortizationPPE:
 *        type: string
 *      intangibleAssets:
 *        type: string
 *      intangibleAssetsExcludingGoodwill:
 *        type: string
 *      goodwill:
 *        type: string
 *      investments:
 *        type: string
 *      longTermInvestments:
 *        type: string
 *      shortTermInvestments:
 *        type: string
 *      otherCurrentAssets:
 *        type: string
 *      otherNonCurrrentAssets:
 *        type: string
 *      totalLiabilities:
 *        type: string
 *      totalCurrentLiabilities:
 *        type: string
 *      currentAccountsPayable:
 *        type: string
 *      deferredRevenue:
 *        type: string
 *      currentDebt:
 *        type: string
 *      shortTermDebt:
 *        type: string
 *      totalNonCurrentLiabilities:
 *        type: string
 *      capitalLeaseObligations:
 *        type: string
 *      longTermDebt:
 *        type: string
 *      currentLongTermDebt:
 *        type: string
 *      longTermDebtNoncurrent:
 *        type: string
 *      shortLongTermDebtTotal:
 *        type: string
 *      otherCurrentLiabilities:
 *        type: string
 *      otherNonCurrentLiabilities:
 *        type: string
 *      totalShareholderEquity:
 *        type: string
 *      treasuryStock:
 *        type: string
 *      retainedEarnings:
 *        type: string
 *      commonStock:
 *        type: string
 *      commonStockSharesOutstanding:
 *        type: string
 *  annualReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/annualReport'
 *
 *  quarterlyReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      totalAssets:
 *        type: string
 *      totalCurrentAssets:
 *        type: string
 *      cashAndCashEquivalentsAtCarryingValue:
 *        type: string
 *      cashAndShortTermInvestments:
 *        type: string
 *      inventory:
 *        type: string
 *      currentNetReceivables:
 *        type: string
 *      totalNonCurrentAssets:
 *        type: string
 *      propertyPlantEquipment:
 *        type: string
 *      accumulatedDepreciationAmortizationPPE:
 *        type: string
 *      intangibleAssets:
 *        type: string
 *      intangibleAssetsExcludingGoodwill:
 *        type: string
 *      goodwill:
 *        type: string
 *      investments:
 *        type: string
 *      longTermInvestments:
 *        type: string
 *      shortTermInvestments:
 *        type: string
 *      otherCurrentAssets:
 *        type: string
 *      otherNonCurrrentAssets:
 *        type: string
 *      totalLiabilities:
 *        type: string
 *      totalCurrentLiabilities:
 *        type: string
 *      currentAccountsPayable:
 *        type: string
 *      deferredRevenue:
 *        type: string
 *      currentDebt:
 *        type: string
 *      shortTermDebt:
 *        type: string
 *      totalNonCurrentLiabilities:
 *        type: string
 *      capitalLeaseObligations:
 *        type: string
 *      longTermDebt:
 *        type: string
 *      currentLongTermDebt:
 *        type: string
 *      longTermDebtNoncurrent:
 *        type: string
 *      shortLongTermDebtTotal:
 *        type: string
 *      otherCurrentLiabilities:
 *        type: string
 *      otherNonCurrentLiabilities:
 *        type: string
 *      totalShareholderEquity:
 *        type: string
 *      treasuryStock:
 *        type: string
 *      retainedEarnings:
 *        type: string
 *      commonStock:
 *        type: string
 *      commonStockSharesOutstanding:
 *        type: string
 *  quarterlyReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/quarterlyReport'
 *
 *  incomeStatementAnnualReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      grossProfit:
 *        type: string
 *      totalRevenue:
 *        type: string
 *      costOfRevenue:
 *        type: string
 *      costofGoodsAndServicesSold:
 *        type: string
 *      operatingIncome:
 *        type: string
 *      sellingGeneralAndAdministrative:
 *        type: string
 *      researchAndDevelopment:
 *        type: string
 *      operatingExpenses:
 *        type: string
 *      investmentIncomeNet:
 *        type: string
 *      netInterestIncome:
 *        type: string
 *      interestIncome:
 *        type: string
 *      interestExpense:
 *        type: string
 *      nonInterestIncome:
 *        type: string
 *      otherNonOperatingIncome:
 *        type: string
 *      depreciation:
 *        type: string
 *      depreciationAndAmortization:
 *        type: string
 *      incomeBeforeTax:
 *        type: string
 *      incomeTaxExpense:
 *        type: string
 *      interestAndDebtExpense:
 *        type: string
 *      netIncomeFromContinuingOperations:
 *        type: string
 *      comprehensiveIncomeNetOfTax:
 *        type: string
 *      ebit:
 *        type: string
 *      ebitda:
 *        type: string
 *      netIncome:
 *        type: string
 *
 *  incomeStatementAnnualReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/incomeStatementAnnualReport'
 *
 *  incomeStatementQuarterlyReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      grossProfit:
 *        type: string
 *      totalRevenue:
 *        type: string
 *      costOfRevenue:
 *        type: string
 *      costofGoodsAndServicesSold:
 *        type: string
 *      operatingIncome:
 *        type: string
 *      sellingGeneralAndAdministrative:
 *        type: string
 *      researchAndDevelopment:
 *        type: string
 *      operatingExpenses:
 *        type: string
 *      investmentIncomeNet:
 *        type: string
 *      netInterestIncome:
 *        type: string
 *      interestIncome:
 *        type: string
 *      interestExpense:
 *        type: string
 *      nonInterestIncome:
 *        type: string
 *      otherNonOperatingIncome:
 *        type: string
 *      depreciation:
 *        type: string
 *      depreciationAndAmortization:
 *        type: string
 *      incomeBeforeTax:
 *        type: string
 *      incomeTaxExpense:
 *        type: string
 *      interestAndDebtExpense:
 *        type: string
 *      netIncomeFromContinuingOperations:
 *        type: string
 *      comprehensiveIncomeNetOfTax:
 *        type: string
 *      ebit:
 *        type: string
 *      ebitda:
 *        type: string
 *      netIncome:
 *        type: string
 *
 *  incomeStatementQuarterlyReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/incomeStatementQuarterlyReport'
 *
 *
 *  cashFlowAnnualReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      operatingCashflow:
 *        type: string
 *      paymentsForOperatingActivities:
 *        type: string
 *      proceedsFromOperatingActivities:
 *        type: string
 *      changeInOperatingLiabilities:
 *        type: string
 *      changeInOperatingAssets:
 *        type: string
 *      depreciationDepletionAndAmortization:
 *        type: string
 *      capitalExpenditures:
 *        type: string
 *      changeInReceivables:
 *        type: string
 *      changeInInventory:
 *        type: string
 *      profitLoss:
 *        type: string
 *      cashflowFromInvestment:
 *        type: string
 *      cashflowFromFinancing:
 *        type: string
 *      proceedsFromRepaymentsOfShortTermDebt:
 *        type: string
 *      paymentsForRepurchaseOfCommonStock:
 *        type: string
 *      paymentsForRepurchaseOfEquity:
 *        type: string
 *      paymentsForRepurchaseOfPreferredStock:
 *        type: string
 *      dividendPayout:
 *        type: string
 *      dividendPayoutCommonStock:
 *        type: string
 *      dividendPayoutPreferredStock:
 *        type: string
 *      proceedsFromIssuanceOfCommonStock:
 *        type: string
 *      proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet:
 *        type: string
 *      proceedsFromIssuanceOfPreferredStock:
 *        type: string
 *      proceedsFromRepurchaseOfEquity:
 *        type: string
 *      proceedsFromSaleOfTreasuryStock:
 *        type: string
 *      changeInCashAndCashEquivalents:
 *        type: string
 *      changeInExchangeRate:
 *        type: string
 *      netIncome:
 *        type: string
 *
 *  cashFlowAnnualReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/cashFlowAnnualReport'
 *
 *  cashFlowQuarterlyReport:
 *    type: object
 *    properties:
 *      fiscalDateEnding:
 *        type: string
 *      reportedCurrency:
 *        type: string
 *      operatingCashflow:
 *        type: string
 *      paymentsForOperatingActivities:
 *        type: string
 *      proceedsFromOperatingActivities:
 *        type: string
 *      changeInOperatingLiabilities:
 *        type: string
 *      changeInOperatingAssets:
 *        type: string
 *      depreciationDepletionAndAmortization:
 *        type: string
 *      capitalExpenditures:
 *        type: string
 *      changeInReceivables:
 *        type: string
 *      changeInInventory:
 *        type: string
 *      profitLoss:
 *        type: string
 *      cashflowFromInvestment:
 *        type: string
 *      cashflowFromFinancing:
 *        type: string
 *      proceedsFromRepaymentsOfShortTermDebt:
 *        type: string
 *      paymentsForRepurchaseOfCommonStock:
 *        type: string
 *      paymentsForRepurchaseOfEquity:
 *        type: string
 *      paymentsForRepurchaseOfPreferredStock:
 *        type: string
 *      dividendPayout:
 *        type: string
 *      dividendPayoutCommonStock:
 *        type: string
 *      dividendPayoutPreferredStock:
 *        type: string
 *      proceedsFromIssuanceOfCommonStock:
 *        type: string
 *      proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet:
 *        type: string
 *      proceedsFromIssuanceOfPreferredStock:
 *        type: string
 *      proceedsFromRepurchaseOfEquity:
 *        type: string
 *      proceedsFromSaleOfTreasuryStock:
 *        type: string
 *      changeInCashAndCashEquivalents:
 *        type: string
 *      changeInExchangeRate:
 *        type: string
 *      netIncome:
 *        type: string
 *
 *  cashFlowQuarterlyReports:
 *        type: array
 *        items:
 *          $ref: '#/definitions/cashFlowQuarterlyReport'
 *
 *  rating:
 *    type: object
 *    properties:
 *      date:
 *        type: string
 *      goal:
 *        type: string
 *      strategy:
 *        type: string
 *      source:
 *        type: string
 *
 *  ratings:
 *        type: array
 *        items:
 *          $ref: '#/definitions/rating'
 *  news:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      headline:
 *        type: string
 *      summary:
 *        type: string
 *      url:
 *        type: string
 *  newsss:
 *        type: array
 *        items:
 *          $ref: '#/definitions/news'
 *
 *  portfolioOverview:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      name:
 *        type: string
 *      virtual:
 *        type: boolean
 *      positionCount:
 *        type: integer
 *      value:
 *        type: number
 *      displayedCurrency: 
 *          type: string
 *      score:
 *        type: number
 *      perf7d:
 *        type: number
 *      perf1y:
 *        type: number
 *      perf7dPercent:
 *          type: number
 *      perf1yPercent:
 *          type: number
 *      modified:
 *        type: number
 *        format: UNIX timestamp
 *  position:
 *    type: object
 *    properties:
 *      stock:
 *        $ref: '#/definitions/stock'
 *      qty:
 *        type: number
 *      quantityNominalType:
 *          type: string
 *      totalReturn:
 *        type: number
 *      totalReturnPercent:
 *          type: number
 *  portfolioQty:
 *      type: object
 *      properties:
 *          id:
 *              type: string
 *          qty:
 *              type: number
 *  portfolioStock:
 *      type: object
 *      properties:
 *          id:
 *              type: string
 *          name:
 *              type: string
 *          virtual:
 *              type: boolean
 *          qty:
 *              type: number
 *  risk:
 *    type: object
 *    properties:
 *      USA:
 *        type: number
 *      DE:
 *        type: number
 *      etc:
 *          type: number
 *  riskAnalysis:
 *    type: object
 *    properties:
 *      countries:
 *        $ref: '#/definitions/risk'
 *      segments:
 *        $ref: '#/definitions/risk'
 *      currency:
 *        $ref: '#/definitions/risk'
 *  keyFigures:
 *    type: object
 *    properties:
 *      year:
 *        type: integer
 *      pte:
 *        type: number
 *      ptb:
 *        type: number
 *      ptg:
 *        type: number
 *      eps:
 *        type: number
 *      div:
 *        type: number
 *      dividendPayoutRatio:
 *        type: number
 *  analytics:
 *      type: object
 *      properties:
 *          volatility:
 *              type: number
 *          standardDeviation:
 *              type: number
 *          sharpeRatio:
 *              type: number
 *          treynorRatio:
 *              type: number
 *          debtEquity:
 *              type: number
 *          correlations:
 *              type: object
 *
 *  portfolioDetails:
 *    type: object
 *    properties:
 *      overview:
 *        $ref: '#/definitions/portfolioOverview'
 *      positions:
 *        type: array
 *        items:
 *          $ref: '#/definitions/position'
 *      risk:
 *        $ref: '#/definitions/riskAnalysis'
 *      keyFigures:
 *        type: array
 *        items:
 *          $ref: '#/definitions/keyFigures'
 *      nextDividend:
 *        type: number
 *        format: UNIX timestamp
 *      totalReturn:
 *          type: number
 *      totalReturnPercent:
 *          type: number
 *      analytics:
 *          $ref: '#/definitions/analytics'
 *  bestYear:
 *      properties:
 *          changeBest:
 *              type: number
 *          yearBest:
 *              type: string
 *          growthRateBest:
 *              type: number
 *
 *  worstYear:
 *      properties:
 *          changeWorst:
 *              type: number
 *          yearBest:
 *              type: string
 *          growthRateWorst:
 *              type: number
 *
 *  backtestResult:
 *      type: object
 *      properties:
 *           MDDMaxToMin:
 *              type: number
 *           MDDInitialToMin":
 *              type: number
 *           dateMax:
 *              type: string
 *           dateMin:
 *              type: string
 *           maxValue:
 *              type: number
 *           minValue:
 *              type: number
 *           initialValue:
 *              type: number
 *           bestYear:
 *               $ref: '#/definitions/bestYear'
 *           worstYear:
 *               $ref: '#/definitions/worstYear'
 *           finalPortfolioBalance:
 *              type: number
 *           CAGR:
 *              type: number
 *           standardDeviation:
 *              type: number
 *           sharpeRatio:
 *              type: number
 *
 * /portfolio/list:
 *  get:
 *    tags:
 *    - portfolio
 *    summary: Get all portfolios of the current user
 *    description: Gets all portfolios of the current user with basic information to display in the portfolio dashboard.
 *
 *                  (The value of "id" is the real one, "_id" can be ignored)
 * 
 *                  The currency of "value" is defined in "displayedCurrency", and it is always "EUR".
 *    operationId: getPortfolios
 *    produces:
 *    - application/json
 *    parameters: []
 *    responses:
 *      200:
 *        description: successful operation
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/portfolioOverview'
 *      500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *      401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *
 *    security:
 *    - api_key: []
 *
 * /portfolio/details/{portfolioId}:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Get details of portfolio
 *     description: Gets portfolio details including key figures (empty for now), scores(?), positions and analytics values.
 *                      
 *                      The currency of the price of the single stocks is the currency specified inside of the "stock.displayedCurrency" parameter, 
 *                      which is always EUR. The value that we get from Alpha Vantage is therefore converted to EUR.
 *                      The "stock.marketValueCurrency" value gives information about what currency the price has on the market. 
 *                      This is important for calculationg the risks and diversification of the portfolio.
 *     operationId: getPortfolio
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio that needs to be fetched
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/portfolioDetails'
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *
 * /portfolio/performance/{portfolioId}:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Get data for portfolio chart
 *     description: Gets the data points to display a performance chart.
 *                   A new data point is added every day at 2 o'clock.
 *     operationId: portfolioPerformance
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - name: portfolioId
 *         in: path
 *         description: ID of the portfolio to get its data points
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             chart:
 *               type: array
 *               items:
 *                  type: array
 *                  items:
 *                      type: number
 *                  minItems: 2
 *                  maxItems: 2
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized

 *
 * /portfolio/create:
 *   post:
 *     tags:
 *     - portfolio
 *     summary: Create new portfolio
 *     description: Creates a new, empty, virtual portfolio and saves the timestamp of the portfolio creation in the portfolio's history.
 *     operationId: createPortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: body
 *         name: name
 *         description: The name of the new portfolio
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *
 * /portfolio/{portfolioId}:
 *   delete:
 *     tags:
 *     - portfolio
 *     summary: Delete portfolio by ID
 *     description: Deletes portfolio with given id, if it exists.
 *     operationId: deletePortfolio
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be deleted
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_NOT_EXISTS
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *
 * /portfolio/rename/{portfolioId}:
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Rename a portfolio
 *     description: Renames the portfolio with the given id.
 *     operationId: renamePortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: name
 *       description: The new name of the portfolio
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be renamed
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *
 * /portfolio/modify/{portfolioId}:
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Modify positions of a portfolio
 *     description: Modifies the positions of a portfolio and saves the timestamp of the modification in the portfolio's history.
 *
 *       If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists.
 *       If there is no position in the specified portfolio, a new position with the specified quantity is created.
 *       Otherwise, the position in the specified portfolio is updated to match the specified quantity.
 *
 *       Positions not included in the request remain unchanged.
 *       The position which is changed is the one which has isin, wkn, symbol or name equal to the parameter symbol
 *       (which you can call either isin, wkn, name or symbol).
 *       It is safest to search with the symbol as parameter, because in our API we can search stocks by symbol.
 * 
 *       Only virtual portfolios can be modified.
 *       
 *       If any of the modifications causes an error, none of the modifications get stored in the database.
 *     operationId: modifyPortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: modifications
 *       description: Which positions need to be changed
 *       schema:
 *         type: object
 *         properties:
 *           modifications:
 *             type: array
 *             items:
 *               $ref: '#/definitions/positionQty'
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be modified
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: QTY_INVALID/SYMBOL_INVALID/REAL_PORTFOLIO_MODIFICATION
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *         description: Unauthorized
 *         schema:
 *            type: string
 *            example: Unauthorized
 * /portfolio/duplicate/{portfolioId}:
 *   post:
 *     tags:
 *     - portfolio
 *     - portfolio
 *     summary: Duplicate a portfolio
 *     description: Creates a new virtual portfolio as a duplicate of a real or virtual portfolio. Changes to a real portfolio will not be tracked in the duplicated version.
 *     operationId: duplicatePortfolio
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: name
 *       description: The name of the new portfolio
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be duplicated
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: PORTFOLIO_NAME_DUPLICATE/PORTFOLIO_NAME_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 * /portfolio/stock/{symbol}:
 *   get:
 *     tags:
 *     - portfolio
 *     summary: Gets the portfolio name and quantity of a specified stock for all portfolios of the current user.
 *     description: This information is displayed to the user when adding a stock to his portfolios.
 *          The parameter "symbol" may be the symbol, the isin, the wkn or the name of a certain stock. The preferred parameter is symbol.
 *     operationId: portfolioStock
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: path
 *         name: symbol
 *         description: symbol, ISIN, WKN or name of the specified stock
 *         required: true
 *         schema:
 *            type: object
 *            properties:
 *              symbol:
 *                type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/portfolioStock'
 *       400:
 *         description: SYMBOL_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 *   put:
 *     tags:
 *     - portfolio
 *     summary: Modify stock quantity
 *     description: Modifies a stock's quantity within multiple portfolios simultaneously.
 *
 *      If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists.
 *      If there is no position in the specified portfolio, a new position with the specified quantity is created.
 *      Otherwise, the position in the specified portfolio is updated to match the specified quantity.
 *
 *      Positions not included in the request remain unchanged.
 *     operationId: modifyStocks
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: symbol
 *       description: symbol, ISIN, WKN or name of the specified stock. The preferred parameter is symbol.
 *       required: true
 *       schema:
 *            type: object
 *            properties:
 *              symbol:
 *                type: string
 *     - in: body
 *       name: symbol and modifications
 *       description: modifications; portfolioId and new quantity
 *       schema:
 *         type: object
 *         properties:
 *           modifications:
 *             type: array
 *             items:
 *               $ref: '#/definitions/portfolioQty'
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: PORTFOLIO_ID_INVALID
 *         schema:
 *           $ref: '#/definitions/error'
 *       400:
 *         description: QTY_INVALID/SYMBOL_INVALID/REAL_PORTFOLIO_MODIFICATION
 *         schema:
 *           $ref: '#/definitions/error'
 *       500:
 *        description: DATABASE_ERROR
 *        schema:
 *            $ref: '#/definitions/error2'
 *       401:
 *        description: Unauthorized
 *        schema:
 *            type: string
 *            example: Unauthorized
 * /stocks/list?country={country}&currency={currency}&industry={industry}&mc={mc}:
 *  get:
 *   summary: Returns a stock list according to filter.
 *   description: Returns a stock list according to filter.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: country
 *       in: path
 *       description: country of stock
 *       required: false
 *       type: string
 *     - name: currency
 *       in: path
 *       description: currency of stock
 *       required: false
 *       type: string
 *     - name: industry
 *       in: path
 *       description: industry of stock
 *       required: false
 *       type: string
 *     - name: mc
 *       in: path
 *       description: market capitalization of stock
 *       required: false
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        stocks:
 *         $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 *
 * /stocks/search?id={id}:
 *  get:
 *   summary: Returns stock list with search parameter.
 *   description: Returns stock list with search parameter.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: can be name, isin, wkn, symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        stocks:
 *         $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 *
 * /stocks/overview?id={id}:
 *  get:
 *   summary: Returns a stock overview with given id.
 *   description: Returns a stock overview with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: can be symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        stocks:
 *         $ref: '#/definitions/stockks'
 *    '400':
 *      description: Invalid
 *
 * /stocks/details?id={id}:
 *  get:
 *   summary: Returns details of a stock with given id.
 *   description: Returns details of a stock with given id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *        type : object
 *        properties:
 *          stocks:
 *            $ref: '#/definitions/stockDetailsss'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/historic?id={id}&max={max}:
 *  get:
 *   summary: Get the performance of the stock from beginning or last 5 years.
 *   description: Get the performance of the stock from beginning or last 5 years.
 *   produces:
 *    - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        dataPoints:
 *         $ref: '#/definitions/dataPoints'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/key_figures?id={id}&max={max}:
 *  get:
 *   summary: Get the key figures of the stock from beginning or last 5 years.
 *   description: Get the key figures of the stock from beginning or last 5 years.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        symbol:
 *         type : string
 *        keyFigures:
 *         $ref: '#/definitions/keyFigureees'
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/dividend?id={id}&max={max}:
 *  get:
 *   summary: Get the key figures of the stock from beginning or last 5 years.
 *   description: Get the key figures of the stock from beginning or last 5 years.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *     - name: max
 *       in: path
 *       description: all data points if true, else only last 5 years
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        dataPoints:
 *         $ref: '#/definitions/dataPointtts'
 *        date:
 *         type : string
 *        quota:
 *         type : string
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/detailed-analysts?id={id}:
 *  get:
 *   summary: Get the analysts recommendation from Benzinga.
 *   description: Get the analysts recommendation from Benzinga.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          type: object
 *          properties:
 *              rating:
 *                  $ref: '#/definitions/ratings'
 *              averageGoal:
 *                  type: string
 *    '400':
 *      description: Invalid
 *
 * /stocks/charts/analysts?id={id}:
 *  get:
 *   summary: Get the analysts recommendation from Finapi.
 *   description: Get the analysts recommendation from Finapi.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *          type: object
 *          properties:
 *              symbol:
 *                  type: string
 *              buy:
 *                  type: string
 *              date:
 *                  type: string
 *              hold:
 *                  type: string
 *              sell:
 *                  type: string
 *              source:
 *                  type: string
 *              strategy:
 *                  type: string
 *    '400':
 *      description: Invalid
 *
 * /stocks/news?id={id}:
 *  get:
 *   summary: Returns news list with given stock id.
 *   description: Returns news list with given stock id.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        news:
 *         $ref: '#/definitions/newsss'
 *    '400':
 *      description: Invalid
 *
 * /stocks/balanceSheet?id={id}:
 *  get:
 *   summary: Get balance sheet.
 *   description: Get balance sheet.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        symbol:
 *         type : string
 *        annualReports:
 *         $ref: '#/definitions/annualReports'
 *    '400':
 *      description: Invalid
 *
 * /stocks/incomeStatement?id={id}:
 *  get:
 *   summary: Get income statement.
 *   description: Get income statement.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        symbol:
 *         type : string
 *        annualReports:
 *         $ref: '#/definitions/incomeStatementAnnualReports'
 *    '400':
 *      description: Invalid
 *
 * /stocks/cashFlow?id={id}:
 *  get:
 *   summary: Get cash flow.
 *   description: Get cash flow.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol of a stock
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type : object
 *       properties:
 *        symbol:
 *         type : string
 *        annualReports:
 *         $ref: '#/definitions/cashFlowAnnualReports'
 *    '400':
 *      description: Invalid
 *
 * /stocks/finanzen?id={id}:
 *  get:
 *   summary: Get finanzen data.
 *   description: Get finanzen data.
 *   produces:
 *     - application/json
 *   parameters:
 *     - name: id
 *       in: path
 *       description: symbol
 *       required: true
 *       type: string
 *   tags:
 *    - stocks
 *   responses:
 *    '200':
 *      description: Successful operation
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *        first:
 *         type: array
 *         items:
 *          type: string
 *        second:
 *         type: array
 *         items:
 *          type: string
 *        third:
 *         type: array
 *         items:
 *          type: string
 *    '400':
 *      description: Invalid
 *
 *
 *
 * /analytics/backtest/{portfolioId}?fromDate={fromDate}&toDate={toDate}:
 *  get:
 *   description: Backtests a real or a virtual portfolio for a given period of time
 *   summary: Backtests a real or a virtual portfolio for a given period of time
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of the portfolio that needs to be backtested
 *       required: true
 *       type: string
 *     - name: fromDate
 *       in: path
 *       description: Beginning date for the backtest
 *       required: true
 *       type: string
 *     - name: toDate
 *       in: path
 *       description: Ending date for the backtest
 *       required: true
 *       type: string
 *   requestbody:
 *        portfolioId: The id of the Portfolio
 *        startDate: The start date for the backtest
 *        endDate: The end date for the backtest
 *   responses:
 *      '200':
 *          description: Success.
 *          schema:
 *              $ref: '#/definitions/backtestResult'
 *      '404':
 *          description: Portfolio ID incorrect, Date format incorrect, no data for the stocks.
 *
 * /analytics/diversification/{portfolioId}:
 *  get:
 *   description: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   summary: Calculates the weighted distribution of stocks in a portfolio among different criterion
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.*
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
 * /analytics/dividends/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average dividend and also returns the dividends per stock
 *   summary: Calculates the weighted average dividend and also returns the dividends per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
 * /analytics/peratios/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   summary: Calculates the weighted average of PERatio of a portfolio and returns also the PERatios per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
 * /analytics/gainLoss/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   summary: Calculates the weighted average of Gain or Loss of a portfolio and returns also the gain or loss per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
 * /analytics/volatilityCorrelation/{portfolioId}:
 *  get:
 *   description: Calculates the volatility and correlation of stocks within a portfolio
 *   summary: Calculates the volatility and correlation of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
* /analytics/sharpeRatio/{portfolioId}:
 *  get:
 *   description: Calculates the sharpe ratio of stocks within a portfolio
 *   summary: Calculates the sharpe ratio of stocks within a portfolio
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 *
 * /analytics/debtEquity/{portfolioId}:
 *  get:
 *   description: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   summary: Calculates the weighted average of debt/equity of a portfolio and returns also the debt/equity per stock
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 * /analytics/risk/{symbol}:
 *  get:
 *   description: Calculates the volatility of the stock and returns it. Also returns the average market volatility
 *   summary: Calculates the volatility of the stock and returns it. Also returns the average market volatility
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: symbol
 *       in: path
 *       description: Symbol
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: There is no data for the stocks
 * 
 * /analytics/keyfigures/{symbol}:
 *  get:
 *   description: Calculates the PERatio, PEGRatio, PBRatio and EPS.
 *   summary: Calculates the PERatio, PEGRatio, PBRatio and EPS.
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: symbol
 *       in: path
 *       description: Symbol
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: There is no data for the stocks
 * /analytics/treynorRatio/{portfolioId}:
 *  get:
 *   description: Calculates the treynor ratio of a portfolio
 *   summary: Calculates the treynor ratio of a portfolioo
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: portfolioId
 *       in: path
 *       description: ID of portfolio
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: Either portfolio ID is not correct or there is no data for the stocks
 * /analytics/interestCoverage/{symbol}:
 *  get:
 *   description: Calculates the interest coverage of symbol
 *   summary: Calculates the interest coverage of symbol
 *   produces:
 *      - application/json
 *   tags:
 *    - analytics
 *   parameters:
 *     - name: symbol
 *       in: path
 *       description: Symbol
 *       required: true
 *       type: string
 *   responses:
 *      '200':
 *          description: Success.
 *      '404':
 *          description: There is no data for the stocks
*/
