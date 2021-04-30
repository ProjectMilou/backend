const mongoose = require("mongoose");
const { encrypt, decrypt, hash } = require("../encryption/encryption");
const fetch = require("node-fetch");
const { createFinAPIUser } = require("./finAPI");
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
    unique: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  finUserId: {
    type: String,
    required: false,
  },
  finUserPassword: {
    type: String,
    required: false,
  },
  confirmed: {
    type: Boolean,
    required: true,
  },
});

// store hash of password
// store finUserId
// store finUserPassword
UserSchema.pre("save", async function (next) {
  // store hash of password in database
  this.password = await hash(this.password);

  // Creating a new user @finAPI and storing its credentials in our database.
  const finCredential = await createFinAPIUser();

  this.finUserId = finCredential.finUserId;
  this.finUserPassword = finCredential.finUserPassword;

  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  return (await hash(password)) === user.password;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
