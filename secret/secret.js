const dotenv = require('dotenv');
dotenv.config();

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

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

const getSecrets = () => {
    let secrets = {
        "db_admin_pw": "",
        "finAPI_client_id": "",
        "finAPI_client_secret": "",
        "auth_jwt_secret": "",
        "alpha_ventage_key": "",
        "finnhub_key": "",
        "aws_access_id": ""
    };
    if (process.env.NODE_ENV == 'development') {
        secrets.db_admin_pw = process.env.db_admin_pw;
        secrets.finAPI_client_id = process.env.finAPI_client_id;
        secrets.finAPI_client_secret = process.env.finAPI_client_secret;
        secrets.auth_jwt_secret = process.env.auth_jwt_secret;
        secrets.alpha_ventage_key = process.env.alpha_ventage_key;
        secrets.finnhub_key = process.env.finnhub_key;
        secrets.aws_access_id = process.env.aws_access_id;
    } else {
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
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    secret = data.SecretString;
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                }
                secrets.db_admin_pw = JSON.parse(data.SecretString).db_admin_pw;
                secrets.finAPI_client_id = JSON.parse(data.SecretString).finAPI_client_id;
                secrets.finAPI_client_secret = JSON.parse(data.SecretString).finAPI_client_secret;
                secrets.auth_jwt_secret = JSON.parse(data.SecretString).auth_jwt_secret;
                secrets.alpha_ventage_key = JSON.parse(data.SecretString).alpha_ventage_key;
                secrets.finnhub_key = JSON.parse(data.SecretString).finnhub_key;
                secrets.aws_access_id = JSON.parse(data.SecretString).aws_access_id;
            }
        });
    }
    return secrets;
}

exports.secret = getSecrets();