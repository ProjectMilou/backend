const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');//https://mongoosejs.com/docs/index.html
mongoose.set('useFindAndModify', false);

// access pwd from AWS Secret Manager
let pwd = process.env.db_admin_pw
let url = "mongodb+srv://admin:" + pwd + "@miloucluster.q8dhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

/*

if (process.env.NODE_ENV == 'development') {
    pwd = process.env.db_admin_pw
    url = "mongodb+srv://admin:" + pwd + "@miloucluster.q8dhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
    // Load the AWS SDK
    var AWS = require('aws-sdk'),
        region = "eu-central-1",
        secretName = "Database",
        secret,
        decodedBinarySecret;


    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region
    });

    // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    // We rethrow the exception by default.
    var pwd;
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
        if (err) {
            throw err;
        }

        else {
            if ('SecretString' in data) {
                secret = data.SecretString;
                console.log(data)
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
                console.log(decodedBinarySecret)
            }
            pwd = JSON.parse(data.SecretString)["db-admin-pw"]
        }
        console.log(pwd)
        // Your code goes here. 


        // mongodb+srv://<username>:<password>@miloucluster.q8dhp.mongodb.net/<databaseName>?retryWrites=true&w=majority
        url = "mongodb+srv://admin:" + pwd + "@miloucluster.q8dhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    })
}
 */