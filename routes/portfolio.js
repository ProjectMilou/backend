'use strict';
const express = require('express');
const Portfolio = require('../models/portfolio');
//const PortfolioOverview = PortfolioModels.portfolioOverview
const mongoose = require('mongoose');
const { ResourceGroups } = require('aws-sdk');
const router = express.Router();
router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//var userId ='7066e49a553a5c0447248073'// invalid
var userId = '6066e49a553a5c0447248073'
//var userId = '6066e49a553a5c0000000000'
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
    "qty": 20
}

var pf1 = {
    "id": 0,
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
    "id": 1,
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
    "ptv": 1.00,
    "ptg": 0.85,
    "eps": 99,
    "div": 10
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
    "dividendPayoutRatio": 41
}

//returns all portfolios of current user
router.get('/list', (req, res) => {
    var response = { "portfolios": [] };

    Portfolio.find({ "userId": userId }, 'portfolio.overview', function (err, portf) {
        if (err) {
            response.error = "DATABASE_ERROR"
            response.message = err
            console.log(err)
            res.status(500).json(response);
        } else {
            response.portfolios = portf.map(({ portfolio: { overview: portfOverview } }) => portfOverview)
            res.json(response);
        }
    })
});

router.get('/details/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    Portfolio.findById(id, (err, portf) => {
        if (err) {
            response.error = "DATABASE_ERROR"
            response.message = err
            console.log(err)
            res.status(500).json(response);
        } else if (portf == null || portf.userId != userId) {
            response.error = "PORTFOLIO_ID_INVALID"
            res.status(404).json(response);
        } else {
            response = portf.portfolio;
            res.json(response);

        }
    });

});

// deprecated
// router.get('/modifications/:id', (req, res) => {
//     var id = req.params.id;
//     var response = {};
//     if (id == 0) {
//         response.modifications = [];
//         res.json(response);
//     } else if (id == 1) {
//         response.modifications = [1616086585];
//         res.json(response);
//     } else {
//         response.error = "PORTFOLIO_ID_INVALID"
//         res.status(404).json(response);
//     }
// });

// deprecated
// router.get('/positions/:id/', (req, res) => {
//     // request: {"time" : time}
//     var id = req.params.id;
//     var time = req.body.time;
//     var response = {};
//     if (id == 1 && time == 1) {
//         response.positions = [position]
//         res.json(response);
//     } else if (id != 0 && id != 1) {
//         response.error = "PORTFOLIO_ID_INVALID"
//         res.status(404).json(response);
//     } else {
//         response.error = "TIMESTAMP_INVALID"
//         res.status(404).json(response);
//     }
// });

// was changed from chart 
router.get('/performance/:id', function (req, res) {
    // request: {"range" : range}
    // range can be any of:  "7D", "1M", "6M", "YTD", "1J", "5J", "MAX"
    // I think this should be implemented by the analyzer team
    var id = req.params.id;
    var range = req.body.range;
    var response = {};
    if (id == 1 && range == "7D") {
        response.chart = [0, 1, 2, 3, 4];
        res.json(response);
    } else if (id != 1) {
        response.error = "PORTFOLIO_ID_INVALID";
        res.status(404).json(response);
    } else {
        response.error = "RANGE_INVALID";
        res.status(400).json(response);
    }
});

