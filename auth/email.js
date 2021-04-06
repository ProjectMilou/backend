const AWS = require('aws-sdk')

//TODO: SET UP KEYS
const SES_CONFIG = {
    accessKeyId : '',
    secretAccessKey: '',
    region:'eu-central-1'
};

const AWS_SES = new AWS.SES(SES_CONFIG);

function sendConfirmationEmail (recipientEmail,id, confirmationCode){
    //TODO: set up params
    let params = {
        Source: 'info@milou.de',
        Destination:{
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: '<h1>Email Confirmation</h1>' +
                        '<h2> Hello !</h2>' +
                        '<p> Thank you for registration. Please confirm your email by clicking on the following link</p>' +
                        '<a href=" = http://milou.io/confirm/${id}/${confirmationCode}"> Click here</a>',
                }
            }
        },
    };
    return AWS_SES.sendEmail(params).promise();
}

module.exports = {
    sendConfirmationEmail,
};