const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date
    }
});

// set expiration date in 24 hours.
UserTokenSchema.pre(
    'save',
    async function(next) {
        this.expirationDate = new Date().setDate(new Date().getDate() + 1)
        next();
    }
);

const UserToken = mongoose.model("UserToken", UserTokenSchema);

module.exports = UserToken;