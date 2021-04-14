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
    const stockWorkers = require('./workers/stocks_worker')
    const swaggerJsDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const cron = require("node-cron");
    require('./auth/auth');

    // Constants
    const { PORT = 3000 } = process.env;
    const HOST = '0.0.0.0';
    const app = express();

    cron.schedule("30 1 * * *", () => {
        stockWorkers.updateAllStocks()
    }, {
        timezone: "Europe/Berlin"
    });

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
            './routes/swagger.js',
            './routes/user.js',
            './models/user.js',
            './models/userToken.js',
            './auth/auth.js'
        ]
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // database setup
    require("./db/index.js")(app);

    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.send("please visit <b> https://api.milou.io/api-docs/ </b> for documentation")
    })

    app.use(bodyParser.json());
    app.use(cors());

    app.use('/user', getUserRoute);
    app.use('/portfolio', getPortfolioRoute);
    app.use('/stocks', getStocksRoute);
    app.use('/analytics', getAnalyticsRoute);

    app.listen(process.env.PORT || 3000);
    console.log(`Running on http://${HOST}:${PORT}`);
}
init().then();
