# Milou-backend

​ This is the repository for the backend which powers [Milou](api.milou.io/api-docs), running on
an [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) environment on AWS. It includes a MongoDB database
connection and can be interfaced via HTTPS requests. It is also fetching from different financial APIs such
as [Alpha Vantage](https://www.alphavantage.co/), [Finnhub](https://finnhub.io/), [Benzinga](https://benzinga.com/)
and [News API](https://newsapi.org/)
to retrieve information/news about stocks and companies.
Furthermore, [finAPI](https://www.finapi.io/?gclid=Cj0KCQjw38-DBhDpARIsADJ3kjnOQGANlF8mcGFtSLsq282GzMtaaJbcH2X7xnKWLfNM-PJck63tdHwaAofPEALw_wcB)
is used to enable users to connect their bank-accounts, which allows the application to import their real portfolios.
Besides, the Analytics part of Milou is integrated in a sub-folder called `data-analytics` and one file
called `analyticsRoutes.js`, which offers a connection to the Analyzer part of Milou.

​

## Progress

​ What's not working yet?

- data on the database is not stored encrypted (only password hashed), but the functions for encryption/decryption can
  be accessed
- password reset process is finished, redirect link to frontend-webform not provided yet
- almost all stocks-endpoints are working, one is blocked by the analytics-part (12.04.)
- bank-connections can be imported, a cron-job or refresh-route has to be set up, so that portfolios can actually be
  viewed.
- deletion of a user or bank-connection does not delete all user-sensitive data yet.
- project needs a restructuring, regarding the folder structure

​

## Dependencies

​ Among others, we use express, swagger, passportJS, fetch and axios, aws-sdk, dotenv and mongoose.

[Express](https://expressjs.com/) is our main backend-application framework. We use [Swagger](https://swagger.io/) 3.0
OpenAPI for the [documentation](https://api.milou.io/api-docs/) of the API.
[PassportJS](http://www.passportjs.org/) is used for user-authorization.
[Fetch](https://www.npmjs.com/package/node-fetch) is used by the backend application to retrieve data from other APIs,
the analytics team uses
[Axios](https://www.npmjs.com/package/axios) to do so.
[Aws-sdk](https://aws.amazon.com/sdk-for-javascript/) and
[dotenv](https://www.npmjs.com/package/dotenv) are used to access keys and secrets from
[AWS Secret Manager](https://aws.amazon.com/secrets-manager/).
[Mongoose](https://www.npmjs.com/package/mongoose) is used to access our MongoDB.

You can install our dependencies by running `npm install`.

## Installation

​ Except for importing the secrets (next step), no major effort is required to run the project locally.

```sh
npm i
npm start
```

For local development you should keep in mind, that the application is connected to the database (if your aws-secrets
are correct). Thus, you are able to run CRUD operations on the real database using [Postman](https://www.postman.com/),
for example. ​

## Credentials

​ In order to connect to AWS and retrieve the secrets (in local development), the application needs to get the AWS
credentials. It looks for them in the file `~/.aws/credentials` on Linux/macOS and in the file
`C:\Users\USER_NAME\.aws\credentials`. That file must contain `aws_access_key_id` and `aws_secret_access_key`. ​

## Pipeline

​ As already mentioned, our code is deployed on an Elastic Beanstalk instance. To do so
a [Connection](https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html) is set up, deploying
changes on `master` within seconds using
[AWS CodePipeline](https://aws.amazon.com/codepipeline/). ​

## Database

​ The backend's database is running on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). It is used to cache
information about stocks and companies, enabling us to update analysis of portfolios, even tough we are limited in terms
of calls per minute to our financial APIs.

Sensitive user data is stored encrypted _(not yet for better debugging)_, while passwords are stored hashed. ​

## Authentication

​ The Authentication of users can be viewed at `auth/auth.js`. It uses a generator as well as a secret to generate
a [JSON web token](https://jwt.io/), which has to be passed as a bearer token in the header of requests, that should
only work for signed-in users.

​

## Endpoints

### Stocks

Endpoint | Parameters | Description | Example response
------------- | ------------- | ------------- | -------------
/stocks/list  | country, currency, industry, mc | Returns a stock list according to filter. | [Click](https://api.milou.io/stocks/list?country=USA&currency=USD&industry=Information)
/stocks/search  | id (can be name, ISIN, WKN, symbol of a stock)*** | Returns a stock with given id.*** | [Click](https://api.milou.io/stocks/search?id=software)
/stocks/overview | id (symbol of a stock) | Returns a stock overview with given id. | [Click](https://api.milou.io/stocks/overview?id=IBM)
/stocks/details | id (symbol of a stock) | Returns details of a stock with given id. | [Click](https://api.milou.io/stocks/details?id=MSFT)
/stocks/charts/historic | id (symbol of a stock), max (all data points if true, else only last 5 years) | Get the performance of the stock from beginning or last 5 years. | [Click](https://api.milou.io/stocks/charts/historic?id=AAPL&max=false)
/stocks/charts/key_figures | id (symbol of a stock), max (all data points if true, else only last 5 years) | Get the key figures of the stock from beginning or last 5 years. | [Click](https://api.milou.io/stocks/charts/key_figures?id=MS&max=false)
/stocks/charts/dividend | id (symbol of a stock), max (all data points if true, else only last 5 years) | Get the key figures of the stock from beginning or last 5 years. | [Click](https://api.milou.io/stocks/charts/dividend?id=MSFT&max=true)
/stocks/charts/detailed-analysts | id (symbol of a stock) | Get the analysts recommendation from Benzinga. | [Click](https://api.milou.io/stocks/charts/detailed-analysts?id=AAPL)
/stocks/charts/analysts | id (symbol of a stock) | Get the analysts recommendation from finAPI. | [Click](https://api.milou.io/stocks/charts/analysts?id=IBM)
/stocks/news | id (symbol of a stock) | Returns news list with given stock id. | [Click](https://api.milou.io/stocks/news?id=AAPL)
/stocks/balanceSheet | id (symbol of a stock) | Get balance sheet. | [Click](https://api.milou.io/stocks/balanceSheet?id=MSFT)
/stocks/incomeStatement | id (symbol of a stock) | Get income statement. | [Click](https://api.milou.io/stocks/incomeStatement?id=IBM)
/stocks/cashFlow | id (symbol of a stock) | Get cash flow. | [Click](https://api.milou.io/stocks/cashFlow?id=MSFT)
/stocks/finanzen | id (symbol e.g. dax, sp500) | Get finanzen data. | [Click](https://api.milou.io/stocks/finanzen?id=dax)

​

## Domains

​ The application can be found at:

* [https://milou.io/](https://milou.io/)

Our documentation can be viewed at:

* [https://api.milou.io/api-docs](https://api.milou.io/api-docs)

