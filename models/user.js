const mongoose = require("mongoose");
const { hash } = require('../encryption/encryption');
const fetch = require('node-fetch');
const encrypt = require('mongoose-encryption');

const encKey = process.env.encryption_32byte_base64;
const sigKey = process.env.encryption_64byte_base64;

// adapted from https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

/**
 *  @swagger
 *  definitions:
 *          User:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *              properties:
 *                  _id:
 *                      type: integer
 *                      description: The auto-generated id of the User (not available to frontend)
 *                  email:
 *                      type: string
 *                      description: The email of the user.
 *                  lastName:
 *                      type: string
 *                      description: The last name of the user.
 *                  firstName:
 *                      type: string
 *                      description: The first name of the user.
 *                  password:
 *                      type: string
 *                      description: The hashed password of the user. (not available to frontend)
 *                  confirmed:
 *                      type: boolean
 *                      description: Has the user verified his email?
 *              example:
 *                  email: test@getmilou.de
 *                  lastName: Testus
 *                  firstName: Maximus
 *                  confirmed: true
 */

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    finUserId: {
        type: String,
        required: false,
    },
    finUserPassword: {
        type: String,
        required: false
    },
    confirmed: {
        type: Boolean,
        required: true
    }
});

UserSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

// store hash of password
// store finUserId
// store finUserPassword
UserSchema.pre(
    'save',
    async function(next) {
        // store hash of password in database
        this.password = await hash(this.password);

        // Creating a new user @finAPI and storing its credentials in our database.
        const finCredential = await createFinAPIUser();
        this.finUserId = finCredential.finUserId;
        this.finUserPassword = finCredential.finUserPassword;

        next();
    }
);

const createFinAPIUser = async() => {
    const access_token = await getClientAccessToken();

    // adjust url for user-creation
    const api_url = `https://sandbox.finapi.io/api/v1/users`;
    const api_response = await fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': access_token
        }
    });

    const json_response = await api_response.json();

    return {
        finUserId: json_response.id,
        finUserPassword: json_response.password
    };
}

const getClientAccessToken = async() => {
    const body = new URLSearchParams({
        'grant_type': "client_credentials",
        'client_id': process.env.finAPI_client_id,
        'client_secret': process.env.finAPI_client_secret,
    });
    return await getAccessToken(body);
}

const getAccessToken = async(body) => {
    let api_url = 'https://sandbox.finapi.io/oauth/token';

    // login as client, get access token
    let api_response = await fetch(api_url, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // extract access_token
    let json_response = await api_response.json();
    return 'Bearer ' + json_response['access_token']
}

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    return (await hash(password) === user.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = User;