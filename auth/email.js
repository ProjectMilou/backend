const AWS = require("aws-sdk");

const accessId = process.env.aws_access_id;
const accessKey = process.env.aws_access_key;

const SES_CONFIG = {
  accessKeyId: accessId,
  secretAccessKey: accessKey,
  region: "eu-central-1",
};

//conecting to aws
const AWS_SES = new AWS.SES(SES_CONFIG);

let sendConfirmationEmail = (recipientEmail, id, confirmationCode) => {
  //creating json object with data needed in template
  var templateData = {};
  templateData.id = id;
  templateData.confirmationCode = confirmationCode;
  let params = {
    //setting up parameters for email
    Source: "info@milou.io",
    Template: "EmailConfirmation", //template name saved on aws
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    TemplateData: JSON.stringify(templateData),
  };
  return AWS_SES.sendTemplatedEmail(params).promise();
};

let sendPasswordResetEmail = (recipientEmail, id, name, confirmationCode) => {
  //creating json object with data needed in template
  var templateData = {};
  templateData.name = name;
  templateData.id = id;
  templateData.confirmationCode = confirmationCode;
  let params = {
    //setting up parameters for email
    Source: "info@milou.io",
    Template: "PasswordReset", //template name saved on aws
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    TemplateData: JSON.stringify(templateData),
  };
  return AWS_SES.sendTemplatedEmail(params).promise();
};

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail,
};
