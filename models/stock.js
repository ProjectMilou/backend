const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    isin: {
        type: String,
        index: true,
        trim: true,
    },
    wkn: {
        type: String,
        index: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
    },
    per1d: {
        type: String,
    },
    per7d: {
        type: String,
    },
    per30d: {
        type: String,
    },
    per365d: {
        type: String,
    },
    marketCapitalization: {
        type: String,
    },
    analystTargetPrice: {
        type: String,
    },
    valuation: {
        type: String,
    },
    growth: {
        type: String,
    },
    div: {
        type: String,
    },
    currency: {
        type: String,
    },
    country: {
        type: String,
    },
    industry: {
        type: String,
    },
    picture: {
        type: String,
    },
    date: {
        type: String,
    },
    intro: {
        type: String,
    },
    founded: {
        type: String,
    },
    employees: {
        type: String,
    },
    website: {
        type: String,
    },
    address: {
        type: String,
    },
    assembly: {
        type: String,
    },
    assetType: {
        type: String,
    },
    peRatio: {
        type: String,
    },
    cik: {
        type: String,
    },
    exchange: {
        type: String,
    },
    fiscalYearEnd: {
        type: String,
    },
    latestQuarter: {
        type: String,
    },
    ebitda: {
        type: String,
    },
    pegRatio: {
        type: String,
    },
    bookValue: {
        type: String,
    },
    dividendPerShare: {
        type: String,
    },
    eps: {
        type: String,
    },
    revenuePerShareTTM: {
        type: String,
    },
    profitMargin: {
        type: String,
    },
    operatingMarginTTMprofitMargin: {
        type: String,
    },
    returnOnAssetsTTM: {
        type: String,
    },
    returnOnEquityTTM: {
        type: String,
    },
    revenueTTM: {
        type: String,
    },
    grossProfitTTM: {
        type: String,
    },
    dilutedEPSTTM: {
        type: String,
    },
    quarterlyEarningsGrowthYOY: {
        type: String,
    },
    quarterlyRevenueGrowthYOY: {
        type: String,
    },
    analystTargetPrice: {
        type: String,
    },
    trailingPE: {
        type: String,
    },
    forwardPE: {
        type: String,
    },
    priceToSalesRatioTTM: {
        type: String,
    },
    priceToBookRatio: {
        type: String,
    },
    evToRevenue: {
        type: String,
    },
    evToEbitda: {
        type: String,
    },
    beta: {
        type: String,
    },
    per52WeekHigh: {
        type: String,
    },
    per52WeekLow: {
        type: String,
    },
    per50DayMovingAverage: {
        type: String,
    },
    per200DayMovingAverage: {
        type: String,
    },
    sharesOutstanding: {
        type: String,
    },
    sharesFloat: {
        type: String,
    },
    sharesShort: {
        type: String,
    },
    sharesShortPriorMonth: {
        type: String,
    },
    shortRatio: {
        type: String,
    },
    shortPercentOutstanding: {
        type: String,
    },
    shortPercentFloat: {
        type: String,
    },
    percentInsiders: {
        type: String,
    },
    percentInstitutions: {
        type: String,
    },
    forwardAnnualDividendRate: {
        type: String,
    },
    forwardAnnualDividendYield: {
        type: String,
    },
    payoutRatio: {
        type: String,
    },
    dividendDate: {
        type: String,
    },
    exDividendDate: {
        type: String,
    },
    lastSplitFactor: {
        type: String,
    },
    lastSplitDate: {
        type: String,
    },
    mcSize: {
        type: String,
    }
}, {
    versionKey: false
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;