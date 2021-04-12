# Milou-backend
​
This is the repository for the backend which powers [Milou](api.milou.io/api-docs), 
running on an [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) instance on AWS. 
It includes a MongoDB database 
connection and can be interfaced via HTTPS requests. It is also fetching from different 
financial apis such as Alpha Vantage, finnHub and newsAPI to retrieve information/news about stocks and companies.
Furthermore, finAPI is used to enable users to connect their bank-accounts, which allows 
the application to import their real portfolios. Besides that, the analytics team is also integrated, ...`TODO`
​
## Dependencies
​
Among others we use express, swagger, passportJS, fetch and axios, aws-sdk, dotenv and mongoose.
[Express](https://expressjs.com/) is our main backend-application framework. 
We use [Swagger](https://swagger.io/) 3.0 OpenAPI for the documentation of our API.
[PassportJS](http://www.passportjs.org/) is used for user-authorization. 
[Fetch](https://www.npmjs.com/package/node-fetch) is used by the backend application to 
retrieve data from other APIs, the analytics team uses 
[Axios](https://www.npmjs.com/package/axios) to do so.
[Aws-sdk](https://aws.amazon.com/sdk-for-javascript/) and 
[dotenv](https://www.npmjs.com/package/dotenv) are used to access keys and secrets from
[AWS Secret Manager](https://aws.amazon.com/secrets-manager/). 
[Mongoose](https://www.npmjs.com/package/mongoose) is used to access our MongoDB.

You can install our dependencies by running `npm install`.
## Installation
​
```sh
npm i
npm start
```
​
## Credentials
​
In order to connect to AWS and retrieve the secrets (in local development), the application needs 
to get the AWS credentials. 
It looks for them in the file `~/.aws/credentials` on Linux/MacOS and in the file 
`C:\Users\USER_NAME\.aws\credentials`. 
That file must contain `aws_access_key_id` and `aws_secret_access_key`.
​
## Pipeline
​
As already mentioned, our code is deployed on an Elastic Beanstalk instance. 
To do so a [Connection](https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html) is set up, 
deploying changes on `master` within seconds using 
[Codepipeline](https://aws.amazon.com/codepipeline/). 
​
## Database
​
The backends database is running on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 
It is used to cache information and news about stocks and companies, 
enabling us to update analysis of portfolios, even tough we are limited 
in terms of calls per minute to our financial APIs.

Besides that, we store user information safely encrypted using the `aes-256-gcm`. 
Not the user passwords, those are hashed.
​
## Authentication
​
The Authentication of users can be viewed at `auth/auth.js`. It uses a generator as well as a secret to 
generate a [json web token](https://jwt.io/), which has to be passed as a bearer token in the header of 
requests, that should only work for signed in users. 
​
## Domains
​
The application can be found at:
​
* [https://api.milou.io/](https://api.milou.io/)

our documentation can be viewed at:
* [https://api.milou.io/api-docs](https://api.milou.io/api-docs)
