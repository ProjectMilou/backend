const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
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

const User = mongoose.model("User", UserSchema);

module.exports = User;