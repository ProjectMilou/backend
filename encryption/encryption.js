'use strict'

const crypto = require('crypto');

// import key from AWS Secret Manager
const key = process.env.encryption_key;

// adapted from: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
const encrypt = (text) => {
    let iv = crypto.randomBytes(12);
    let cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ":" + encrypted.toString('hex');
}

// adapted from: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

const hash = (text) => {
    return crypto.createHash('sha256').update(text).digest("hex");
}

module.exports = { encrypt, decrypt, hash }

