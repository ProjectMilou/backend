const mongoose = require("mongoose");

const CashFlowSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    annualReports: [{
        fiscalDateEnding: {
            type: String,
        },
        reportedCurrency: {
            type: String,
        },
        operatingCashflow: {
            type: String,
        },
        paymentsForOperatingActivities: {
            type: String,
        },
        proceedsFromOperatingActivities: {
            type: String,
        },
        changeInOperatingLiabilities: {
            type: String,
        },
        changeInOperatingAssets: {
            type: String,
        },
        depreciationDepletionAndAmortization: {
            type: String,
        },
        capitalExpenditures: {
            type: String,
        },
        changeInReceivables: {
            type: String,
        },
        changeInInventory: {
            type: String,
        },
        profitLoss: {
            type: String,
        },
        cashflowFromInvestment: {
            type: String,
        },
        cashflowFromFinancing: {
            type: String,
        },
        proceedsFromRepaymentsOfShortTermDebt: {
            type: String,
        },
        paymentsForRepurchaseOfCommonStock: {
            type: String,
        },
        paymentsForRepurchaseOfEquity: {
            type: String,
        },
        paymentsForRepurchaseOfPreferredStock: {
            type: String,
        },
        dividendPayout: {
            type: String,
        },
        dividendPayoutCommonStock: {
            type: String,
        },
        dividendPayoutPreferredStock: {
            type: String,
        },
        proceedsFromIssuanceOfCommonStock: {
            type: String,
        },
        proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: {
            type: String,
        },
        proceedsFromIssuanceOfPreferredStock: {
            type: String,
        },
        proceedsFromRepurchaseOfEquity: {
            type: String,
        },
        proceedsFromSaleOfTreasuryStock: {
            type: String,
        },
        changeInCashAndCashEquivalents: {
            type: String,
        },
        changeInExchangeRate: {
            type: String,
        },
        netIncome: {
            type: String,
        },
    }],

    quarterlyReports: [{
        fiscalDateEnding: {
            type: String,
        },
        reportedCurrency: {
            type: String,
        },
        operatingCashflow: {
            type: String,
        },
        paymentsForOperatingActivities: {
            type: String,
        },
        proceedsFromOperatingActivities: {
            type: String,
        },
        changeInOperatingLiabilities: {
            type: String,
        },
        changeInOperatingAssets: {
            type: String,
        },
        depreciationDepletionAndAmortization: {
            type: String,
        },
        capitalExpenditures: {
            type: String,
        },
        changeInReceivables: {
            type: String,
        },
        changeInInventory: {
            type: String,
        },
        profitLoss: {
            type: String,
        },
        cashflowFromInvestment: {
            type: String,
        },
        cashflowFromFinancing: {
            type: String,
        },
        proceedsFromRepaymentsOfShortTermDebt: {
            type: String,
        },
        paymentsForRepurchaseOfCommonStock: {
            type: String,
        },
        paymentsForRepurchaseOfEquity: {
            type: String,
        },
        paymentsForRepurchaseOfPreferredStock: {
            type: String,
        },
        dividendPayout: {
            type: String,
        },
        dividendPayoutCommonStock: {
            type: String,
        },
        dividendPayoutPreferredStock: {
            type: String,
        },
        proceedsFromIssuanceOfCommonStock: {
            type: String,
        },
        proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: {
            type: String,
        },
        proceedsFromIssuanceOfPreferredStock: {
            type: String,
        },
        proceedsFromRepurchaseOfEquity: {
            type: String,
        },
        proceedsFromSaleOfTreasuryStock: {
            type: String,
        },
        changeInCashAndCashEquivalents: {
            type: String,
        },
        changeInExchangeRate: {
            type: String,
        },
        netIncome: {
            type: String,
        },
    }],
}, {
    versionKey: false
});

const CashFlow = mongoose.model("CashFlow", CashFlowSchema);

module.exports = CashFlow;