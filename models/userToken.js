const mongoose = require("mongoose");
const {randomToken} = require('../encryption/encryption');

/**
 * @swagger
 * definitions:
 *  userToken:
 *    type: object
 *    properties:
 *      userID:
 *        type: string
 *      token:
 *        type: string
 *      expirationDate:
 *        type: Date
 */

/**
 * @swagger
 * definitions:
 *  token:
 *    type: string
 */

const UserTokenSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    expirationDate: {
        type: Date
    },
    tokenType: {
        type: String,
        enum: ["EMAIL_CONFIRMATION", "PASSWORD_RESET"]
    }
});

// set expiration date in 24 hours.
UserTokenSchema.pre(
    'save',
    async function(next) {
        this.expirationDate = new Date().setDate(new Date().getDate() + 1);
        this.token = await randomToken();
        next();
    }
);

const UserToken = mongoose.model("UserToken", UserTokenSchema);

module.exports = UserToken;