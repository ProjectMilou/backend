'use strict';

// init is required to access AWS Secret Manager before running any other code.
const init = async () => {
    await require('./secret/secret')();

    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    const getAnalyticsRoute = require('./routes/analyticsRoutes')
    const getUserRoute = require('./routes/user');
    const getPortfolioRoute = require('./routes/portfolio');
    const getStocksRoute = require('./routes/stocks');
    const getStockRoute = require('./routes/stock');
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    require('./auth/auth');

    // Constants
    const { PORT = 3000 } = process.env;
    const HOST = '0.0.0.0';
    const app = express();

    // swagger setup
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
            './routes/swagger.js'
        ]
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // database setup
    require("./db/index.js")(app);

    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + 'api-docs');
    })

    app.use(bodyParser.json());
    app.use(cors());

    app.use('/user', getUserRoute);
    app.use('/portfolio', getPortfolioRoute);
    app.use('/stocks', getStocksRoute);
    app.use('/stock', getStockRoute);
    app.use('/analytics', getAnalyticsRoute);

    app.listen(process.env.PORT || 3000);
    console.log(`Running on http://${HOST}:${PORT}`);
}
init().then();
