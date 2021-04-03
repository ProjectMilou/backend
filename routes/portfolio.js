'use strict';
const express = require('express');
const router = express.Router();
router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var stock = {
    "isin": "US36467W1099",
    "symbol": "GME",
    "name": "GameStop",
    "price": 173.25,
    "perf7d": 15.87,
    "perf1y": 19.50,
    "country": "USA",
    "industry": "don't know",
    "score": 0
}
var position = {
    "stock": stock,
    "qty": 20,
    "totalReturn": 0,
    "totalReturnPercent": 0
}

var portfolioStock = {
    "id": "1",
    "name": "pfName",
    "qty": 10
}

var pf1 = {
    "id": "0",
    "name": "test1",
    "virtual": true,
    "positionCount": 0,
    "value": 0,
    "score": 0,
    "perf7d": 14.75,
    "perf1y": 17.15,
    "modified": 0
};
var pf2 = {
    "id": "1",
    "name": "test2",
    "virtual": true,
    "positionCount": 1,
    "value": 3465,
    "score": 1,
    "perf7d": 18.75,
    "perf1y": 16.15,
    "modified": 1616086585
};

var risk1 = {
    "count": 4,
    "score": 0,
    "warnings": ["warning1", "warning2"]
}

var keyFigures = {
    "year": 2021,
    "pte": 15.00,
    "ptb": 1.00,
    "ptg": 0.85,
    "eps": 99,
    "div": 10,
    "dividendPayoutRatio": 2.3
}

var riskAnalysis = {
    "countries": risk1,
    "segments": risk1,
    "currency": risk1
}

var pf1details = {
    "overview": pf1,
    "positions": [position],
    "risk": riskAnalysis,
    "keyFigures": [keyFigures],
    "nextDividend": 1616086585,
    "dividendPayoutRatio": 41,
    "totalReturn": 0,
    "totalReturnPercent": 0
}

router.get('/list', (req, res) => {
    var response = { "portfolios": [pf1, pf2] };
    res.json(response);
});

router.get('/details/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id == "0") {
        res.json(response);
    } else if (id == "1") {
        response = pf1details
        res.json(response);
    } else {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    }
});

// deprecated
router.get('/modifications/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id == "0") {
        response.modifications = [];
        res.json(response);
    } else if (id == "1") {
        response.modifications = [positionQty];
        res.json(response);
    } else {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    }
});

// deprecated
router.get('/positions/:id/', (req, res) => {
    // request: {"time" : time}
    var id = req.params.id;
    var time = req.body.time;
    var response = {};
    if (id == "1" && time == 1) {
        response.positions = [position]
        res.json(response);
    } else if (id != "0" && id != "1") {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        response.error = "TIMESTAMP_INVALID"
        res.status(404).json(response);
    }
});

// was changed from chart 
router.get('/performance/:id', (req, res) => {
    // request: {"range" : range}
    // range can be any of:  "7D", "1M", "6M", "YTD", "1J", "5J", "MAX"
    // I think this should be implemented by the analyzer team
    var id = req.params.id;
    var range = req.body.range;
    var response = {};
    if (id == "1" && range == "7D") {
        response.chart = [
            [1327359600000, 0],
            [1327359700000, 1],
            [1327359800000, 2]
        ];
        res.json(response);
    } else if (id != "1") {
        response.error = "PORTFOLIO_ID_INVALID";
        res.status(404).json(response);
    } else {
        response.error = "RANGE_INVALID";
        res.status(400).json(response);
    }
});

router.get('/stock', (req, res) => {
    var isin = req.body.isin + "";
    var response = {};
    if (isin.replace("-", "").length != 12) {
        response.error = "ISIN_INVALID";
        console.log(isin.replace("-", ""));
        res.status(400).json(response);
    } else {
        response.portfolios = [portfolioStock];
        res.json(response);
    }
});


router.post('/create', (req, res) => {
    // request: {"name" : name}
    var name = req.body.name;
    var response = {};
    if (name == "test1" || name == "test2") {
        response.error = "PORTFOLIO_NAME_DUPLICATE";
        res.status(400).json(response);
    } else if (name == "") {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        response.id = "2";
        res.json(response);
    }
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id != "0" && id != "1") {
        response.error = "PORTFOLIO_NOT_EXISTS"
        res.status(400).json(response);
    } else {
        res.json(response);
    }

});

router.put('/rename/:id', (req, res) => {
    // request: {"name" : name} 
    var id = req.params.id;
    var name = req.body.name;
    var response = {};
    if (id != "1" && id != "0") {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (name == "test1" || name == "test2") {
        response.error = "PORTFOLIO_NAME_DUPLICATE";
        res.status(400).json(response);
    } else if (name == "") {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        res.json(response);
    }

});

router.put('/modify/:id', (req, res) => {
    // request: {"modifications": 
    //                  [{"isin": "string",
    //                  "qty": 0}]}
    var id = req.params.id;
    var response = {};
    if (id != "1" && id != "0") {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (qty <= 0) {
        response.error = "QTY_INVALID"
        res.status(400).json(response);
    } else if (isin.replace("-", "").length != 12) {
        response.error = "ISIN_INVALID"
        res.status(400).json(response);
    } else {
        res.json(response);
    }

});

router.put('/stock', (req, res) => {
    // request: {"modifications": 
    //                  [{"isin": "string",
    //                  "qty": 0}]}
    var isin = req.body.isin;
    var response = {};
    if (isin.replace("-", "").length != 12) {
        response.error = "ISIN_INVALID"
        res.status(400).json(response);
    } else {
        res.json(response);
    }
});

router.post('/duplicate/:id', (req, res) => {
    // request: {"name" : name} 
    var id = req.params.id;
    var name = req.body.name;
    var response = {};
    if (id != "1" && id != "0") {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (name == "test1" || name == "test2") {
        response.error = "PORTFOLIO_NAME_DUPLICATE";
        res.status(400).json(response);
    } else if (name == "") {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        response.id = "2";
        res.json(response);
    }

});

// is not in the documentation any more
router.post('/import', (req, res) => {
    res.json({});
});

module.exports = router