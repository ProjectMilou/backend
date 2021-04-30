const mongoose = require("mongoose");

const DataPointSchema = new mongoose.Schema(
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
          type: Date,
        },
        close: {
          type: String,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const DataPoint = mongoose.model("DataPoint", DataPointSchema);

module.exports = DataPoint;
