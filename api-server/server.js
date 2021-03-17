'use strict';

const express = require('express');
const getUserRoute = require('./routes/user');
const getPortfolioRoute = require('./routes/portfolio');
const getStocksRoute = require('./routes/stocks');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.use('/user', getUserRoute);
app.use('/portfolio', getPortfolioRoute);
app.use('/stocks', getStocksRoute);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
