'use strict'

const crypto = require('crypto');

const hash = (text) => {
    return crypto.createHash('sha256').update(text).digest("hex");
}

const randomToken = () => {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = { hash, randomToken }

