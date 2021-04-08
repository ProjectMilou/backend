'use strict';
const express = require('express');
const router = express.Router();
const stockModel = require("../models/stock");

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

module.exports = router