const mongoose = require('mongoose')

const portfolioOverviewSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    virtual: Boolean,
    positionCount: Number,
    value: Number,
    score: Number,//?
    perf7d: Number,//?
    perf1y: Number,//?
    perf7dPercent: Number,//?
    perf1yPercent: Number,//?
    modified: Number
});

const portfolioSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    userId: mongoose.ObjectId,//String!
    portfolio: {
        overview: portfolioOverviewSchema,
        positions: [
            {
                stock: {
                    isin: String,
                    wkn: String,
                    symbol: String,
                    name: String,
                    price: Number,//=marketValue!
                    marketValueCurrency: String,
                    quote: Number,//??
                    quoteCurrency: String,//??
                    quoteDate: String,//??
                    entryQuote: Number,//only makes sense in real ones I guess
                    entryQuoteCurrency: String,//same
                    perf7d: Number,
                    perf1y: Number,
                    perf7dPercent: Number,
                    perf1yPercent: Number,
                    volatility: Number,
                    debtEquity: Number,
                    country: String,
                    industry: String,
                    score: Number//? -> finnHub reccomendation trends, for 10 biggest position, average of score multiplied with value, sum divided with total amount of reccomendations
                },
                qty: Number,// = quantityNominal?
                quantityNominalType: String,
                totalReturn: Number, //=profitOrLoss?
                totalReturnPercent: Number//=?
            }
        ],
        risk: {//?
            countries: {},//any type can be in here
            segments: {},
            currency: {},
        },
        keyFigures: [//no data
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
        nextDividend: Number,//no data, maybe Alpha Vantage
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
        performance: [// cron scheduler time as parameter how often should it work
            [Number]
        ]
        //DE000BASF111
    }
});


const Portfolio = mongoose.model('Portfolio', portfolioSchema)
//const PortfolioOverview = mongoose.model('PortfolioOverview', portfolioOverviewSchema)

module.exports = Portfolio
//module.exports.portfolioOverview = PortfolioOverview