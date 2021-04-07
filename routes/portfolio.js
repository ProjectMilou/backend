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

const fetch = require('node-fetch');
const cors = require('cors');
// const passport = require('passport');

router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(cors({
    exposedHeaders: ['Location'],
}));


const handle_database_error = (res, err) => {
    var response = {}
    response.error = "DATABASE_ERROR"
    response.message = "" + err
    console.log(err)
    res.status(500).json(response);
}

const stockMock1 = {
    stock: {
        //id: Number?
        //accountId?
        isin: "DE000A1PG979",
        wkn: "A1PG97",
        symbol: "AEE",
        name: "Ameren Corporation",
        price: 83.84, //=marketValue?
        marketValueCurrency: "USD",
        quote: 81.13,
        quoteCurrency: "USD",
        quoteDate: "Mon Apr 05 2021 17:55:14 GMT+0300 (GMT+03:00)",
        entryQuote: 66.98,
        entryQuoteCurrency: "USD",
        perf7d: 0.993, //?
        perf1y: 1.032, //?
        country: "USA",
        industry: "Utilities-Regulated Electric",
        score: 0 //? -> finnHub reccomendation trends, for 10 biggest position, average of score multiplied with value, sum divided with total amount of reccomendations
    },
    qty: 2, // = quantityNominal?
    quantityNominalType: "UNIT",
    totalReturn: 10, //=profitOrLoss?
    totalReturnPercent: 5 //=?
}

const stockMock2 = {
    stock: {
        //id: Number?
        //accountId?
        isin: "?",
        wkn: "?",
        symbol: "CCI",
        name: "Crown Castle International Corp. (REIT)",
        price: 175.26, //=marketValue?
        marketValueCurrency: "EUR",
        quote: 176.69,
        quoteCurrency: "EUR",
        quoteDate: "Mon Apr 05 2021 17:57:32 GMT+0300 (GMT+03:00)",
        entryQuote: 74.2383,
        entryQuoteCurrency: "EUR",
        perf7d: 1.042, //?
        perf1y: 1.081, //?
        country: "USA",
        industry: "REIT-Specialty",
        score: 0 //? -> finnHub reccomendation trends, for 10 biggest position, average of score multiplied with value, sum divided with total amount of reccomendations
    },
    qty: 20, // = quantityNominal?
    quantityNominalType: "UNIT",
    totalReturn: 5, //=profitOrLoss?
    totalReturnPercent: 1 //=?
}

const emptyPortfolio = (portfolioId, userId, name) => {
    return {
        "id": portfolioId,
        "userId": userId,
        "portfolio": {
            "overview": {
                "id": portfolioId,
                "name": name,
                "virtual": true,
                "positionCount": 0,
                "value": 0,
                "score": 0,
                "perf7d": 0,
                "perf1y": 0,
                "modified": Date.now()
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
            "keyFigures": [{
                "year": 0,
                "pte": 0,
                "ptb": 0,
                "ptg": 0,
                "eps": 0,
                "div": 0,
                "dividendPayoutRatio": 0
            }],
            "nextDividend": 0,
            "dividendPayoutRatio": 0,
            "totalReturn": 0,
            "totalReturnPercent": 0
        }
    }
}

const newStock = (isin, qty) => {
    return {
        "stock": {
            //id: Number?
            //accountId?
            "isin": isin,
            "wkn": "?", //TODO
            "symbol": "?", //TODO
            "name": "?", //TODO
            "price": 0, //=marketValue?//TODO
            "marketValueCurrency": "?", //TODO
            "quote": 0, //TODO
            "quoteCurrency": "?", //TODO
            "quoteDate": "?", //TODO
            "entryQuote": 0, //TODO (=quote)
            "entryQuoteCurrency": "?", //TODO
            "perf7d": 0, //TODO
            "perf1y": 0, //TODO
            "country": "?", //TODO
            "industry": "REIT-Specialty", //TODO
            "score": 0 //TODO-> finnHub reccomendation trends, for 10 biggest position, average of score multiplied with value, sum divided with total amount of reccomendations
        },
        "qty": qty, // = quantityNominal?
        "quantityNominalType": "UNIT",
        "totalReturn": 0, //=profitOrLoss?
        "totalReturnPercent": 0 //=?
    }
}


// can it be cast to mongoose.ObjectId?
const is_valid_id = (id) => {
    return id.length == 24
}

const is_valid_qty = (qty) => {
    return qty >= 0 // && qty < ?
}

const is_valid_isin = (isin) => {
    return isin.length == 12
}

//returns all portfolios of current user
router.get('/list', (req, res) => {
    var response = { "portfolios": [] };

    Portfolio.find({ "userId": userId }, 'portfolio.overview', function(err, portf) {
        if (err) {
            handle_database_error(res, err)
        } else {
            response.portfolios = portf.map(({ portfolio: { overview: portfOverview } }) => portfOverview)
            res.json(response);
        }
    })
});

router.get('/details/:id', (req, res) => {
    var id = req.params.id;
    var response = {};
    if (!is_valid_id(id)) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        // find all data of portfolio
        Portfolio.findOne({ "userId": userId, "id": id }, (err, portf) => {
            if (err) {
                handle_database_error(res, err)
            } else if (!portf) { //portfolio doesn't exist
                response.error = "PORTFOLIO_ID_INVALID"
                res.status(404).json(response);
            } else {
                response = portf.portfolio;
                res.json(response);
            }
        });
    }
});

