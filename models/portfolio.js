const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');

const encKey = process.env.encryption_32byte_base64;
const sigKey = process.env.encryption_64byte_base64;

const portfolioOverviewSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    virtual: Boolean,
    positionCount: Number,
    value: Number,
    score: Number,
    perf7d: Number,
    perf1y: Number,
    perf7dPercent: Number,
    perf1yPercent: Number,
    modified: Number
});

portfolioOverviewSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

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
                price: Number, //=marketValue!
                marketValueCurrency: String,
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
                score: Number
            },
            qty: Number, // = quantityNominal?
            quantityNominalType: String,
            totalReturn: Number, //=profitOrLoss?
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

portfolioSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });


const Portfolio = mongoose.model('Portfolio', portfolioSchema)

module.exports = Portfolio