'use strict';
const express = require('express');
const router = express.Router();
const stockModel = require("../models/stock");
const dataPointModel = require('../models/dataPoint');

router.get('/overview', async (req, res) => {
    let response;
    let isError = false;

    let symbol = req.query.id;
    const stock = await stockModel.find({ "symbol": symbol }, {
        _id: false,
        founded: false,
        intro: false,
        employees: false,
        website: false,
        assembly: false,
        address: false,
    });
    res.json({ "stocks": stock });
});

router.get('/details', async (req, res) => {
    let response;
    let isError = false;

    let symbol = req.query.id;
    const stock = await stockModel.find({ "symbol": symbol }, {
        symbol: true,
        intro: true,
        founded: true,
        website: true,
        employees: true,
        address: true,
        assembly: true,
    });
    res.json({ "stocks": stock });
});

router.get('/charts/historic', async (req, res) => {
    let symbol = req.query.id;
    let maxParam = req.query.max;
    let dataPoints;
    if (maxParam === 'false') {
        dataPoints = await dataPointModel.find({ "symbol": symbol }, {
            symbol: false,
            _id: false
        });
        dataPoints = { "dataPoints": dataPoints[0]["dataPoints"].slice(0, 1260) };
    } else {
        dataPoints = await dataPointModel.find({ "symbol": symbol }, {
            symbol: false,
            _id: false
        });
        dataPoints = dataPoints[0]
    }

    if (dataPoints) {
        res.json(dataPoints);
    } else {
        res.json({ "error": "STOCK_ID_INVALID" })
    }

});

module.exports = router