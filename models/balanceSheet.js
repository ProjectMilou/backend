const mongoose = require("mongoose");

const BalanceSheetSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    annualReports: [
      {
        fiscalDateEnding: {
          type: String,
        },
        reportedCurrency: {
          type: String,
        },
        totalAssets: {
          type: String,
        },
        totalCurrentAssets: {
          type: String,
        },
        cashAndCashEquivalentsAtCarryingValue: {
          type: String,
        },
        cashAndShortTermInvestments: {
          type: String,
        },
        inventory: {
          type: String,
        },
        currentNetReceivables: {
          type: String,
        },
        totalNonCurrentAssets: {
          type: String,
        },
        propertyPlantEquipment: {
          type: String,
        },
        accumulatedDepreciationAmortizationPPE: {
          type: String,
        },
        intangibleAssets: {
          type: String,
        },
        intangibleAssetsExcludingGoodwill: {
          type: String,
        },
        goodwill: {
          type: String,
        },
        investments: {
          type: String,
        },
        longTermInvestments: {
          type: String,
        },
        shortTermInvestments: {
          type: String,
        },
        otherCurrentAssets: {
          type: String,
        },
        otherNonCurrrentAssets: {
          type: String,
        },
        totalLiabilities: {
          type: String,
        },
        totalCurrentLiabilities: {
          type: String,
        },
        currentAccountsPayable: {
          type: String,
        },
        deferredRevenue: {
          type: String,
        },
        currentDebt: {
          type: String,
        },
        shortTermDebt: {
          type: String,
        },
        totalNonCurrentLiabilities: {
          type: String,
        },
        capitalLeaseObligations: {
          type: String,
        },
        longTermDebt: {
          type: String,
        },
        currentLongTermDebt: {
          type: String,
        },
        longTermDebtNoncurrent: {
          type: String,
        },
        shortLongTermDebtTotal: {
          type: String,
        },
        otherCurrentLiabilities: {
          type: String,
        },
        otherNonCurrentLiabilities: {
          type: String,
        },
        totalShareholderEquity: {
          type: String,
        },
        treasuryStock: {
          type: String,
        },
        retainedEarnings: {
          type: String,
        },
        commonStock: {
          type: String,
        },
        commonStockSharesOutstanding: {
          type: String,
        },
      },
    ],

    // quarterlyReports: [{
    //     fiscalDateEnding: {
    //         type: String,
    //     },
    //     reportedCurrency: {
    //         type: String,
    //     },
    //     totalAssets: {
    //         type: String,
    //     },
    //     totalCurrentAssets: {
    //         type: String,
    //     },
    //     cashAndCashEquivalentsAtCarryingValue: {
    //         type: String,
    //     },
    //     cashAndShortTermInvestments: {
    //         type: String,
    //     },
    //     inventory: {
    //         type: String,
    //     },
    //     currentNetReceivables: {
    //         type: String,
    //     },
    //     totalNonCurrentAssets: {
    //         type: String,
    //     },
    //     propertyPlantEquipment: {
    //         type: String,
    //     },
    //     accumulatedDepreciationAmortizationPPE: {
    //         type: String,
    //     },
    //     intangibleAssets: {
    //         type: String,
    //     },
    //     intangibleAssetsExcludingGoodwill: {
    //         type: String,
    //     },
    //     goodwill: {
    //         type: String,
    //     },
    //     investments: {
    //         type: String,
    //     },
    //     longTermInvestments: {
    //         type: String,
    //     },
    //     shortTermInvestments: {
    //         type: String,
    //     },
    //     otherCurrentAssets: {
    //         type: String,
    //     },
    //     otherNonCurrrentAssets: {
    //         type: String,
    //     },
    //     totalLiabilities: {
    //         type: String,
    //     },
    //     totalCurrentLiabilities: {
    //         type: String,
    //     },
    //     currentAccountsPayable: {
    //         type: String,
    //     },
    //     deferredRevenue: {
    //         type: String,
    //     },
    //     currentDebt: {
    //         type: String,
    //     },
    //     shortTermDebt: {
    //         type: String,
    //     },
    //     totalNonCurrentLiabilities: {
    //         type: String,
    //     },
    //     capitalLeaseObligations: {
    //         type: String,
    //     },
    //     longTermDebt: {
    //         type: String,
    //     },
    //     currentLongTermDebt: {
    //         type: String,
    //     },
    //     longTermDebtNoncurrent: {
    //         type: String,
    //     },
    //     shortLongTermDebtTotal: {
    //         type: String,
    //     },
    //     otherCurrentLiabilities: {
    //         type: String,
    //     },
    //     otherNonCurrentLiabilities: {
    //         type: String,
    //     },
    //     totalShareholderEquity: {
    //         type: String,
    //     },
    //     treasuryStock: {
    //         type: String,
    //     },
    //     retainedEarnings: {
    //         type: String,
    //     },
    //     commonStock: {
    //         type: String,
    //     },
    //     commonStockSharesOutstanding: {
    //         type: String,
    //     },
    // }],
  },
  {
    versionKey: false,
  }
);

const BalanceSheet = mongoose.model("BalanceSheet", BalanceSheetSchema);

module.exports = BalanceSheet;
