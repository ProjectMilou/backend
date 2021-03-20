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
    "country": "USA",
    "industry": "don't know"
}
var position = {
    "stock": stock,
    "qty": 20
}

// todo implement all routes under 'portfolio/...' like in user the way your front end team has specified them in the contract definition
// todo fill in mocks

router.get('/list', (req, res) => {
    var pf1 = {
        "id": 0,
        "name": "test1",
        "virtual": true,
        "positionCount": 0,
        "value": 0,
        "score": 0,
        "modified": 0
    };
    var pf2 = {
        "id": 1,
        "name": "test2",
        "virtual": true,
        "positionCount": 1,
        "value": 3465,
        "score": 1,
        "modified": 1616086585
    };

    var response = { "portfolios": [pf1, pf2] };
    res.json(response);
});

router.get('/details/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id == 0) {
        response.positions = [];
        res.json(response);
    } else if (id == 1) {
        response.positions = [position]
        res.json(response);
    } else {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    }
});

router.get('/modifications/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id == 0) {
        response.modifications = [];
        res.json(response);
    } else if (id == 1) {
        response.modifications = [1616086585];
        res.json(response);
    } else {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    }
});

router.get('/positions/:id/', (req, res) => {
    // request: {"time" : time}
    var id = req.params.id;
    var time = req.body.time;
    var response = {};
    if (id == 1 && time == 1) {
        response.positions = [position]
        res.json(response);
    } else if (id != 0 && id != 1) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        response.error = "TIMESTAMP_INVALID"
        res.status(404).json(response);
    }
});

router.get('/chart/:id', (req, res) => {
    // request: {?} 
    // I think this should be implemented by the analyzer team
    var id = req.params.id;
    var response = {};
    if (id == 0) {
        response.chart = []
        res.json(response);
    } else if (id == 1) {
        response.chart = [0, 1, 2, 3, 4];
        res.json(response);
    } else {
        response.error = "PORTFOLIO_ID_INVALID";
        res.status(404).json(response);
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
        response.id = 2;
        res.json(response);
    }


});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (id != 0 && id != 1) {
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
    if (id != 1 && id != 0) {
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
    // request: {"isin" : isin,
    //            "qty": qty} 
    var id = req.params.id;
    var isin = req.body.isin;
    var qty = req.body.qty;
    var response = {};
    if (id != 1 && id != 0) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (qty <= 0) {
        response.error = "QTY_INVALID"
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
    if (id != 1 && id != 0) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (name == "test1" || name == "test2") {
        response.error = "PORTFOLIO_NAME_DUPLICATE";
        res.status(400).json(response);
    } else if (name == "") {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        response.id = 2;
        res.json(response);
    }

});

router.post('/import', (req, res) => {
    res.json({});
});

module.exports = router