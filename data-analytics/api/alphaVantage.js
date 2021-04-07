const axios = require("axios");
const querystring = require("querystring");

// Requires .env file and configures the process environment variables.
require("dotenv").config();

const api = axios.create({
    baseURL: "https://www.alphavantage.co"
});

// Gets the apikey which is in the .env file and is now in the process environment variables
const apikey = process.env.APIKEY || undefined;

if (!apikey) {
    console.log("API KEY MISSING");
    throw new Error("API KEY MISSING");
}

/**
 * Gets the intraday data for a given symbol and time interval from AlphaVantage API directly.
 *
 * @param   {string} symbol   represents the stock name (e.g: "IBM")
 * @param   {string} interval [allowed values: "1min" | "5min" | "15min" | "30min" | "60min"]
 * @returns {object}            JavaScript Object
 */
const getTimeSeriesIntraday = async (symbol, interval) => {
    const TIME_SERIES_INTRADAY_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "TIME_SERIES_INTRADAY",
        interval: interval
    });

    console.log(TIME_SERIES_INTRADAY_QUERY);

    try {
        const res = await api.get(`query?${TIME_SERIES_INTRADAY_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Gets the daily data for a given symbol from the AlphaVantage API directly.
 *
 * @param   {string} symbol represents stock name (e.g: "IBM")
 * @returns {object}        JavaScript Object
 */
const getTimeSeriesDaily = async (symbol) => {
    const TIME_SERIES_DAILY_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "TIME_SERIES_DAILY",
        outputsize: "full"
    });

    console.log(TIME_SERIES_DAILY_QUERY);

    try {
        const res = await api.get(`query?${TIME_SERIES_DAILY_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Gets the weekly data for a given symbol from the AlphaVantage API directly.
 *
 * @param   {string} symbol represents stock name (e.g: "IBM")
 * @returns {object}        JavaScript Object
 */
const getTimeSeriesWeekly = async (symbol) => {
    const TIME_SERIES_WEEKLY_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "TIME_SERIES_WEEKLY"
    });

    console.log(TIME_SERIES_WEEKLY_QUERY);

    try {
        const res = await api.get(`query?${TIME_SERIES_WEEKLY_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Gets the monthly data for a given symbol from the AlphaVantage API directly.
 *
 * @param   {string} symbol represents stock name (e.g: "IBM")
 * @returns {object}        JavaScript Object
 */
const getTimeSeriesMonthly = async (symbol) => {
    const TIME_SERIES_MONTHLY_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "TIME_SERIES_MONTHLY"
    });

    console.log(TIME_SERIES_MONTHLY_QUERY);

    try {
        const res = await api.get(`query?${TIME_SERIES_MONTHLY_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 *  Gets the company information, financial ratios, and other key
 *  metrics from the AlphaVantage API.
 *
 * @param {string} symbol represents the stock name (e.g: "IBM")
 * @returns {object}      A lot of useful information.
 * Can be used for Diversification among currency, country,
 * sector and industry(All of this data is included in the response).
 * Can be used for the performance measurements of a Portfolio -
 * the response includes PERatio(Price-Earning Ratio) and DividendYield
 */
const getCompanyOverview = async (symbol) => {
    const COMPANY_OVERVIEW_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "OVERVIEW"
    });

    console.log(COMPANY_OVERVIEW_QUERY);

    try {
        const res = await api.get(`query?${COMPANY_OVERVIEW_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Looks for specific symbols or companies. Can be used for looking up
 * the exact symbol name of a stock of a company.
 *
 * @param {string} keyword represents the query string (e.g "Tesla")
 * @returns {object} This function returns an object, which has an
 * array of best matches. These best matches are the stock symbols
 * which best match the search keyword. (e.g for keyword="Tesla"
 * we receive a match score of 1.000 for symbol="TLO.DEX")
 */
const getSymbolForKeyword = async (keyword) => {
    const SYMBOL_SEARCH_QUERY = querystring.stringify({
        apikey: apikey,
        keywords: keyword,
        function: "SYMBOL_SEARCH"
    });

    console.log(SYMBOL_SEARCH_QUERY);

    try {
        const res = await api.get(`query?${SYMBOL_SEARCH_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Gets the balance sheet of a symbol from the AlphaVantage API
 * 
 * @param {string} symbol represents the query string (e.g "Tesla")
 * @returns This function returns the annual and quarterly balance sheets 
 * for the company of interest. Data is generally refreshed on the same day
 * a company reports its latest earnings and financials.
 */
const getBalanceSheetForSymbol = async (symbol) => {
    const BALANCE_SHEET_QUERY = querystring.stringify({
        apikey: apikey,
        symbol: symbol,
        function: "BALANCE_SHEET"
    });

    console.log(BALANCE_SHEET_QUERY);

    try {
        const res = await api.get(`query?${BALANCE_SHEET_QUERY}`);
        return res.data;
    } catch (err) {
        throw new Error(err);
    }
}

exports.getTimeSeriesIntraday = getTimeSeriesIntraday;
exports.getTimeSeriesDaily = getTimeSeriesDaily;
exports.getTimeSeriesWeekly = getTimeSeriesWeekly;
exports.getTimeSeriesMonthly = getTimeSeriesMonthly;
exports.getCompanyOverview = getCompanyOverview;
exports.getSymbolForKeyword = getSymbolForKeyword;
exports.getBalanceSheetForSymbol = getBalanceSheetForSymbol;