router.get('/performance/:id', function(req, res) {
    var id = req.params.id;
    var range = req.body.range;
    var response = {};
    if (id == 1 && range == "7D") {
        response.chart = [0, 1, 2, 3, 4]; //TODO: change to new format
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
    var name = req.body.name;
    var response = {}
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        var portfolioId = new mongoose.Types.ObjectId();
        // check if the name already exists
        Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                handle_database_error(res, err)
            } else if (result) {
                response.error = "PORTFOLIO_NAME_DUPLICATE";
                res.status(400).json(response);
            } else {
                var portfolio = new Portfolio(emptyPortfolio(portfolioId, userId, name))
                    // save new portfolio in database
                portfolio.save(
                    function(err, portfolio) {
                        if (err) {
                            handle_database_error(res, err)
                        } else {
                            console.log("portfolio saved successfully")
                            response.id = portfolio["id"];
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
    if (!is_valid_id(id)) { // otherwise the id can't be cast to ObjectId and a Database Error is thrown
        response.error = "PORTFOLIO_ID_INVALID";
        res.status(404).json(response);
    } else {
        //delete from database
        Portfolio.findOneAndDelete({ "id": id, "userId": userId }, (err, portf) => {
            if (err) {
                handle_database_error(res, err);
            } else if (!portf) {
                response.error = "PORTFOLIO_ID_INVALID"
                res.status(404).json(response);
            } else {
                res.json(response);
            }
        })
    }
});

router.put('/rename/:id', (req, res) => {
    // request: {"name" : name} 
    var id = req.params.id;
    var name = req.body.name;
    var response = {};
    if (!is_valid_id(id)) { // otherwise the id can't be cast to ObjectId and a Database Error is thrown
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        if (!name) {
            response.error = "PORTFOLIO_NAME_INVALID";
            res.status(400).json(response);
        } else {
            //check if the name already exists
            Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
                if (err) {
                    handle_database_error(res, err)
                } else if (result) {
                    response.error = "PORTFOLIO_NAME_DUPLICATE"; // if this portfolio or another portfolio of the same user already has the given name
                    res.status(400).json(response);
                } else {
                    //update name
                    Portfolio.findOneAndUpdate({ "id": id, "userId": userId }, { "portfolio.overview.name": name }, (err, portf) => {
                        if (err) {
                            handle_database_error(res, err)
                        } else if (!portf) {
                            response.error = "PORTFOLIO_ID_INVALID"
                            res.status(404).json(response);
                        } else {
                            res.json(response);
                        }
                    })
                }
            })
        }
    }
});


// not perfect yet
router.put('/modify/:id', async(req, res) => {
    // request: {"modifications": 
    //                  [{"isin": "string",
    //                  "qty": 0}]}
    var id = req.params.id;
    var response = {};
    for (var j = 0; j < req.body.modifications.length; j++) {
        var isin = req.body.modifications[j].isin;
        var qty = req.body.modifications[j].qty;


        if (!is_valid_id(id)) {
            response.error = "PORTFOLIO_ID_INVALID"
            res.status(404).json(response);
            j = req.body.modifications.length //=break;
            break;
        } else {
            if (!is_valid_qty(qty)) {
                console.log(qty)
                response.error = "QTY_INVALID"
                res.status(400).json(response);
                j = req.body.modifications.length //=break;
                break;
            } else {
                if (!is_valid_isin(isin)) {
                    response.error = "ISIN_INVALID"
                    res.status(400).json(response);
                    j = req.body.modifications.length //=break;
                    break;
                } else {
                    // find Portfolio
                    await Portfolio.findOne({ "id": id, "userId": userId }, (err, portfolio) => {
                        if (err) {
                            handle_database_error(res, err)
                        } else if (!portfolio) {
                            response.error = "PORTFOLIO_ID_INVALID"
                            res.status(404).json(response);
                            j = req.body.modifications.length //=break;
                        } else if (!portfolio.portfolio.overview.virtual) {
                            response.error = "REAL_PORTFOLIO_MODIFICATION"
                            res.status(400).json(response);
                            j = req.body.modifications.length //=break;
                        } else {
                            // modify portfolio
                            var positions = portfolio.portfolio.positions
                            var pos = positions.find((position) => {
                                return position.stock.isin == isin
                            })
                            if (pos) {
                                // update value of portfolio
                                var oldstockvalue = pos.stock.price * pos.qty
                                portfolio.portfolio.overview.value -= oldstockvalue
                                if (qty == 0) {
                                    // delete position from portfolio
                                    for (var i = 0; i < positions.length; i++) {
                                        if (positions[i].stock.isin == isin) {
                                            positions.splice(i, 1);
                                        }
                                    }
                                } else {
                                    var newstockvalue = pos.stock.price * qty
                                    portfolio.portfolio.overview.value += newstockvalue
                                    pos.qty = qty
                                }
                            } else if (qty != 0) {
                                // add new stock to portfolio
                                var stock = newStock(isin, qty)
                                positions.push(stock)
                                portfolio.portfolio.overview.value += stock.stock.price * stock.qty
                            }

                            //TODO modify totalReturn of portfolio and all the other fields
                            portfolio.portfolio.overview.modified = Date.now() // current timestamp
                            portfolio.portfolio.overview.positionCount = portfolio.portfolio.positions.length;
                            portfolio.save()
                            console.log("success for modification nr. " + j) //why does this happen even when the isin is invalid?
                            if (j == req.body.modifications.length - 1) {
                                res.json(response)
                            }
                        }
                    })

                }
            }
        }
    }

});

const duplicate_portfolio = (portf, portfolioId, name) => {
    portf["id"] = portfolioId
    portf.portfolio.overview["id"] = portfolioId
    portf.portfolio.overview.virtual = true;
    portf.portfolio.overview.name = name;
    // change _id so mongoose doesn't think that it is a duplicate
    portf._id = new mongoose.Types.ObjectId()

    portf.isNew = true;

    portf.portfolio.overview.modified = Date.now()
    return portf
}


router.post('/duplicate/:id', (req, res) => {
    // request: {"name" : name} 
    var id = req.params.id;
    var name = req.body.name;
    var response = {}
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        var portfolioId = new mongoose.Types.ObjectId(); // id of new portfolio
        // check if name already exists
        Portfolio.findOne({ "userId": userId, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                handle_database_error(res, err)
            } else {
                if (result) { // the name is duplicate
                    response.error = "PORTFOLIO_NAME_DUPLICATE";
                    res.status(400).json(response);
                } else {
                    // find portfolio with this id
                    Portfolio.findOne({ "id": id, "userId": userId }, (err, portf) => {
                        if (err) {
                            handle_database_error(res, err)
                        } else if (!portf) {
                            response.error = "PORTFOLIO_ID_INVALID"
                            res.status(404).json(response);
                        } else {
                            // change id of portfolio
                            var newPortf = duplicate_portfolio(portf, portfolioId, name)

                            newPortf.save(
                                function(err, portfolio) {
                                    if (err) {
                                        handle_database_error(res, err)
                                    } else {
                                        console.log("portfolio saved successfully")
                                        response.id = portfolio["id"];
                                        res.json(response);
                                    }
                                }
                            )
                        }
                    })
                }
            }
        })
    }
});

