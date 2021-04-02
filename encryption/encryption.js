'use strict'

const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

let key;
if (process.env.NODE_ENV == 'development') {
    key = process.env.encryption_key

} else {
    // Load the AWS SDK
    var AWS = require('aws-sdk'),
        region = "eu-central-1",
        secretName = "Encryption",
        secret,
        decodedBinarySecret;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region
    });

    // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    // We rethrow the exception by default.
    client.getSecretValue({SecretId: secretName}, function(err, data) {

        if (err) {
            throw err;
        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
            }
            key = JSON.parse(data.SecretString)["encryption_key"]
        }
    });
}
// adapted from: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb

const encrypt = (text) => {
    let iv = crypto.randomBytes(12);
    let cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ":" + encrypted.toString('hex');
}

const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { encrypt, decrypt }