//creates new portfolio with the given name and gives the id as a response
router.post('/create', (req, res) => {
    // request: {"name" : name}
    //console.log(req.body)
    var name = req.body.name;// undefined?
    var isDuplicate = true
    var response = {}
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        var portfolioId = new mongoose.Types.ObjectId();
        Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                response.error = "DATABASE_ERROR"
                response.message = err
                console.log(err)
                res.status(500).json(response);
            } else if (!result) {
                isDuplicate = false
            }
            var response = {};
            if (isDuplicate) {
                response.error = "PORTFOLIO_NAME_DUPLICATE";
                res.status(400).json(response);
            } else {
                //var testPortfolioOverview = new PortfolioOverview();
                var testPortfolio = new Portfolio({
                    "_id": portfolioId,
                    "userId": userId,
                    "portfolio": {
                        "overview": {
                            "_id": portfolioId,
                            "name": name,
                            "virtual": true,
                            "positionCount": 0,
                            "value": 0,
                            "score": 0,
                            "perf7d": 0,
                            "perf1y": 0,
                            "modified": 0
                        },
                        "positions": [],
                        "risk": {
                            "countries": {
                                "count": 0,
                                "score": 0,
                                "warnings": []
                            },
                            "segments": {
                                "count": 0,
                                "score": 0,
                                "warnings": []
                            },
                            "currency": {
                                "count": 0,
                                "score": 0,
                                "warnings": []
                            }
                        },
                        "keyFigures": [
                            {
                                "year": 0,
                                "pte": 0,
                                "ptb": 0,
                                "ptg": 0,
                                "eps": 0,
                                "div": 0
                            }
                        ],
                        "nextDividend": 0,
                        "dividendPayoutRatio": 0
                    }
                })

                testPortfolio.save(
                    function (err, testPortfolio) {
                        if (err) {
                            response.error = "DATABASE_ERROR"
                            response.message = err
                            console.log(err)
                            res.status(500).json(response);
                        } else {
                            console.log("portfolio saved successfully")


                            response.id = testPortfolio["_id"];
                            res.json(response);
                        }
                    }
                )
            }
        })
    }
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    Portfolio.findOneAndDelete({ "_id": id, "userId": userId }, (err, portf) => {
        if (err) {
            response.error = "DATABASE_ERROR"
            response.message = "error: " + err
            console.log(err)
            res.status(500).json(response);
        } else if (portf == null || portf.userId != userId) {
            response.error = "PORTFOLIO_ID_INVALID"
            res.status(404).json(response);
        } else {
            res.json(response);
        }
    })
});

router.put('/rename/:id', (req, res) => {
    // request: {"name" : name} 
    var id = req.params.id;
    var name = req.body.name;
    var response = {};

    var isDuplicate = true
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        //check if the name already exists
        Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                response.error = "DATABASE_ERROR"
                response.message = err
                console.log(err)
                res.status(500).json(response);
            } else if (!result) {
                isDuplicate = false
            }
            var response = {};
            if (isDuplicate) {
                response.error = "PORTFOLIO_NAME_DUPLICATE";// if this portfolio or another portfolio of the same user already has the given name
                res.status(400).json(response);
            } else {
                //update name
                Portfolio.findOneAndUpdate({ "_id": id, "userId": userId }, { "portfolio.overview.name": name }, (err, portf) => {
                    if (err) {
                        response.error = "DATABASE_ERROR"
                        response.message = "error: " + err
                        console.log(err)
                        res.status(500).json(response);
                    } else if (portf == null || portf.userId != userId) {
                        response.error = "PORTFOLIO_ID_INVALID"
                        res.status(404).json(response);
                    } else {
                        res.json(response);
                    }
                })
            }
        })
    }

});

router.put('/modify/:id', (req, res) => {
    // request: {"modifications": 
    //                  [{"isin": "string",
    //                  "qty": 0}]}
    var id = req.params.id;
    var isin = req.body.isin + "";
    var qty = req.body.qty;
    var response = {};
    if (id != 1 && id != 0) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else if (qty <= 0) {
        response.error = "QTY_INVALID"
        res.status(400).json(response);
    } else if (isin.length != 12) {
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
    var response = {}
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        var portfolioId = new mongoose.Types.ObjectId();
        Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                response.error = "DATABASE_ERROR"
                response.message = err
                console.log(err)
                res.status(500).json(response);
            } else if (!result) {
                isDuplicate = false
            }
            var response = {};
            if (isDuplicate) {
                response.error = "PORTFOLIO_NAME_DUPLICATE";
                res.status(400).json(response);
            } else {
                //var testPortfolioOverview = new PortfolioOverview();
                var portfolio;
                Portfolio.findOne({ "_id": id, "userId": userId }, (err, portf) => {
                    if (err) {
                        response.error = "DATABASE_ERROR"
                        response.message = "error: " + err
                        console.log(err)
                        res.status(500).json(response);
                    } else if (!portf) {
                        response.error = "PORTFOLIO_ID_INVALID"
                        res.status(404).json(response);
                    } else {
                        portf["_id"] = portfolioId
                        portf.portfolio.overview["_id"] = portfolioId
                        portf.portfolio.overview.virtual = true;

                        res.json(response);
                    }
                    var portfolio = new Portfolio(portf)
                    portfolio.save(
                        function (err, portfolio) {
                            if (err) {
                                response.error = "DATABASE_ERROR"
                                response.message = err
                                console.log(err)
                                res.status(500).json(response);
                            } else {
                                console.log("portfolio saved successfully")


                                response.id = portfolio["_id"];
                                res.json(response);
                            }
                        }
                    )
                })


            }
        })
    }
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

// is not in the documentation any more
router.post('/import', (req, res) => {
    res.json({});
});

module.exports = router