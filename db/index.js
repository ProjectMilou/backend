

const mongoose = require('mongoose');

const connectionString = 'mongodb://mongo:27017';

mongoose
    .connect(connectionString, {useNewUrlParser: true})
    .catch(e => {
        console.log('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db