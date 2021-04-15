'use strict';
const express = require('express');
const Portfolio = require('../models/portfolio');
//const PortfolioOverview = PortfolioModels.portfolioOverview
const mongoose = require('mongoose');
const { ResourceGroups } = require('aws-sdk');
const cookieParser = require('cookie-parser');
const portfolioWorkers = require('../workers/portfolio_worker')
const stockDetailedAnalysisModel = require('../models/stockDetailedAnalysis');
const stockModel = require("../models/stock")

const secret = require('../secret/secret')();
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.use(cookieParser(process.env.auth_jwt_secret));

const fetch = require('node-fetch');
const passport = require('passport');

const handle_database_error = (res, err) => {
    var response = {}
    response.error = "DATABASE_ERROR"
    response.message = "" + err
    console.log(err)
    res.status(500).json(response);
}

//cronjob
const cron = require("node-cron");
const { json } = require('express');
const { rawListeners } = require('../models/portfolio');

// cron.schedule("39 17 * * *", () => {
//     console.log("it's 21 20")
//     Portfolio.find({}, async function (err, portf) {
//         if (err) {
//             //do nothing
//         } else {
//             for (var j = 0; j < portf.length; j++) {
//                 try {
//                     await portfolioWorkers.updatePortfolioCronjob(portf[j])
//                     portf[j].save()
//                 } catch (e) {
//                     //? doesn't work
//                 }

//             }
//         }
//     })
// });


// what percent nr1 is in realtion to nr2
const percent = (nr1, nr2) => {
    if (nr1 && nr2 && !isNaN(nr1) && !isNaN(nr2))
        return nr1 / (nr2) * 100
    else
        return 0
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
                "perf7dPercent": 0,
                "perf1yPercent": 0,
                "modified": Date.now()
            },
            "positions": [],
            "performance": []
        }
    }
}


const newStock = async(symbol, qty) => {
    var stockArray = await portfolioWorkers.searchStock(symbol);
    var stock = stockArray[0]
    if (!stock) {
        stock = {
            "isin": "?",
            "wkn": "?",
            "symbol": symbol,
            "name": symbol,
            "price": 0,
            "marketValueCurrency": "?",
            "quote": 0,
            "quoteCurrency": "?",
            "quoteDate": Date.now(),
            "entryQuote": 0,
            "entryQuoteCurrency": "?",
            "perf7d": 0,
            "perf1y": 0,
            "perf7dPercent": 0,
            "volatility": 0,
            "debtEquity": 0,
            "perf1yPercent": 0,
            "country": "?",
            "industry": "?",
            "score": 0
        }
    }
    var detailedAnalysis = await stockDetailedAnalysisModel.findOne({ "symbol": stock.symbol })
    if (!detailedAnalysis) {
        detailedAnalysis = {
            "averageGoal": 0
        }
    }
    var result = {
        "stock": {
            "isin": stock.isin,
            "wkn": stock.wkn,
            "symbol": stock.symbol,
            "name": stock.name,
            "price": stock.price,
            "marketValueCurrency": stock.currency,
            "quote": stock.price,
            "quoteCurrency": stock.currency,
            "quoteDate": stock.date,
            "entryQuote": stock.price,
            "entryQuoteCurrency": stock.currency,
            "perf7d": stock.per7d,
            "perf1y": stock.per365d,
            "perf7dPercent": percent(stock.per7d, (stock.price * qty)),
            "perf1yPercent": percent(stock.per365d, (stock.price * qty)),
            "country": stock.country,
            "industry": stock.industry,
            "score": detailedAnalysis.averageGoal
        },
        "qty": qty,
        "quantityNominalType": "UNIT",
        "totalReturn": 0,
        "totalReturnPercent": 0
    }
    return result;
}


// can it be cast to mongoose.ObjectId?
const is_valid_id = (id) => {
    return id.length == 24
}

const is_valid_qty = (qty) => {
    return qty >= 0 // && qty < ?
}



//returns all portfolios of current user
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
    var response = { "portfolios": [] };

    Portfolio.find({ "userId": req.user.id }, 'portfolio.overview', function(err, portf) {
        if (err) {
            handle_database_error(res, err)
        } else {
            response.portfolios = portf.map(({ portfolio: { overview: portfOverview } }) => portfOverview)
            res.json(response);
        }
    })
});