router.put('/stock/:isin', (req, res) => {
    var isin = req.params.isin;
    var response = {};
    if (isin.replace("-", "").length != 12) {
        response.error = "ISIN_INVALID"
        res.status(400).json(response);
    } else {
        res.json(response);
    }
});


router.get('/stock/:isin', (req, res) => { // get portfolioId, name, qty of stock
    var isin = req.params.isin;

    var response = {};
    //? = %3F
    Portfolio.find({ "userId": userId }, 'id portfolio.overview.name portfolio.positions', function(err, portf) {
        if (err) {
            handle_database_error(res, err)
        } else {
            response.portfolios = portf.map(({ id: pfId, portfolio: { overview: { name: pfName }, positions: arrayStocks } }) => {
                var positionsWithCurrentISIN = arrayStocks.filter((position) => {
                        return position.stock.isin == isin
                    }) // the resulting array should have length 1 or 0
                var qty;
                if (positionsWithCurrentISIN.length == 0) {
                    qty = 0
                } else {
                    qty = positionsWithCurrentISIN[0].qty
                }
                var result = {
                    "id": pfId,
                    "name": pfName,
                    "qty": qty
                };
                return result;
            }).filter((result) => {
                return result.qty > 0
            })

            res.json(response);
        }
    })
});

// is not in the documentation any more
router.post('/import', (req, res) => {
    res.json({});
});


// finapi part

// global variable to be "cached"
var token;

