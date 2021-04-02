'use strict';
const express = require('express');
const passport = require('passport');
const genToken = require('../auth/auth');
const {encrypt, decrypt, hash} = require('../encryption/encryption');
const userModel = require("../models/user");
const userTokenModel = require("../models/userToken");
const User = require("../models/user");
const router = express.Router();

router.post('/register', async (req, res) => {

    // is mail already registered?
    if(await userModel.exists({email: req.body.email})){
        res.statusCode = 409;
        res.json({
            message: 'Signup failed - mail has got an account already'
        });
    }

    // create account with mail and hash, (todo) send a mail with token or url
    else {
        await userModel.create({
            email: req.body.email,
            lastName: "",
            firstName: "",
            password: hash(req.body.password),
            confirmed: false
        });
        res.statusCode = 201;

        // todo: send mail with confirmation token

        res.statusCode = 201;
        res.json({
            message: 'Signup success - token sent to mail'
        });
    }

    /*
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
     */
});

router.post('/register/confirm', (req, res) => {

    // get token from db




    /*
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
     */
});



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



// profile
router.get('/profile', passport.authenticate('jwt',{session: false}),  (req, res) => {
    // http://www.passportjs.org/docs/username-password/

    // request just contains an JWT token in its header, that will be checked by passport automaticaly. If unathorized, 401 will be sent back.
    res.json({firstName:'test',user: req.user});
});



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



// fixme: passport option {session = true or false} ?
router.put('/edit', passport.authenticate('jwt', {session: false}),  (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/

    // req: {?firstname, ?lastname}

    // process: update all sent data

    // res: 200
    res.statusCode = 200;
    res.send("edited");
});



// delete profile
router.delete('/profile', passport.authenticate('jwt', {session: false}),  (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/
    // req: token in header

    // res: 200
    res.send("deleted");
});



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

// add a bank
router.post('/bank_connection', (req, res) => {
    res.statusCode = 200;
    res.send("bank added")
});


// delete a bank connection
router.delete('/bank_connection/:id', (req, res) => {
    res.statusCode = 200;
    res.send("bank deleted");
});



module.exports = router