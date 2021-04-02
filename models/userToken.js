const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: true
    }
});

const UserToken = mongoose.model("UserToken", UserTokenSchema);

module.exports = UserToken;