const dotenv = require('dotenv');
dotenv.config();


class Secret{

    constructor(){
        this.secret = {}
    }

    setSecret(secret) {
        this.secret = secret;
    }

    getSecret(){
        return this.secret;
    }
}




module.exports
function getSecrets(myScret) {
    if (process.env.NODE_ENV === 'development') {
        return {
            db_admin_pw: process.env.db_admin_pw,
            finAPI_client_id: process.env.finAPI_client_id,
            finAPI_client_secret: process.env.finAPI_client_secret,
            auth_jwt_secret: process.env.auth_jwt_secret,
            alpha_ventage_key: process.env.alpha_ventage_key,
            finnhub_key: process.env.finnhub_key,
            aws_access_id: process.env.aws_access_id
        }
    } else {

        // Load the AWS SDK
        var AWS = require('aws-sdk'),
            region = "eu-central-1",
            secretName = "backend-secrets",
            secret,
            decodedBinarySecret;

        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({
            region: region
        });

        var secrets;
        client.getSecretValue({SecretId: secretName}, function (err, data) {
            if (err) {
                if (err.code === 'DecryptionFailureException')
                    // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InternalServiceErrorException')
                    // An error occurred on the server side.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InvalidParameterException')
                    // You provided an invalid value for a parameter.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InvalidRequestException')
                    // You provided a parameter value that is not valid for the current state of the resource.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'ResourceNotFoundException')
                    // We can't find the resource that you asked for.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
            } else {

                if ('SecretString' in data) {
                    secret = data.SecretString;
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                }

                myScret.setSecret(JSON.parse(data.SecretString));
                console.log(secrets);
            }
        });
    }
}
