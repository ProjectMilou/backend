const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    ISIN: {
        type: String,
        index: true,
        trim: true,
    },
    WKN: {
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
    _1d: {
        type: String,
    },
    _7d: {
        type: String,
    },
    _30d: {
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
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;