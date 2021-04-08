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
    }
}, {
    versionKey: false
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;