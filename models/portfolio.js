const mongoose = require('mongoose')

const portfolioOverviewSchema = new mongoose.Schema({
    name: String,
    virtual: Boolean,
    positionCount: Number,
    value: Number,
    score: Number,
    perf7d: Number,
    perf1y: Number,
    modified: Number
});

const portfolioSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    portfolio: {
        overview: portfolioOverviewSchema,
        positions: [
            {
                stock: {
                    isin: String,
                    symbol: String,
                    name: String,
                    price: Number,
                    perf7d: Number,
                    perf1y: Number,
                    country: String,
                    industry: String,
                    score: Number
                },
                qty: Number,
                totalReturn: Number,
                totalReturnPercent: Number
            }
        ],
        risk: {
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
        keyFigures: [
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
        nextDividend: Number,
        dividendPayoutRatio: Number,
        totalReturn: Number,
        totalReturnPercent: Number
    }
});



const Portfolio = mongoose.model('Portfolio', portfolioSchema)
//const PortfolioOverview = mongoose.model('PortfolioOverview', portfolioOverviewSchema)

module.exports = Portfolio
//module.exports.portfolioOverview = PortfolioOverview