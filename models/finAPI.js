const fetch = require('node-fetch');
const bankConnection = require('../models/bankConnection');
const stockModel = require("../models/stock");
// const UserModel = require("../models/user");
const Portfolio = require('../models/portfolio');
const mongoose = require('mongoose');
const portfolioWorkers = require('../workers/portfolio_worker')

// all functions, that work on finAPI are here

// get an accessToken, gets only called
// by getClientAccessToken or
// by getUserAccessToken
const getAccessToken = async(body) => {
    let api_url = 'https://sandbox.finapi.io/oauth/token';

    // login as client, get access token
    let api_response = await fetch(api_url, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // extract access_token
    let json_response = await api_response.json();
    return 'Bearer ' + json_response['access_token']
}

const getClientAccessToken = async() => {
    const body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
    });
    return await getAccessToken(body);
}

const getUserAccessToken = async(user) => {
    const body = new URLSearchParams({
        'grant_type': "password",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
        'username': user.finUserId,
        'password': user.finUserPassword
    });

    return await getAccessToken(body);
}

// create a user in finAPI and return credentials
const createFinAPIUser = async () => {
    const access_token = await getClientAccessToken();

    // prepare body for user-creation
    const body = {
        id: undefined,
        password: undefined,
        email: undefined,
        phone: undefined,
        isAutoUpdateEnabled: true
    };

    // adjust url for user-creation
    const api_url = `https://sandbox.finapi.io/api/v1/users`;
    const api_response = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    const json_response = await api_response.json();

    return {
        finUserId : json_response.id,
        finUserPassword : json_response.password
    };
}

const deleteFinAPIUser = async(user) => {
    const access_token = await getUserAccessToken(user);
    const api_url = `https://sandbox.finapi.io/api/v1/users`;

    await fetch(api_url, {
        method: 'DELETE',
        headers: {
            'Authorization': access_token
        }
    });

    await deleteAllBankConnections(user);
    await refreshPortfolios(user);
    //TODO TEST 
}

const searchBanks = async(searchString, location) => {
    const access_token = await getClientAccessToken();

    let params = new URLSearchParams({
        'search': searchString,
        'isSupported': true
    });

    if (location !== undefined) {
        for (let loc of location) {
            params.append("location[]", loc);
        }
    }

    const api_url = `https://sandbox.finapi.io/api/v1/banks?${params}`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': access_token
            }
        });

        const response = await api_response.json();

        return response;
    } catch (err) {
        console.log(err);
    }
}

/* const importConnections = async(bankId) => {
    let body = { //e.g. 26628 - stadtsparkasse
        "bankId": bankId
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/import`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const json_response = await api_response;

        var response = {
            "link": json_response.headers.get('Location')
        }

        console.log(json_response.headers.get('Location'));
        return response;

    } catch (err) {
        console.log(err);
    }
} */

const importBankConnection = async(user, bankId) => {
    const access_token = await getUserAccessToken(user);

    let body = { //e.g. 26628 - stadtsparkasse
        bankId: bankId
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/import`;
    const api_response = await fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    const json_response = await api_response;
    return {
        "link": json_response.headers.get('Location')
    }
}

const updateFinApiConnection = async(user, bankConnectionId) => {
    const access_token = await getUserAccessToken(user);
    const userId = user.id;

    let body = {
        "bankConnectionId": bankConnectionId
    };

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/update`;

    try {
        const api_response = await fetch(api_url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token
            }
        });

        const json_response = await api_response;

        let response = {};

        if (!api_response.ok) {
            response.result = json_response.headers.get('Location'); // redirecting 
            console.log("REDIRECT_REQUIRED/ERROR_OCCURED");
        } else {
            await refreshBankConnections(user);
            await refreshPortfolios(user);
            response.result = "BANK_CONNECTIONS_UPDATED";
            console.log("BANK_CONNECTIONS_UPDATED");
        }
        console.log(response);

        return response;

    } catch (err) {
        console.log(err);
    }
}

