'use strict';

const express = require('express');
const bodyParser = require('body-parser');
require('./auth/auth');

const cors = require('cors');

const getUserRoute = require('./routes/user');
const getPortfolioRoute = require('./routes/portfolio');
const getStocksRoute = require('./routes/stocks');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//const db = require('./db/index.js');


require('./auth/auth');


// Constants
const { PORT = 3000 } = process.env;
const HOST = '0.0.0.0';
const app = express();
const swaggerOptions = {
    encoding: "utf-8",
    swaggerDefinition: {
        info: {
            title: 'Milou Backend API',
            description: 'Information about users, portfolios and stocks',
            servers: ["http://localhost:" + PORT]
        }
    },
    definition: {},
    apis: [
        './routes/portfolio.js',
        './routes/stocks.js',
        './routes/user.js',
        './routes/swagger.js',
        'server.js'
    ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
require( "./db/index.js" )( app );
app.get('/', (req, res) => {
    res.statusCode = 200;
    res.send('visit ' + req.protocol + '://' + req.get('host') + req.originalUrl + 'api-docs for documentation.')
})

app.use(bodyParser.json());
app.use(cors());

app.use('/user', getUserRoute);
app.use('/portfolio', getPortfolioRoute);
app.use('/stocks', getStocksRoute);

app.listen(process.env.PORT || 3000);
console.log(`Running on http://${HOST}:${PORT}`);

//db()