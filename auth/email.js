const AWS = require('aws-sdk')

const accessId = process.env.aws_access_id;
const accessKey = process.env.aws_access_key;

const SES_CONFIG = {
    accessKeyId : accessId,
    secretAccessKey: accessKey,
    region:'eu-central-1'
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let  sendConfirmationEmail =  (recipientEmail,id, confirmationCode) =>{
    //TODO: set up params
    let params = {
        Source: 'info@milou.io',
        Template:'ExampleTemplate',
        Destination:{
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        TemplateData:'{\"id\":${id}}'
        /*
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: '<h1>Email Confirmation</h1>' +
                        '<h2> Hello !</h2>' +
                        '<p> Thank you for registration. Please confirm your email by clicking on the following link</p>' +
                        '<a href="http://milou.io/confirm/${id}/${confirmationCode}"> Click here</a>',
                },
            },
            Subject:{
                Charset: 'UTF-8',
                Data: 'confirmation',
            }
        },*/
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
}

let sendPasswordResetEmail = (recipientEmail, id,name, confirmationCode) =>{
    let params = {
        Source: 'info@milou.io',
        Destination :{
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {

        }

    };
    return AWS_SES.sendEmail(params).promise();
}

module.exports = {
    sendConfirmationEmail,
};