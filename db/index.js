/*
const mongoose = require('mongoose');//https://mongoosejs.com/docs/index.html

const execute = () => {

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

        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
                console.log(data)
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
                console.log(decodedBinarySecret)
            }
        }
        pwd = JSON.parse(data.SecretString)["db-admin-pw"]
        console.log(pwd)
        // Your code goes here. 


        // mongodb+srv://<username>:<password>@miloucluster.q8dhp.mongodb.net/<databaseName>?retryWrites=true&w=majority
        var url = "mongodb+srv://admin:" + pwd + "@miloucluster.q8dhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        console.log(url);

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'db connection error:'));


        db.once('open', function () {
            console.log("connection to MongoDB successful");
            const stockSchema = new mongoose.Schema({
                isin: String,
                symbol: String
            });
            const Stock = mongoose.model('Stock', stockSchema);

            const gme = new Stock({
                isin: "US36467W1456",
                symbol: "DEF"
            })
            gme.save(
                function (err, gme) {
                    if (err) return console.error(err);
                    else console.log("stock saved successfully")
                }
            )
        });
    });
}

module.exports.execute = execute
modlue.exports.db = db


*/


const mongoose = require('mongoose');//https://mongoosejs.com/docs/index.html

module.exports = function( app ) {

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

        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
                console.log(data)
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
                console.log(decodedBinarySecret)
            }
        }
        pwd = JSON.parse(data.SecretString)["db-admin-pw"]
        console.log(pwd)
        // Your code goes here. 


        // mongodb+srv://<username>:<password>@miloucluster.q8dhp.mongodb.net/<databaseName>?retryWrites=true&w=majority
        var url = "mongodb+srv://admin:" + pwd + "@miloucluster.q8dhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        console.log(url);

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        app.set( "mongoose", mongoose );
    })
}