const getAllBankConnections = async(userId) => {
    return bankConnection.findOne({ "userId": userId }, function(err, list) {
        if (err) console.log(err);
        return list;
    });
}

const refreshBankConnections = async(user) => {
    const access_token = await getUserAccessToken(user);
    const userId = user.id;

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token
            }
        });

        const json_response = await api_response.json();
        let connections = json_response.connections;


        await bankConnection.findOne({ "userId": userId }).select('bankConnections.bankConnectionId').exec(async function(err, bcs) {
            if (!err && bcs !== undefined && bcs != null && bcs.length != 0) {
                let bankArray = bcs.bankConnections; // db result
                if (connections !== undefined && connections.length != 0) {

                    
                    let dbConnections = [];

                    for (var i in bankArray) {
                        dbConnections.push(JSON.stringify(bankArray[i].bankConnectionId));
                    }

                    let finapiConnections = [];
                    for (var j in connections) {
                        finapiConnections.push(connections[j].id + '');
                    }

                    dbConnections = finapiConnections.filter(x => !dbConnections.includes(x) || dbConnections.includes(x));

                    for (var i in bankArray) {
                        if (!dbConnections.includes(bankArray[i].bankConnectionId))
                            delete bankArray[i];
                    }

                } else {
                    for (var i in bankArray) {
                        delete bankArray[i];
                    }
                }

                bcs.save(
                    function(error, connectionRes) {
                        if (error) console.log(error)
                    });
            }

        });

        if (connections !== undefined && connections.length > 0) {
            for (var k in connections) {
                await updateOrSaveConnections(userId, connections[k]);
            }
        } else
            console.log("error: NO_CONNECTIONS_ERROR");
    } catch (err) {
        console.log(err)
    }
}


async function updateOrSaveConnections(userId, connection) {

    bankConnection.findOne({ "userId": userId }).exec(async(err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (!result) {
                var bConnection = new bankConnection(newConnection(userId, connection));

                bConnection.markModified('bankConnections');
                bConnection.save(
                    function(error, conn) {
                        if (error) console.log(error);
                    }
                );
            } else {
                if (result.bankConnections) {
                    let accounts = connection.accountIds;

                    for (var i in accounts) {
                        for (var j in result.bankConnections) {
                            let account = result.bankConnections[j].accountIds.find((accountId) => {
                                return accounts[i] == accountId;
                            });
                            if (!account) {
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                var dateTime = date + ' ' + time;

                                result.bankConnections[j].accountIds.push(accounts[i]);
                                result.bankConnections[j].modified = dateTime;
                            }
                        }

                    }

                    result.save(
                        function(error, connectionRes) {
                            if (error) console.log(error)
                        });
                }

            }
        }
    });
}

const deleteOneBankConnection = async(user, idToRemove) => {
    const access_token = await getUserAccessToken(user);
    const userId = user.id;

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections/${idToRemove}`;

    try {
        await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Authorization': access_token
            }
        });

        bankConnection.findOne({ "userId": userId }).exec(async(err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    let found = result.bankConnections.find((connection) => {
                        return connection.bankConnectionId === idToRemove
                    });
                    if (found) {

                        let accountIds = found.accountIds;

                        result.bankConnections.pull(found);

                        result.save(
                            function(error, connectionRes) {
                                if (error) console.log(error)
                            });

                        // in case updateConnection not up, verifying
                        await Portfolio.deleteMany({ "userId": userId, "bankAccountId": { "$in": accountIds } }).exec(async(err, res) => {
                            if (err) console.log(err);
                        });

                        await refreshPortfolios(user);
                    }
                }
            }
        });

    } catch (err) {
        console.log(err.message);
    }
}

const deleteAllBankConnections = async(user) => {
    const access_token = await getUserAccessToken(user);
    const userId = user.id;

    const api_url = `https://sandbox.finapi.io/api/v1/bankConnections`;

    try {
        await fetch(api_url, {
            method: 'DELETE',
            headers: {
                'Authorization': access_token
            }
        });

        bankConnection.deleteMany({ "userId": userId }).exec(async(err, result) => {
            if (err) console.log(err)
            else {
                // in case updateConnection not up, verifying
                await Portfolio.deleteMany({ "userId": userId }).exec(async(err, result) => {
                    if (err) console.log(err);
                });
            }
        });

        await refreshBankConnections(user);
        await refreshPortfolios(user);

    } catch (err) {
        console.log(err.message);
    }
}

