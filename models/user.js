const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// adapted from https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

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