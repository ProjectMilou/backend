const dotenv = require('dotenv');
dotenv.config();

module.exports = async () => {
    if (process.env.NODE_ENV === 'development') {
        // secrets are stored in 'process.env.(secret_name)'
    } else {

        // Load the AWS SDK
        let AWS = require('aws-sdk'),
            region = "eu-central-1",
            secretName = "backend-secrets",
            secret,
            decodedBinarySecret;

        // Create a Secrets Manager client
        let client = new AWS.SecretsManager({
            region: region
        });

        let secrets;
        return await client.getSecretValue({SecretId: secretName}, function (err, data) {
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

                // secrets will be stored in 'process.env.(secret_name)'
                secrets = JSON.parse(data.SecretString);
                process.env.db_admin_pw = secrets.db_admin_pw;
                process.env.finAPI_client_id = secrets.finAPI_client_id;
                process.env.finAPI_client_secret = secrets.finAPI_client_secret;
                process.env.auth_jwt_secret = secrets.auth_jwt_secret;
                process.env.alpha_ventage_key = secrets.alpha_ventage_key;
                process.env.finnhub_key = secrets.finnhub_key;
                process.env.aws_access_id = secrets.aws_access_id;
            }
        }).promise().then();
    }
}
