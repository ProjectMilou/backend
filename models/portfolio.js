const mongoose = require('mongoose')

const portfolioOverviewSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    virtual: Boolean,
    positionCount: Number,
    value: Number,
    displayedCurrency: String,
    score: Number,
    perf7d: Number,
    perf1y: Number,
    perf7dPercent: Number,
    perf1yPercent: Number,
    modified: Number
});

const portfolioSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    bankAccountId: String,
    portfolio: {
        overview: portfolioOverviewSchema,
        positions: [{
            stock: {
                isin: String,
                wkn: String,
                symbol: String,
                name: String,
                price: Number,
                marketValueCurrency: String,
                displayedCurrency: String,
                quote: Number,
                quoteCurrency: String,
                quoteDate: String,
                entryQuote: Number,
                entryQuoteCurrency: String,
                perf7d: Number,
                perf1y: Number,
                perf7dPercent: Number,
                perf1yPercent: Number,
                volatility: Number,
                debtEquity: Number,
                country: String,
                industry: String,
                score: Number,
                missingData: Boolean
            },
            qty: Number,
            quantityNominalType: String,
            totalReturn: Number, //=profitOrLoss?
            totalReturnPercent: Number
        }],
        risk: {
            countries: {}, //any type can be in here
            segments: {},
            currency: {},
        },
        keyFigures: [ 
            {
                year: String,
                pte: Number,
                ptb: Number,
                ptg: Number,
                eps: Number,
                div: Number,
                dividendPayoutRatio: Number
            }
        ],
        nextDividend: Number,
        totalReturn: Number,
        totalReturnPercent: Number,
        analytics: {
            volatility: Number,
            standardDeviation: Number,
            sharpeRatio: Number,
            treynorRatio: Number,
            debtEquity: Number,
            correlations: {}
        },
        performance: [
                [Number]
            ]
            //DE000BASF111
    }
});


const Portfolio = mongoose.model('Portfolio', portfolioSchema)

module.exports = Portfolio