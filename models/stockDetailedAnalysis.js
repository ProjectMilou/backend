const mongoose = require("mongoose");

const StockDetailedAnalysisSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    averageGoal: {
      type: String,
    },
    rating: [
      {
        date: {
          type: String,
        },
        goal: {
          type: String,
        },
        strategy: {
          type: String,
        },
        source: {
          type: String,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const StockDetailedAnalysis = mongoose.model(
  "StockDetailedAnalysis",
  StockDetailedAnalysisSchema
);

module.exports = StockDetailedAnalysis;
