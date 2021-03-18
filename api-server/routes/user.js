'use strict';
const express = require('express');
const router = express.Router();

// register
router.post('/register', (req, res) => {

    // req: { mail, pwd }

    // res:
    // bestetzte email: test@getmilou.de -> 409
    // alle anderen -> 201

});

router.post('/register/confirm', (req, res) => {

    // we generate a uuid and send it to the mail. (8e733aeb-8bf8-485c-92b7-62ca4463db3c)
    // the uuid will be passed back to us in the body of this request (json)

    // case 8e733aeb-8bf8-485c-92b7-62ca4463db3c: 200, body: mail of the assigned user
    // case token not found: 404

});

// login
router.post('/login', (req, res) => {

    // todo: implement the following authorization: http://www.passportjs.org/docs/username-password/
    // req:
    // mail, pwd

    // res:
    // case match (mail: test@getmilou.de, pwd: 123456):
        // JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
        //      eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
        //      SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

    // case (any other): 401

});

// logout wont be needed, since frontend will delete token for logout and passportjs's encoder specifies the time, in which its token will be valid

// profile
router.get('/profile', (req, res) => {
    // todo: implement the following authorization: http://www.passportjs.org/docs/username-password/

    // req: just a token, that needs to be decoded (for testtoken sould work)

    // res: {mail,name,pwd}
    // case testtoken: 200
    // case anyothe: 40*

});

// forgot password
router.post('/forgot', (req, res) => {

    // req: mail

    // res:
        // case mail in db (test@getmilou.de): 200 | send token to mail
        // case anyother: 404


});

router.post('/reset/confirm', (req, res) => {

    // req: body { token: c31d350f-dfdb-4887-b7cf-b69520be26ec, pwd: ***** }

    // res:
        // case 'c31d350f-dfdb-4887-b7cf-b69520be26ec': 200
        // case 'any other': 404

});

// edit profile
router.put('/edit', (req, res) => {
    // todo: implement the following authorization: http://www.passportjs.org/docs/username-password/

    // req: {?firstname, ?lastname}

    // process: update all sent data

    // res: 200

});

// delete profile
router.delete('/profile', (req, res) => {

    // req: token in header

    // res: 200

});

// search for a bank
router.get('/bank', (req,res) => {

    /*
    req:
        query: Searchstring


    res:
        ids, banknames, locations
        mock:
        banks: [{
            id: 277672,
            name: "FinAPI Test Bank",
            location: "DE",
            city: "München",
        }]

     */
})

// add a bank
router.post('/bank_connection', (req, res) => {

});

// delete a bank connection
router.delete('/bank_connection/:id', (req, res) => {

});

module.exports = router
