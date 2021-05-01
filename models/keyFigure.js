const mongoose = require("mongoose");

const KeyFigureSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
    },
    keyFigures: [
      {
        fiscalDateEnding: {
          type: String,
        },
        reportedDate: {
          type: String,
        },
        reportedEPS: {
          type: String,
        },
        estimatedEPS: {
          type: String,
        },
        surprise: {
          type: String,
        },
        surprisePercentage: {
          type: String,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const KeyFigure = mongoose.model("KeyFigure", KeyFigureSchema);

module.exports = KeyFigure;
