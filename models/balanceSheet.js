const mongoose = require("mongoose");

const BalanceSheetSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    totalAssets: {
        type: String,
    },
    totalLiabilities: {
        type: String,
    }
}, {
    versionKey: false
});

const BalanceSheet = mongoose.model("BalanceSheet", BalanceSheetSchema);

module.exports = BalanceSheet;