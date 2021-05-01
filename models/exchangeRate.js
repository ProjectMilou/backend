const mongoose = require("mongoose");

const ExchangeRateSchema = new mongoose.Schema(
  {
    base: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
    },
    rates: [
      {
        GBP: {
          type: String,
        },
        HKD: {
          type: String,
        },
        IDR: {
          type: String,
        },
        ILS: {
          type: String,
        },
        DKK: {
          type: String,
        },
        INR: {
          type: String,
        },
        CHF: {
          type: String,
        },
        MXN: {
          type: String,
        },
        CZK: {
          type: String,
        },
        SGD: {
          type: String,
        },
        THB: {
          type: String,
        },
        HRK: {
          type: String,
        },
        MYR: {
          type: String,
        },
        NOK: {
          type: String,
        },
        CNY: {
          type: String,
        },
        BGN: {
          type: String,
        },
        PHP: {
          type: String,
        },
        SEK: {
          type: String,
        },
        PLN: {
          type: String,
        },
        ZAR: {
          type: String,
        },
        CAD: {
          type: String,
        },
        ISK: {
          type: String,
        },
        BRL: {
          type: String,
        },
        RON: {
          type: String,
        },
        NZD: {
          type: String,
        },
        TRY: {
          type: String,
        },
        JPY: {
          type: String,
        },
        RUB: {
          type: String,
        },
        KRW: {
          type: String,
        },
        USD: {
          type: String,
        },
        HUF: {
          type: String,
        },
        AUD: {
          type: String,
        },
      },
    ],
    date: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const ExchangeRate = mongoose.model("ExchangeRate", ExchangeRateSchema);

module.exports = ExchangeRate;