// token/user gives user auth, for any other thing - client, e.g. token/client
router.get('/token/:person', async(req, res) => {
    let person = req.params.person;

    //no merged secret configuration yet, so not specified
    let body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': "",
        'client_secret': ""
    });

    // credentials taken from db 
    if (person == 'user') {
        body.append("username", "");
        body.append("password", "");
        body.set("grant_type", "password");
    }

    const api_url = `https://sandbox.finapi.io/oauth/token`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        catchErrors(api_response);

        const json_response = await api_response.json();
        token = 'Bearer ' + json_response['access_token'];
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }
});

router.get('/newUser', async(req, res) => {
    let body = {
        id: "testid",
        password: "testpassword",
        email: "email@localhost.de",
        phone: "+49 99 999999-999"
    };

    const api_url = `https://sandbox.finapi.io/api/v1/users`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        catchErrors(api_response);

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/search', async(req, res) => {
    var search = "stadtsparkasse";

    const api_url = `https://sandbox.finapi.io/api/v1/banks?search=${search}`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            }
        });

        catchErrors(api_response);

        const response = await api_response.json();
        res.json(response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/importConnection/:bankId', async(req, res) => {
    let body = { //e.g. 26628 - stadtsparkasse
        id: req.params.id
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/import`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'Access-Control-Expose-Headers': 'Location'
            }
        });

        const json_response = await api_response;
        // res.json(json_response.headers);
        json_response.headers.forEach((val, key) => {
            console.log(key, val);
        });
        console.log(json_response.headers.get('Location'));
        var location = json_response.headers.get('Location');

        //temporary overwriting of location due for testing
        location = "/finapi/token/user";

        res.redirect(location);


    } catch (err) {
        res.send(err.message);
    }

});

router.get('/bankConnections/', async(req, res) => {
    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        catchErrors(api_response);

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/deleteConnection/:id', async(req, res) => {
    var id = req.params.id;

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/${id}`;

    try {
        const api_response = await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        catchErrors(api_response);

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/deleteAllConnections', async(req, res) => {
    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;

    try {
        const api_response = await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        catchErrors(api_response);

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/securities', async(req, res) => {
    const api_url = `https://sandbox.finapi.io/api/v1/securities`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        catchErrors(api_response);

        const json_response = await api_response.json();
        res.json(json_response);

        var portfolioId = new mongoose.Types.ObjectId();

        var positionCount = 0;
        if (json_response.securities !== undefined) {
            var positions = convertSecurities(json_response.securities);
            positionCount = json_response.securities.length;
        }

        var tmpPortoflio = new Portfolio({
            "id": portfolioId,
            "userId": userId,
            "portfolio": {
                "overview": {
                    "id": portfolioId,
                    "name": "tmpPortfolio",
                    "virtual": false,
                    "positionCount": positionCount,
                    "value": 0,
                    "score": 0,
                    "perf7d": 0,
                    "perf1y": 0,
                    "modified": 1617710040
                },
                "positions": positions,
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
                "keyFigures": [{
                    "year": 0,
                    "pte": 0,
                    "ptb": 0,
                    "ptg": 0,
                    "eps": 0,
                    "div": 0,
                    "dividendPayoutRatio": 0
                }],
                "nextDividend": 0,
                "dividendPayoutRatio": 0,
                "totalReturn": 0,
                "totalReturnPercent": 0
            }
        });

        // updates will come with checking for existing portfolios
        tmpPortoflio.save(
            function(err, portfolio) {
                if (err) handle_database_error(res, err)
                else {
                    console.log('success');
                }
            }
        )

    } catch (err) {
        console.log(err.message);
    }

});


// convert definitions of finapi into the mongodb schema, handling an array of securities 
function convertSecurities(securities) {
    var positions = [];
    securities.forEach((item, i) => {
        positions.push({
            "stock": {
                "isin": securities[i].isin,
                "wkn": securities[i].wkn,
                "symbol": "",
                "name": securities[i].name,
                "price": securities[i].marketValue,
                "marketValueCurrency": securities[i].marketValueCurrency,
                "quote": securities[i].quote,
                "quoteCurrency": securities[i].quoteCurrency,
                "quoteDate": securities[i].quoteDate,
                "entryQuote": securities[i].entryQuote,
                "entryQuoteCurrency": securities[i].entryQuoteCurrency,
                "perf7d": 0,
                "perf1y": 0,
                "country": "USA",
                "industry": "industry",
                "score": 0
            },
            "qty": 0,
            "quantityNominalType": securities[i].quantityNominalType,
            "totalReturn": 1,
            "totalReturnPercent": 0
        });
    });
    return positions;
}

// checking for responses not in a range 200-299
function catchErrors(api_response) {
    if (!api_response.ok) {
        const message = `An error has occured: ${api_response.status}`;
        throw new Error(message);
    }
}

module.exports = router;

module.exports = router