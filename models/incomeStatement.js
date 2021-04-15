const mongoose = require("mongoose");

const IncomeStatementSchema = new mongoose.Schema({
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
        grossProfit: {
            type: String,
        },
        totalRevenue: {
            type: String,
        },
        costOfRevenue: {
            type: String,
        },
        costofGoodsAndServicesSold: {
            type: String,
        },
        operatingIncome: {
            type: String,
        },
        sellingGeneralAndAdministrative: {
            type: String,
        },
        researchAndDevelopment: {
            type: String,
        },
        operatingExpenses: {
            type: String,
        },
        investmentIncomeNet: {
            type: String,
        },
        netInterestIncome: {
            type: String,
        },
        interestIncome: {
            type: String,
        },
        interestExpense: {
            type: String,
        },
        nonInterestIncome: {
            type: String,
        },
        otherNonOperatingIncome: {
            type: String,
        },
        depreciation: {
            type: String,
        },
        depreciationAndAmortization: {
            type: String,
        },
        incomeBeforeTax: {
            type: String,
        },
        incomeTaxExpense: {
            type: String,
        },
        interestAndDebtExpense: {
            type: String,
        },
        netIncomeFromContinuingOperations: {
            type: String,
        },
        comprehensiveIncomeNetOfTax: {
            type: String,
        },
        ebit: {
            type: String,
        },
        ebitda: {
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
        grossProfit: {
            type: String,
        },
        totalRevenue: {
            type: String,
        },
        costOfRevenue: {
            type: String,
        },
        costofGoodsAndServicesSold: {
            type: String,
        },
        operatingIncome: {
            type: String,
        },
        sellingGeneralAndAdministrative: {
            type: String,
        },
        researchAndDevelopment: {
            type: String,
        },
        operatingExpenses: {
            type: String,
        },
        investmentIncomeNet: {
            type: String,
        },
        netInterestIncome: {
            type: String,
        },
        interestIncome: {
            type: String,
        },
        interestExpense: {
            type: String,
        },
        nonInterestIncome: {
            type: String,
        },
        otherNonOperatingIncome: {
            type: String,
        },
        depreciation: {
            type: String,
        },
        depreciationAndAmortization: {
            type: String,
        },
        incomeBeforeTax: {
            type: String,
        },
        incomeTaxExpense: {
            type: String,
        },
        interestAndDebtExpense: {
            type: String,
        },
        netIncomeFromContinuingOperations: {
            type: String,
        },
        comprehensiveIncomeNetOfTax: {
            type: String,
        },
        ebit: {
            type: String,
        },
        ebitda: {
            type: String,
        },
        netIncome: {
            type: String,
        },
    }],
}, {
    versionKey: false
});

const IncomeStatement = mongoose.model("IncomeStatement", IncomeStatementSchema);

module.exports = IncomeStatement;