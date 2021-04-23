const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');

const encKey = process.env.encryption_32byte_base64;
const sigKey = process.env.encryption_64byte_base64;

const bankConnectionSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    bankConnections: [{
        bankConnectionId: String,
        name: String,
        accountIds: Array,
        modified: String,
        created: String
    }]
});

bankConnectionSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

const bankConnection = mongoose.model('bankConnection', bankConnectionSchema)

module.exports = bankConnection