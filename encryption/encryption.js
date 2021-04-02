'use strict'

// adapted from: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb

const crypto = require('crypto');

const key = "testKeyforEnc123testKeyforEnc123";

const encrypt = (text) => {
    let iv = crypto.randomBytes(12);
    let cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ":" + encrypted.toString('hex');
}

const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { encrypt, decrypt }