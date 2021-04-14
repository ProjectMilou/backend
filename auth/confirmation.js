'use strict'

const {sendConfirmationEmail,sendPasswordResetEmail} = require ('./email');
const UserTokenModel = require ('../models/userToken');
const UserModel = require ('../models/user');
const {randomToken} = require('../encryption/encryption');

const startConfirmationProcess = async (user) => {
    const userId = user._id;
    const userEmail = user.email;

    // delete old tokens, create new one
    await UserTokenModel.deleteMany({userID: userId, tokenType: "EMAIL_CONFIRMATION" });
    const userToken = await UserTokenModel.create({
        userID: userId,
        tokenType: "EMAIL_CONFIRMATION"
    });

    const confirmationToken = await userToken.token;

    // send email with token
    // await sendConfirmationEmail(userEmail,userId,confirmationToken);
}

const startResetProcess = async (email) => {
    const user = await UserModel.findOne({email: email});

    if(user === null) {
        return false;
    }

    const userId = user._id;
    const userName = user.firstName + " " + user.lastName;

    // delete old tokens, create new one
    await UserTokenModel.deleteMany({userID: userId, tokenType: "PASSWORD_RESET" });
    const userToken = await UserTokenModel.create({
        userID: userId,
        tokenType: "PASSWORD_RESET"
    });
    const confirmationToken = await userToken.token;

    // send email with token
    // await sendPasswordResetEmail(email,userId,userName,confirmationToken);
    return true;
}

const endConfirmationProcess = async (id, token) => {
    const userId = id;
    const databaseToken = await UserTokenModel.findOne({userID:userId, token: token, tokenType: "EMAIL_CONFIRMATION"})

    // token exisits
    if(databaseToken !== null){
        // token valid
        if(databaseToken.expirationDate > new Date().getTime()){
            await UserModel.updateOne({_id: userId},{confirmed: true},null);
            await UserTokenModel.deleteMany({userID:userId, tokenType: "EMAIL_CONFIRMATION"})
            return true
        }

        // token expired
        else {
            await UserTokenModel.deleteOne({userID:userId, tokenType: "EMAIL_CONFIRMATION"})
            return false
        }
    }

    // token does not exist
    else {
        return false
    }
}

// middle call between forgot and change -> confirm
const resetConfirm = async (id, token) => {

    const userToken = await UserTokenModel.findOne({userID: id, tokenType: "PASSWORD_RESET"})
    if(userToken === null)
        return false;
    else if(userToken.token !== token)
        return false;
    else if(userToken.expirationDate < new Date().getTime())
        return false;
    else {
        const newToken = await randomToken();
        await UserTokenModel.updateOne({userID: id, tokenType: "PASSWORD_RESET"}, {token: newToken}, null);
        return {token: newToken};
    }
}

const endResetProcess = async (id, token) => {

    const databaseToken = await UserTokenModel.findOne({userID:id, token: token, tokenType: "PASSWORD_RESET"})

    if(databaseToken === null)
        return false;
    else if (databaseToken.expirationDate < new Date().getTime())
        return false;
    else {
        await UserTokenModel.deleteMany({userID:id, tokenType: "PASSWORD_RESET"});
        return true;
    }
}

module.exports = {
    startConfirmationProcess,
    startResetProcess,
    endConfirmationProcess,
    resetConfirm,
    endResetProcess
}