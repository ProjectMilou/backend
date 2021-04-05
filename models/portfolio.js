const mongoose = require('mongoose')

const portfolioOverviewSchema = new mongoose.Schema({
    id: mongoose.ObjectId,//TODO change _id to id in code
    name: String,
    virtual: Boolean,
    positionCount: Number,
    value: Number,
    score: Number,//?
    perf7d: Number,//?
    perf1y: Number,//?
    modified: Number
});

const portfolioSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    portfolio: {
        overview: portfolioOverviewSchema,
        positions: [
            {
                stock: {
                    //id: Number?
                    //accountId?
                    isin: String,
                    //wkn?
                    symbol: String,
                    name: String,
                    price: Number,//=marketValue?
                    marketValueCurrency:String,
                    quote:Number,
                    quoteCurrency:String,
                    quoteDate: String,
                    entryQuote:Number,
                    entryQuoteCurrency: Number,
                    perf7d: Number,//?
                    perf1y: Number,//?
                    country: String,
                    industry: String,
                    score: Number//?
                },
                qty: Number,// = quantityNominal?
                quantityNominalType:String,
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
        totalReturnPercent: Number
    }
});
//method for analytics


const Portfolio = mongoose.model('Portfolio', portfolioSchema)
//const PortfolioOverview = mongoose.model('PortfolioOverview', portfolioOverviewSchema)

module.exports = Portfolio
//module.exports.portfolioOverview = PortfolioOverview