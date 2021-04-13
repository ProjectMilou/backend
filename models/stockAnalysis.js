const mongoose = require("mongoose");

const StockAnalysisSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    buy: {
        type: String,
    },
    hold: {
        type: String,
    },
    sell: {
        type: String,
    },
    date: {
        type: String,
    },
    strategy: {
        type: String,
    },
    source: {
        type: String,
    },
    averageGoal: {
        type: String,
    }
}, {
    versionKey: false
});

const StockAnalysis = mongoose.model("StockAnalysis", StockAnalysisSchema);

module.exports = StockAnalysis;