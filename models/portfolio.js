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
                    //id: Number?
                    //accountId?
                    isin: String,
                    wkn: String,
                    symbol: String,
                    name: String,
                    price: Number,//=marketValue?
                    marketValueCurrency: String,
                    quote: Number,
                    quoteCurrency: String,
                    quoteDate: String,
                    entryQuote: Number,
                    entryQuoteCurrency: String,
                    perf7d: Number,//?
                    perf1y: Number,//?
                    perf7dPercent: Number,//?
                    perf1yPercent: Number,//?
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
            countries: {
                count: Number,
                score: Number,
                warnings: [
                    String
                ]
            },
            segments: {
                count: Number,
                score: Number,
                warnings: [
                    String
                ]
            },
            currency: {
                count: Number,
                score: Number,
                warnings: [
                    String
                ]
            }
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
        dividendPayoutRatio: Number,//?
        totalReturn: Number,
        totalReturnPercent: Number,
        performance: [
            [Number]
        ]
    }
});
//method for analytics


const Portfolio = mongoose.model('Portfolio', portfolioSchema)
//const PortfolioOverview = mongoose.model('PortfolioOverview', portfolioOverviewSchema)

module.exports = Portfolio
//module.exports.portfolioOverview = PortfolioOverview