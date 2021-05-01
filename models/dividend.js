const mongoose = require("mongoose");

const DividendSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
    },
    dataPoints: [
      {
        date: {
          type: String,
        },
        div: {
          type: String,
        },
      },
    ],
    date: {
      type: String,
    },
    quota: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const Dividend = mongoose.model("Dividend", DividendSchema);

module.exports = Dividend;
