"use strict";

// init is required to access AWS Secret Manager before running any other code.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const getAnalyticsRoute = require("./routes/analyticsRoutes");

const getPortfolioRoute = require("./routes/portfolio");
const getStocksRoute = require("./routes/stocks");
const stockWorkers = require("./workers/stocks_worker");
const chartWorkers = require("./workers/charts_worker");

const cron = require("node-cron");

const app = express();

async function initialize() {
  await require("./secret/secret")();
  require("./auth/auth");
  const { PORT = 3000 } = process.env;
  const swaggerJsDoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");
  const swaggerOptions = {
    encoding: "utf-8",
    swaggerDefinition: {
      info: {
        title: "Milou Backend API",
        description: "Information about users, portfolios and stocks",
        servers: ["http://localhost:" + PORT],
      },
    },
    definition: {},
    apis: [
      "./routes/swagger.js",
      "./routes/user.js",
      "./models/user.js",
      "./models/userToken.js",
      "./auth/auth.js",
    ],
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  const getUserRoute = require("./routes/user");
  app.use("/user", getUserRoute);
  require("./db/index.js")(app);
}

if (process.env.NODE_ENV != "test") {
  initialize();
}

cron.schedule(
  "0 4 * * *",
  () => {
    stockWorkers.updateAllStocks();
    chartWorkers.updateAllCharts();
  },
  {
    timezone: "Europe/Berlin",
  }
);

// database setup

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.send(
    "please visit <b> https://api.milou.io/api-docs/ </b> for documentation"
  );
});

app.use(bodyParser.json());
app.use(cors());

app.use("/portfolio", getPortfolioRoute);
app.use("/stocks", getStocksRoute);
app.use("/analytics", getAnalyticsRoute);

module.exports = app;
