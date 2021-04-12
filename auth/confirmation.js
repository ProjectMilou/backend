'use strict'

const {sendConfirmationEmail,sendPasswordResetEmail} = require ('./email');
const UserTokenModel = require ('../models/userToken');
const UserModel = require ('../models/user');

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
    await sendConfirmationEmail(userEmail,userId,confirmationToken);
}

const startResetProcess = async (user) => {
    const userId = user._id;
    const userEmail = user.email;

    // delete old tokens, create new one
    await UserTokenModel.deleteMany({userID: userId, tokenType: "PASSWORD_RESET" });
    const userToken = await UserTokenModel.create({
        userID: userId,
        tokenType: "PASSWORD_RESET"
    });
    const confirmationToken = await userToken.token;

    // send email with token
    // await sendPasswordResetEmail(userEmail,userId,confirmationToken);
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

const endResetProcess = async (user, token) => {

}

module.exports = {
    startConfirmationProcess,
    startResetProcess,
    endConfirmationProcess
}