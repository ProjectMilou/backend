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
                isin: String,//finAPI
                wkn: String,//finAPI
                symbol: String,//finHub?
                name: String,//finAPI
                price: Number, //finAPI
                marketValueCurrency: String,//finAPI
                displayedCurrency: String,
                quote: Number,//finAPI
                quoteCurrency: String,//finAPI
                quoteDate: String,//finAPI
                entryQuote: Number,//finAPI
                entryQuoteCurrency: String,//finAPI
                perf7d: Number,
                perf1y: Number,
                perf7dPercent: Number,
                perf1yPercent: Number,
                volatility: Number,
                debtEquity: Number,
                country: String,
                industry: String,
                score: Number
            },
            qty: Number,//finAPI
            quantityNominalType: String,//finAPI
            totalReturn: Number, //=profitOrLoss?//finAPI
            totalReturnPercent: Number
        }],
        risk: {
            countries: {}, //any type can be in here
            segments: {},
            currency: {},
        },
        keyFigures: [ //no data
            {
                year: Number,
                pte: Number,
                ptb: Number,
                ptg: Number,
                eps: Number,
                div: Number,
                dividendPayoutRatio: Number
            }
        ],
        nextDividend: Number, //no data, maybe Alpha Vantage
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