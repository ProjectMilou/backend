'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const genToken = require('../auth/auth');
const UserModel = require("../models/user");
const UserTokenModel = require ("../models/userToken")

const router = express.Router();

// logout wont be needed, since frontend will delete token for logout and passportjs's encoder specifies the time, in which its token will be valid

router.post(
    '/register',
    passport.authenticate('register', { session: false }),
    async (req, res) => {
        res.statusCode = req.user.statusCode
        res.json(req.user.response);
    }
);

// todo fix in swagger !
router.post('/confirm/:id/:token', async (req, res) => {

    const token = req.params.token;
    const id = req.params.id;

    try{
        const userToken = await UserTokenModel.findOne({userID: id})
        if(userToken.expirationDate < Date.now()) {
            res.status(404).send("token has already expired")
        } else if(userToken.token !== token){
            res.send("failed");
        } else {
            await UserModel.updateOne({_id: id}, {confirmed: true})
            await UserTokenModel.deleteOne({userID: id})
            res.status(200).send("account successfully confirmed");
        }
    } catch(err) {
        res.status(404).send("failed");
    }

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

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        return res.status(400).json({
                            // todo: should be specified if wrong pwd or wrong mail ???
                            message: info.message
                        });
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = {id: user._id};
                            const token = genToken(body); //jwt.sign({ user: body }, 'TOP_SECRET');

                            return res.json({
                                user: {
                                    email: user.email,
                                    lastName: user.lastName,
                                    firstName: user.firstName,
                                    confirmed: user.confirmed
                                },
                                token: token
                            });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

// profile
router.get('/profile', passport.authenticate('jwt',{session: false}), async (req, res) => {
    // http://www.passportjs.org/docs/username-password/

    // request just contains an JWT token in its header, that will be checked by passport automaticaly. If unathorized, 401 will be sent back.
    try{
        res.json({
            user : {
                email: req.user.email,
                lastName: req.user.lastName,
                firstName: req.user.firstName,
                confirmed: req.user.confirmed
            }
        });
    } catch(err){
        console.log(err);
        res.json("error occured");
    }

});

// forgot password
router.post('/forgot', async (req, res) => {

    // if user exists: send token to mail and store it at userTokens
    if(await UserModel.exists({email: req.body.email})){
        res.status(202).json({message: "confirm your email to proceed"});

        // todo generate token, store in userTokenSchema and send it to email

    }

    // if user does not exist: 404
    else{
        res.status(404).json({message: "mail not found"});
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
router.put('/edit', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/
    // req: {?firstname, ?lastname}
    // todo extra token authentication via mail needed?

    let changes = {};
    if(req.body.firstName){
        changes.firstName = req.body.firstName;
    }
    if(req.body.lastName){
        changes.lastName = req.body.lastName;
    }

    try{
        await UserModel.updateOne({_id: req.user.id},changes,null);
        const user = await UserModel.findOne({_id: req.user.id});
        res.json({user: {
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                confirmed: user.confirmed
            }});
    } catch(err){
        console.log(err);
        res.json("error occured");
    }
});


// delete profile
router.delete('/profile', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/
    // req: token in header

    // todo extra token authentication via mail needed?
    // todo: delete user from finAPI
    // todo: delete portfolios

    try{
        const user = await UserModel.findOne({_id: req.user.id});
        await UserModel.deleteOne({_id: req.user.id});
        await UserTokenModel.deleteMany({email: user.email});
        res.json("successfully deleted user").status(200);
    } catch(err){
        console.log(err);
        res.json("error occured");
    }
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