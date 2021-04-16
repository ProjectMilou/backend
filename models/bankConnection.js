const mongoose = require('mongoose')

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


const bankConnection = mongoose.model('bankConnection', bankConnectionSchema)

module.exports = bankConnection