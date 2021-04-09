const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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
    confirmed: {
        type: Boolean,
        required: true
    }
});

UserSchema.pre(
    'save',
    async function(next) {
        const user = this;
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = User;