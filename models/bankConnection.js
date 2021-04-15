const mongoose = require('mongoose')

const bankConnectionSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    userId: mongoose.ObjectId,
    bankConnections: [{
        bankConnectionId: {
            type: String,
        },
        accountIds: Array,
        modified: Number
    }]
});


const bankConnection = mongoose.model('bankConnection', bankConnectionSchema)

module.exports = bankConnection