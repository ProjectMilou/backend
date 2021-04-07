'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const genToken = require('../auth/auth');
const UserModel = require("../models/user");
const UserTokenModel = require ("../models/userToken")
const router = express.Router();

// logout wont be needed, since frontend will delete token for logout and passportjs's encoder specifies the time, in which its token will be valid
/**
 * @swagger
 * /user/register:
 *   post:
 *      description: Registering an account by passing mail and password. Email for confirmation will be sent.
 *      summary: Registering a user
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      consumes:
 *      - application/json
 *      parameters:
 *      - in: body
 *       name: email
 *       required: true
 *       schema:
 *          type: string
 *      - in: body
 *       name: password
 *       requires: true
 *       schema:
 *          type: string
 *      responses:
 *          '200':
 *              description: Accepted. User is now registered, confirm mail.
 *          '404':
 *              description: Not accepted, email already taken.
 *
*/

router.post(
    '/register',
    passport.authenticate('register', { session: false }),
    async (req, res) => {
        res.statusCode = req.user.statusCode
        res.json(req.user.response);
    }
);
/**
 * @swagger
 * /user/confirm:
 *   post:
 *      description: Confirms, that the token is correct, which has been sent to users email address.
 *      summary: Confirmation of email token
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      consumes:
 *      - application/json
 *      parameters:
 *          -in: path
 *              name: token
 *              required: true
 *          -in: path
 *              name:id
 *              required: true
 *      responses:
 *          '200':
 *              description: User is confirmed.
 *          '404':
 *              description: User is not confirmed.
 */

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

/**
* @swagger
* /user/login:
*  post:
*   description: Checks if email and password are correct. sends back a token that needs to be passed in the header of each user-relevant request.
*   summary:
*   tags:
*   - user
*   responses:
*    '200':
*      description: Password accepted.
*    '401':
*      description: Password is not correct or email is not registered.
*/
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
/**
 * @swagger
* /user/profile:
    *  get:
    *   description: Sends back account information about user profile.
*   summary:
*   tags:
    *    - user
*   responses:
*    '200':
*      description: Accepted.
*    '401':
*      description: Unauthorized. Token not valid.
*/
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
/**
 * @swagger
 * /user/forgot:
 *  post:
 *   description: If user has forgotten password, a token will be sent to email, that has to be confirmed.
 *   summary:
 *   tags:
 *    - user
 *   responses:
 *    '202':
 *      description: Email exists, token will be sent.
 *    '401':
 *      description: Not foundMail was not found.
 */
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
/**
 * @swagger
 * /user/reset/confirm:
 *  post:
 *   description: Confirms token that was sent to user-email, when a user has forgotten the password to his account.
 *   summary:
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
 *   summary:
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Token was correct, user-account will be edited as specified.
 *    '404':
 *      description: Not found, Token was not found.
 */
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

/**
 * @swagger
 * /user/delete:
 *  delete:
 *   description: Delete user-account.
 *   summary:
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, user-account will be deleted.
 *    '404':
 *      description: Not found, Token was not found.
 */
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


/**
 * @swagger
 * /user/bank
 * get:
 * description: Adds bank connection
 * summary: Adds bank connection
 * tags:
 *  -user
 *   responses:
 *    '200':
 *      description: .
 *    '404':
 *      description: .
 */
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
 * /user/bank
 * post:
 * description: Adds bank connection
 * summary: Adds bank connection
 * tags:
 *  -user
 *   responses:
 *    '200':
 *      description: Accepted, bank-connection added.
 */
// add a bank
router.post('/bank_connection', (req, res) => {
    res.statusCode = 200;
    res.send("bank added")
});

/**
 * @swagger
 * /user/bank:
 *  delete:
 *   description: bank-connection with id will be deleted.
 *   summary: Bank-connection with id wil be deleted
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