router.get('/details/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    var id = req.params.id;
    var response = {};
    if (!is_valid_id(id)) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        // find all data of portfolio
        Portfolio.findOne({ "userId": req.user.id, "id": id }, { "portfolio.performance": false, "portfolio.overview._id": false }, (err, portf) => {
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



router.get('/performance/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    var id = req.params.id;
    var response = {};
    if (!is_valid_id(id)) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404).json(response);
    } else {
        // find all data of portfolio
        Portfolio.findOne({ "userId": req.user.id, "id": id }, (err, portf) => {
            if (err) {
                handle_database_error(res, err)
            } else if (!portf) { //portfolio doesn't exist
                response.error = "PORTFOLIO_ID_INVALID"
                res.status(404).json(response);
            } else {
                if (portf.portfolio.performance)
                    response.chart = portf.portfolio.performance;
                else {
                    response.chart = []
                }
                res.json(response);
            }
        });
    }
});

//creates new portfolio with the given name and gives the id as a response
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
    // request: {"name" : name}
    var name = req.body.name;
    var response = {}
    if (!name) {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
    } else {
        var portfolioId = new mongoose.Types.ObjectId();
        // check if the name already exists
        Portfolio.findOne({ "userId": req.user.id, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                handle_database_error(res, err)
            } else if (result) {
                response.error = "PORTFOLIO_NAME_DUPLICATE";
                res.status(400).json(response);
            } else {
                var portfolio = new Portfolio(emptyPortfolio(portfolioId, req.user.id, name))
                    // save new portfolio in database
                portfolio.save(
                    function(err, portfolio) {
                        if (err) {
                            handle_database_error(res, err)
                        } else {
                            //console.log("portfolio saved successfully")
                            response.id = portfolio["id"];
                            res.json(response);
                        }
                    }
                )
            }
        })
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    var id = req.params.id;
    var response = {};
    if (!is_valid_id(id)) { // otherwise the id can't be cast to ObjectId and a Database Error is thrown
        response.error = "PORTFOLIO_ID_INVALID";
        res.status(404).json(response);
    } else {
        //delete from database
        Portfolio.findOneAndDelete({ "id": id, "userId": req.user.id }, (err, portf) => {
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

router.put('/rename/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
            Portfolio.findOne({ "userId": req.user.id, "portfolio.overview.name": name }).exec((err, result) => {
                if (err) {
                    handle_database_error(res, err)
                } else if (result) {
                    response.error = "PORTFOLIO_NAME_DUPLICATE"; // if this portfolio or another portfolio of the same user already has the given name
                    res.status(400).json(response);
                } else {
                    //update name
                    Portfolio.findOneAndUpdate({ "id": id, "userId": req.user.id }, { "portfolio.overview.name": name }, (err, portf) => {
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

// returns true if the positionId is either the name, the isin, the wkn or the symbol of the position
const idBelongsToThisPosition = (positionId, position) => {
    return positionId == position.stock.isin || positionId == position.stock.wkn || positionId == position.stock.name || positionId == position.stock.symbol;
}

// returns the first one of the fields "symbol", "isin", "wkn", "name" which has a defined value
const findPortfolioId = (modification) => {
    if (modification.symbol)
        return modification.symbol
    else if (modification.isin)
        return modification.isin
    else if (modification.wkn)
        return modification.wkn
    else if (modification.name)
        return modification.name
}

// query for mongoose
// matches document which has isin, wkn, symbol or name equal to positionId
const query = (userId, positionId) => {
    return {
        $or: [
            { "userId": userId, "portfolio.positions.stock.isin": positionId },
            { "userId": userId, "portfolio.positions.stock.wkn": positionId },
            { "userId": userId, "portfolio.positions.stock.symbol": positionId },
            { "userId": userId, "portfolio.positions.stock.name": positionId }
        ]
    }
}

/** Modifies the positions of a portfolio and saves the timestamp of the modification in the portfolio's history.
 * If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists. 
 * If there is no position in the specified portfolio, a new position with the specified quantity is created. 
 * Otherwise, the position in the specified portfolio is updated to match the specified quantity.
 * The position which is changed is the one which has isin, wkn, symbol or name equal to positionId
 */
const modifyPortfolio = async(portfolio, positionId, qty) => {
    var validPosition = true
        // modify portfolio
    var positions = portfolio.portfolio.positions
        // find the right position, if already present in portfolio
    var pos = positions.find((position) => {
        return idBelongsToThisPosition(positionId, position)
    })
    if (pos) { // if present
        if (qty == 0) {
            // delete position from portfolio
            for (var i = 0; i < positions.length; i++) {
                if (idBelongsToThisPosition(positionId, positions[i])) {
                    positions.splice(i, 1);
                }
            }
        } else {
            // update position of portfolio
            pos.qty = qty
        }
    } else if (qty != 0) {
        // add new stock/position to portfolio
        var stock = await newStock(positionId, qty)
        if (stock.stock.country != "?") {
            positions.push(stock)
        } else {
            validPosition = false
        }
    }
    if (validPosition)
        await portfolioWorkers.updatePortfolioWhenModified(portfolio)
    return validPosition;
}



// if one of the modifications causes an error, nothing gets modified in the database
router.put('/modify/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    // request: {"modifications": 
    //                  [{"isin": "string", -> could also be symbol, wkn or name
    //                  "qty": 0}]}
    var id = req.params.id;
    var response = {};
    if (!is_valid_id(id)) {
        response.error = "PORTFOLIO_ID_INVALID"
        res.status(404)
        res.json(response)
    } else {
        // find Portfolio
        await Portfolio.findOne({ "id": id, "userId": req.user.id }, async(err, portfolio) => {
            if (err) {
                handle_database_error(res, err)
            } else if (!portfolio) {
                response.error = "PORTFOLIO_ID_INVALID"
                res.status(404).json(response)
            } else if (!portfolio.portfolio.overview.virtual) {
                response.error = "REAL_PORTFOLIO_MODIFICATION"
                res.status(400).json(response)
            } else {
                var success = true;
                for (var j = 0; j < req.body.modifications.length; j++) {
                    var portfolioId = findPortfolioId(req.body.modifications[j]);
                    var qty = req.body.modifications[j].qty;
                    if (!is_valid_qty(qty)) {
                        response.error = "QTY_INVALID"
                        res.status(400).json(response)
                        success = false;
                        break;
                    } else {
                        success = await modifyPortfolio(portfolio, portfolioId, qty)
                        if (!success) {
                            response.error = "SYMBOL_INVALID"
                            res.status(400).json(response)
                            success = false;
                            break;
                        }
                    }
                }
                if (success) { // all modifications done
                    portfolio.save(
                        function(err, portfolio) {
                            if (err) handle_database_error(res, err)
                            else
                                res.json(response) // success
                        }
                    )

                }
            }
        })
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


router.post('/duplicate/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
        Portfolio.findOne({ "userId": req.user.id, "portfolio.overview.name": name }).exec((err, result) => {
            if (err) {
                handle_database_error(res, err)
            } else {
                if (result) { // the name is duplicate
                    response.error = "PORTFOLIO_NAME_DUPLICATE";
                    res.status(400).json(response);
                } else {
                    // find portfolio with this id
                    Portfolio.findOne({ "id": id, "userId": req.user.id }, (err, portf) => {
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



router.get('/stock/:isin', passport.authenticate('jwt', { session: false }), (req, res) => { // get portfolioId, name, virtual, qty of stock
    var isin = req.params.isin;

    var response = {};
    //? = %3F
    Portfolio.find({ "userId": req.user.id }, 'id portfolio.overview.name portfolio.overview.virtual portfolio.positions', function(err, portf) {
        if (err) {
            handle_database_error(res, err)
        } else {
            response.portfolios = portf.map(({ id: pfId, portfolio: { overview: { name: pfName, virtual: pfVirtual }, positions: arrayStocks } }) => {
                var positionsWithCurrentISIN = arrayStocks.filter((position) => {
                        return idBelongsToThisPosition(isin, position)
                    }) // the resulting array should have length 1
                var qty;
                if (positionsWithCurrentISIN.length == 0) {
                    qty = 0
                } else {
                    qty = positionsWithCurrentISIN[0].qty
                }
                var result = {
                    "id": pfId,
                    "name": pfName,
                    "virtual": pfVirtual,
                    "qty": qty
                };
                return result;
            })
            res.json(response);
        }
    })
});


router.put('/stock/:isin', passport.authenticate('jwt', { session: false }), (req, res) => { // get portfolioId, name, qty of stock
    // request: {
    // "modifications": [
    //     {
    //     "id": "string",
    //     "qty": 0
    //     }
    // ]
    // }
    var isin = req.params.isin;

    var response = {};
    var modifications = req.body.modifications;
    if (modifications.length == 0) {
        res.json(response)
    }

    for (var j = 0; j < modifications.length; j++) {
        var id = modifications[j].id
        var qty = modifications[j].qty
        if (!is_valid_id(id)) {
            response.error = "PORTFOLIO_ID_INVALID"
            if (j == 0)
                res.status(404).json(response)
        } else {
            // find Portfolio
            Portfolio.findOne({ "id": id, "userId": req.user.id }, async(err, portfolio) => {
                var currentIndex = j;
                if (err) {
                    handle_database_error(res, err)
                } else if (!portfolio) {
                    response.error = "PORTFOLIO_ID_INVALID"
                    if (!res.headersSent)
                        res.status(404).json(response)
                } else if (!portfolio.portfolio.overview.virtual) {
                    response.error = "REAL_PORTFOLIO_MODIFICATION"
                    if (!res.headersSent)
                        res.status(400).json(response)
                } else {
                    var success = true;

                    var portfolioId = isin;
                    if (!is_valid_qty(qty)) {
                        response.error = "QTY_INVALID"
                        if (!res.headersSent)
                            res.status(400).json(response)
                        success = false;
                    } else {
                        success = await modifyPortfolio(portfolio, portfolioId, qty)
                        if (!success) {
                            response.error = "SYMBOL_INVALID"
                            if (!res.headersSent)
                                res.status(400).json(response)
                            success = false;
                        }
                    }
                }
                if (success) {
                    portfolio.save(
                        function(err, portfolio) {
                            if (err) handle_database_error(res, err)
                            else if (!res.headersSent)
                                res.json(response) // success
                        }
                    )

                }
            })
        }
    }
});


// finapi part

// token/user gives user auth, for any other thing - client, e.g. token/client
router.get('/token/:person', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let person = req.params.person;

    //no merged secret configuration yet, so not specified
    let body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
    });

    // credentials taken from db 
    if (person == 'user') {
        body.append("username", req.user.finUserId);
        body.append("password", req.user.finUserPassword);
        body.set("grant_type", "password");
    }

    console.log(body);

    const api_url = `https://sandbox.finapi.io/oauth/token`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!api_response.ok) res.status = api_response.status;

        const json_response = await api_response.json();

        // secure: true, add in the end, when no testing needed 
        res.cookie('finapi_token', 'Bearer ' + json_response['access_token'], { signed: true, httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/newUser', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let body = {
        id: req.body.id, // read: username
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        isAutoUpdateEnabled: true
    };

    const api_url = `https://sandbox.finapi.io/api/v1/users`;

    const api_response = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.signedCookies.finapi_token
        }
    });

    if (!api_response.ok) res.status = api_response.status;

    const json_response = await api_response.json();
    res.json(json_response);

});

router.get('/deleteUser', passport.authenticate('jwt', { session: false }), async(req, res) => {

    const api_url = `https://sandbox.finapi.io/api/v1/users`;

    try {
        const api_response = await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        var response = { "success": "DELETION_SUCCESS" };
        res.json(response);

    } catch (err) {
        res.send(err.message);
    }
});

router.post('/searchBanks', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let params = new URLSearchParams({
        'search': req.body.search, // main field, others if needed
        'page': req.body.page,
        'perPage': req.body.perPage
            // 'isSupported': req.body.isSupported
    });

    if (params.get('ids') == "undefined") params.delete('ids');
    if (params.get('perPage') == "undefined") params.delete('perPage');
    if (params.get('page') == "undefined") params.delete('page');
    // if (params.get('isSupported') == "undefined") params.delete('isSupported');
    if (req.body.order !== undefined) {
        var orderParams = new URLSearchParams({});
        for (let order of req.body.order) {
            orderParams.append("order[]", order);
        }
    }
    if (req.body.location !== undefined) {
        var locations = new URLSearchParams({});
        for (let location of req.body.location) {
            locations.append("location[]", location);
        }
    }
    if (req.body.ids !== undefined) {
        var ids = new URLSearchParams({});
        for (let id of req.body.ids) {
            ids.append("ids[]", id);
        }
    }
    const api_url = `https://sandbox.finapi.io/api/v1/banks?${params}`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        const response = await api_response.json();
        res.json(response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/importConnection/:bankId', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let body = { //e.g. 26628 - stadtsparkasse
        bankId: req.params.bankId
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/import`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        const json_response = await api_response;

        var response = {
            "link": json_response.headers.get('Location')
        }

        res.json(response);

    } catch (err) {
        res.send(err.message);
    }

});

router.get('/updateConnection', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let body = {
        bankConnectionId: req.body.bankConnectionId,
        storeSecrets: true
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/update`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        const json_response = await api_response;

        res.json(json_response);

    } catch (err) {
        res.send(err.message);
    }
});

router.post('/bankConnections/', passport.authenticate('jwt', { session: false }), async(req, res) => {
    if (req.body.ids !== undefined) {
        var ids = new URLSearchParams({});
        for (let id of req.body.ids) {
            ids.append("ids[]", id);
        }
    }

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections?${ids}`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.get('/deleteConnection/:id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    var id = req.params.id;

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/${id}`;

    try {
        const api_response = await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Authorization': req.signedCookies.finapi_token
            }
        });
        if (!api_response.ok) res.status = api_response.status;

        var response = { "id": id };
        res.json(response);

        console.log("successfully deleted a bank connection " + id)
    } catch (err) {
        res.send(err.message);
    }
});

router.get('/deleteAllConnections', passport.authenticate('jwt', { session: false }), async(req, res) => {

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;

    try {
        const api_response = await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        const json_response = await api_response.json();
        res.json(json_response);
    } catch (err) {
        res.send(err.message);
    }

});

router.post('/securities', passport.authenticate('jwt', { session: false }), async(req, res) => {
    // if no body, all securities given
    let params = new URLSearchParams({
        'search': req.body.search, // isin, name, wkn contain
        'accountIds': req.body.accountIds // integer array
    });
    if (params.get('search') == "undefined") params.delete('search');
    if (params.get('accountIds') == "undefined") params.delete('accountIds');

    if (req.body.ids !== undefined) {
        var ids = new URLSearchParams({});
        for (let id of req.body.ids) {
            ids.append("ids[]", id);
        }
    }
    if (req.body.order !== undefined) {
        var orderParams = new URLSearchParams({});
        for (let order of req.body.order) {
            orderParams.append("order[]", order);
        }
    }
    if (req.body.accountIds !== undefined) { // needed for separating accounts, otherwise gives ALL securities
        var accountIds = new URLSearchParams({});
        for (let accountId of req.body.accountIds) {
            accountIds.append("accountIds[]", accountId);
        }
    }

    const api_url = `https://sandbox.finapi.io/api/v1/securities?${params}`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        const json_response = await api_response.json();
        res.json(json_response);

    } catch (err) {
        console.log(err.message);
    }

});

router.post('/saveAllSecurities', passport.authenticate('jwt', { session: false }), async(req, res) => {
    const api_url = `https://sandbox.finapi.io/api/v1/securities`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.signedCookies.finapi_token
            }
        });

        if (!api_response.ok) res.status = api_response.status;

        const json_response = await api_response.json();
        let securities = json_response.securities;

        if (securities.length > 0) {
            for (var k in securities) {
                await updateOrSave(req.user.id, securities[k], res);
            }

        } else
            res.status(404).json({ "error": "NO_SECURITIES_ERROR" });

    } catch (error) {
        console.log(error.message);
    }

});

async function updateOrSave(userId, security, res) {
    Portfolio.findOne({ "userId": userId, "bankAccountId": security.accountId }).exec(async(err, result) => {
        if (err) {
            handle_database_error(res, err);
        } else {
            if (!result) {
                var portfolioId = new mongoose.Types.ObjectId();

                var portfolio = new Portfolio(await newPortfolio(portfolioId, userId, security));
                portfolioWorkers.updatePortfolioWhenModified(portfolio);
                portfolio.save(
                    function(error, portfolioRes) {
                        if (error) handle_database_error(res, error)
                        else {
                            res.json(portfolioRes);
                            console.log('saved successfully');
                        }
                    }
                );
            } else {
                let positions = await convertSecurity(security);

                let stock = result.portfolio.positions.find((position) => {
                    return security.isin == position.stock.isin
                });

                if (stock) {
                    stock = positions;
                    console.log("modified");
                } else {
                    result.portfolio.positions.push(positions)
                    console.log("added");
                }

                portfolioWorkers.updatePortfolioWhenModified(result);
                result.portfolio.overview.modified = Math.floor(Date.now() / 1000);

                result.save(
                    function(error, portfolioRes) {
                        if (error) console.log(error)
                        else {
                            res.json(portfolioRes);
                            console.log('updated successfully');
                        }
                    });
            }


        }
    });
}

const newPortfolio = async(portfolioId, userId, security) => {
    return {
        "id": portfolioId,
        "userId": userId,
        "bankAccountId": security.accountId,
        "portfolio": {
            "overview": {
                "id": portfolioId,
                "name": "name",
                "virtual": false,
                "positionCount": 1,
                "value": 0,
                "score": 0,
                "perf7d": 0,
                "perf1y": 0,
                "perf7dPercent": 0,
                "perf1yPercent": 0,
                "modified": Math.floor(Date.now() / 1000)
            },
            "positions": await convertSecurity(security),
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
            "totalReturn": 0,
            "totalReturnPercent": 0,
            "analytics": {
                "volatility": 0,
                "standardDeviation": 0,
                "sharpeRatio": 0,
                "treynorRatio": 0,
                "debtEquity": 0,
                "correlations": {}
            },
            "performance": [ // cron scheduler time as parameter how often should it work
                [0]
            ]

        }
    }
}

// convert definitions of finapi into the mongodb schema, handling an array of securities 
async function convertSecurity(security) {
    return {
        "stock": {
            "isin": security.isin,
            "wkn": security.wkn,
            "symbol": await searchSymbol(security.isin, security.wkn),
            "name": security.name,
            "price": security.marketValue,
            "marketValueCurrency": security.marketValueCurrency,
            "quote": security.quote,
            "quoteCurrency": security.quoteCurrency,
            "quoteDate": security.quoteDate,
            "entryQuote": security.entryQuote,
            "entryQuoteCurrency": security.entryQuoteCurrency,
            "perf7d": 0,
            "perf1y": 0,
            "perf7dPercent": 0,
            "perf1yPercent": 0,
            "volatility": 0,
            "debtEquity": 0,
            "country": "DE",
            "industry": "",
            "score": 0
        },
        "qty": security.quantityNominal,
        "quantityNominalType": security.quantityNominalType,
        "totalReturn": 1,
        "totalReturnPercent": 0
    }
}

const searchSymbol = async(isin, wkn) => {
    const api_url = `https://finnhub.io/api/v1/search?q=${isin}`;
    let symbol = "";

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'X-Finnhub-Token': process.env.finnhub_key
            }
        });

        let json_response = await api_response.json();


        if (json_response.count == 1) {
            symbol = json_response.result[0].symbol;

            stockModel.findOneAndUpdate({ symbol: symbol }, {
                    $set: {
                        "isin": isin,
                        "wkn": wkn
                    },
                }, {
                    // upsert: true,
                    new: true
                },
                function(err, _stockInstance) {
                    if (err)
                        console.log(err)
                });
        }

    } catch (err) { console.log(err) }

    return symbol;
}

router.get('/searchSymbol/:isin', async(req, res) => {
    let isin = req.params.isin;
    const api_url = `https://finnhub.io/api/v1/search?q=${isin}`;

    const api_response = await fetch(api_url, {
        headers: {
            'Content-Type': 'application/json',
            'X-Finnhub-Token': process.env.finnhub_key
        }
    });

    let json_response = await api_response.json();
    res.json(json_response);
});


module.exports = router;