const refreshPortfolios = async(user) => {
    const access_token = await getUserAccessToken(user);
    const userId = user.id;

    const api_url = `https://sandbox.finapi.io/api/v1/securities`;

    try {
        const api_response = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token
            }
        });

        const json_response = await api_response.json();
        let securities = json_response.securities;

        Portfolio.find({ "userId": userId, "portfolio.overview.virtual": false }).select('portfolio.positions').exec(async function(err, pfs) {
            if (!err) {
                for (var i in pfs) {
                    deleteInDocs(pfs[i], securities);
                }
            }

        });

        if (securities !== undefined && securities.length > 0) {
            for (var k in securities) {
                await updateOrSavePortfolios(userId, securities[k]);
            }
        } else
            console.log("error: NO_SECURITIES_ERROR");

    } catch (error) {
        console.log(error.message);
    }

}

async function deleteInDocs(pf, securities) {
    if (securities !== undefined && securities.length != 0) {

        let positions = pf.portfolio.positions;

        let dbIsins = [];
        for (var i in positions) {
            dbIsins.push(JSON.stringify(positions[i].stock.isin));
        }

        let finapiIsins = [];

        for (var j in securities) {
            finapiIsins.push(securities[j].id + '');
        }

        dbIsins = finapiIsins.filter(x => !dbIsins.includes(x) || dbIsins.includes(x));

        for (var i in positions) {
            if (!dbIsins.includes(positions[i].stock.isin))
                delete positions[i];
        }

    } else {
        for (var i in pf.portfolio.positions) {
            delete pf.portfolio.positions[i];
        }
    }

    pf.save(
        function(error, pfRes) {
            if (error) console.log(error)
        });
}

async function updateOrSavePortfolios(userId, security) {
    Portfolio.findOne({ "userId": userId, "bankAccountId": security.accountId }).exec(async(err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (!result) {
                var portfolioId = new mongoose.Types.ObjectId();

                var portfolio = new Portfolio(await newPortfolio(portfolioId, userId, security));
                portfolioWorkers.updatePortfolioWhenModified(portfolio);
                portfolio.save(
                    function(error, portfolioRes) {
                        if (error) console.log(error);
                    }
                );
            } else {
                let positions = await convertSecurity(security);

                let stock = result.portfolio.positions.find((position) => {
                    return security.isin == position.stock.isin
                });

                if (stock) {
                    stock = positions;
                } else {
                    result.portfolio.positions.push(positions);
                }

                portfolioWorkers.updatePortfolioWhenModified(result);
                result.portfolio.overview.modified = Math.floor(Date.now() / 1000);

                result.save(
                    function(error, portfolioRes) {
                        if (error) console.log(error)
                    });
            }
        }
    });
}

const newConnection = (userId, connection) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    return {
        "userId": userId,
        "bankConnections": [{
            "bankConnectionId": connection.id,
            "name": connection.bank.name,
            "accountIds": connection.accountIds,
            "modified": dateTime,
            "created": dateTime,
        }]

    }
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
            "totalReturn": security.profitOrLoss,
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

/*
const refreshCronjob = async() => {
    const users = await UserModel.find({});
    for(let user of users){
        await refreshBankConnections(user);
        await refreshPortfolios(user);
    }
}
 */

module.exports = {
    createFinAPIUser,
    deleteFinAPIUser,
    searchBanks,
    importBankConnection,
    getAllBankConnections,
    deleteOneBankConnection,
    deleteAllBankConnections,
    updateFinApiConnection,
    refreshBankConnections,
    refreshPortfolios,
    // refreshCronjob,
    getUserAccessToken
}