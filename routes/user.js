'use strict';
const express = require('express');
const passport = require('passport');
const genToken= require('../auth/auth');


const router = express.Router();


/**
 * @swagger
 * /user/register:
 *  post:
 *   description: Register a new user by passing the users email and password.
 *   tags:
 *    - user
 *   responses:
 *    '201':
 *      description: Users email was accepted, an email with the an registration token will be sent to the users email.
 *    '409':
 *      description: Users email was rejected because the email was already taken.
 */

router.post('/register', async (req, res) => {

    // req: { email, pwd }

    // already used email: test@getmilou.de -> 409
    if(req.body.email === "test@getmilou.de") {
        res.statusCode = 409;
        res.json({
            message: 'Signup failed - mail has got an account already'
        });
    }

    // any other mail -> 201
    else {
        res.statusCode = 201;
        res.json({
            message: 'Signup success'
        });
    }
});


/**
 * @swagger
 * /user/register:
 *  post:
 *   description: Confirms, that the token is correct, which has been sent to users email address.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was accepted. Users account is now registered.
 *    '404':
 *      description: Token was not accepted.
 */

router.post('/register/confirm', (req, res) => {

    // we generate a uuid and send it to the mail. (8e733aeb-8bf8-485c-92b7-62ca4463db3c)
    // the uuid will be passed back to us in the body of this request (json)
    if(req.body.uuid === "8e733aeb-8bf8-485c-92b7-62ca4463db3c") {
        res.statusCode = 200;
        res.json({
            message: 'mail confirmed'
        });
    }

    // case 8e733aeb-8bf8-485c-92b7-62ca4463db3c: 200, body: mail of the assigned user
    // case token not found: 404
    else {
        res.statusCode = 404;
        res.json({
            message: 'failed'
        });
    }
});

/**
 * @swagger
 * /user/login:
 *  post:
 *   description: Checks if email and password are correct. sends back a token that needs to be passed in the header of each user-relevant request.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Password accepted.
 *    '401':
 *      description: Password is not correct or email is not registered.
 */

// login
router.post('/login',async (req, res, next) => {
    // documentation: http://www.passportjs.org/docs/username-password/

    // request contains mail and password, the lib is used to authentificate and generate a JWT token.

    // res:
    // case match (mail: test@getmilou.de, pwd: 123456):

    // case (any other): 401
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = genToken(user);
            return res.json({user, token});
        });
    })(req, res);
});

// todo logout is needed! what if the user decides to log out?
// logout wont be needed, since frontend will delete token for logout and passportjs's encoder specifies the time, in which its token will be valid

/**
 * @swagger
 * /user/profile:
 *  get:
 *   description: Sends back account information about user profile.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted.
 *    '401':
 *      description: Unauthorized. Token not valid.
 */

// profile
router.get('/profile', passport.authenticate('jwt',{session: false}),  (req, res) => {
    // http://www.passportjs.org/docs/username-password/

    // request just contains an JWT token in its header, that will be checked by passport automaticaly. If unathorized, 401 will be sent back.
    res.json({firstName:'test',user: req.user});
});

/**
 * @swagger
 * /user/forgot:
 *  post:
 *   description: If user has forgotten password, a token will be sent to email, that has to be confirmed.
 *   tags:
 *    - user
 *   responses:
 *    '202':
 *      description: Email exists, token will be sent.
 *    '401':
 *      description: Not foundMail was not found.
 */

// forgot password
router.post('/forgot', (req, res) => {

    // req: mail
    // case mail in db (test@getmilou.de): 200 | send token to mail
    if(req.body.email === "test@getmilou.de") {
        res.statusCode = 404;
        res.json({
            message: 'mail not found'
        });
    }

    // case anyother: 404
    else {
        res.statusCode = 202;
        res.json({
            message: 'token sent to mail'
        });
    }
});

/**
 * @swagger
 * /user/reset/confirm:
 *  post:
 *   description: Confirms token that was sent to user-email, when a user has forgotten the password to his account.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was correct, password can now be reset.
 *    '404':
 *      description: Not found. Token was not found.
 */

router.post('/reset/confirm', (req, res) => {

    // req: body { token: c31d350f-dfdb-4887-b7cf-b69520be26ec, pwd: ***** }

    // we generate a uuid and send it to the mail. (c31d350f-dfdb-4887-b7cf-b69520be26ec)
    // the uuid will be passed back to us in the body of this request (json)
    if(req.body.uuid === "8e733aeb-8bf8-485c-92b7-62ca4463db3c") {
        res.statusCode = 200;
        res.json({
            message: 'mail confirmed'
        });
    }

    // case 8e733aeb-8bf8-485c-92b7-62ca4463db3c: 200, body: mail of the assigned user
    // case token not found: 404
    else {
        res.statusCode = 404;
        res.json({
            message: 'failed'
        });
    }
});

// edit profile

/**
 * @swagger
 * /user/edit:
 *  put:
 *   description: Edit user account information.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was correct, user-account will be edited as specified.
 *    '404':
 *      description: Not found, Token was not found.
 */

// fixme: passport option {session = true or false} ?
router.put('/edit', passport.authenticate('jwt', {session: false}),  (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/

    // req: {?firstname, ?lastname}

    // process: update all sent data

    // res: 200
    res.statusCode = 200;
    res.send("edited");
});

/**
 * @swagger
 * /user/delete:
 *  delete:
 *   description: Delete user-account.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, user-account will be deleted.
 *    '404':
 *      description: Not found, Token was not found.
 */

// delete profile
router.delete('/profile', passport.authenticate('jwt', {session: false}),  (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/
    // req: token in header

    // res: 200
    res.send("deleted");
});

/**
 * @swagger
 * /user/bank -------- fixme should to be accessed from portfolio, not from user -------- :
 *  get:
 *   description: Sends back banks, that fit the passed String.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted.
 */

// todo should to be accessed from portfolio, not from user.

// search for a bank
router.get('/bank', (req,res) => {

//    req: query: Searchstring

    res.statusCode = 200;
    res.json({
        banks: [{
            id: 277672,
            name: "FinAPI Test Bank",
            location: "DE",
            city: "München",
        }]
    });
})

/**
 * @swagger
 * /user/bank -------- fixme should to be accessed from portfolio, not from user -------- :
 *  post:
 *   description: adds a bank-connection.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, bank-connection added.
 *    '404':
 *      description: Rejected, Token was not found.
 */

// add a bank
router.post('/bank_connection', (req, res) => {
    res.statusCode = 200;
    res.send("bank added")
});

/**
 * @swagger
 * /user/bank -------- fixme should to be accessed from portfolio, not from user -------- :
 *  delete:
 *   description: bank-connection with id will be deleted.
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, bank-connection deleted.
 */

// delete a bank connection
router.delete('/bank_connection/:id', (req, res) => {
    res.statusCode = 200;
    res.send("bank deleted");
});

module.exports = router
