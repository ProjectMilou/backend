'use strict';
const express = require('express');
const passport = require('passport');
const genToken = require('../auth/auth');
const UserModel = require("../models/user");
const UserTokenModel = require ("../models/userToken")
const {hash, encrypt, decrypt} = require("../encryption/encryption");

const router = express.Router();

// logout not required, frontend will delete token for logout.

/**
 * @swagger
 * /user/register:
 *   post:
 *     description: Registering an account by passing mail and password. Email for confirmation will be sent.
 *     summary: Registering a user
 *     tags:
 *     - user
 *     produces:
 *     - application/json
 *     consumes:
 *     - application/json
 *     parameters:
 *       - in: body
 *         name: userInformation
 *         description: Register information of the user.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             email: test@milou.de
 *             password: "123456"
 *     responses:
 *       200:
 *          description: Accepted. User is now registered, confirm mail.
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *              example:
 *                  message: Signup success
 *       404:
 *          description: Failed. Email is already taken.
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *              example:
 *                  message: Signup failed - mail has got an account already
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
 * /user/confirm/:id/:token:
 *   post:
 *     description: Confirms, that the token is correct, which has been sent to users email address.
 *     summary: Confirmation of email token
 *     tags:
 *     - user
 *     parameters:
 *     - in: path
 *       name: token
 *       required: true
 *     - in: path
 *       name: id
 *       required: true
 *     responses:
 *       200:
 *          description: Accepted.
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *              example:
 *                  message: Success
 *       404:
 *          description: Failed.
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *              example:
 *                  message: Failed
 */

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
});

/**
 * @swagger
 * /user/login:
 *  post:
 *    description: Checks if email and password are correct. sends back a token that needs to be passed in the header of each user-relevant request.
 *    summary:
 *    tags:
 *    - user
 *    parameters:
 *       - in: body
 *         name: userInformation
 *         description: Login information of the user.
 *         schema:
 *           type: object
 *           required:
 *            - email
 *            - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             email: test@milou.de
 *             password: "123456"
 *    responses:
 *     200:
 *       description: Password accepted.
 *       schema:
 *          type: object
 *          properties:
 *              user:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      firstName:
 *                          type: string
 *                      confirmed:
 *                          type: boolean
 *              token:
 *                  type: string
 *          example:
 *              user:
 *                  email: test@getmilou.de
 *                  lastName: Homer
 *                  firstName: Simpson
 *                  confirmed: true
 *              token: eyJhbGciOi.I4MDQyYyIsImlhdCI6MTYx4fQ.kBdmHLKaAn8
 *
 *     401:
 *       description: Password is not correct or email is not registered.
 *       schema:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *          example:
 *              message: Wrong Password
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
 *   get:
 *     description: Sends back account information about user profile. Pass the JWT Token received from login as a Bearer-token in the header.
 *     summary: returns user profile
 *     tags:
 *      - user
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Token accepted. User information returned.
 *         schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  firstName:
 *                      type: string
 *                  confirmed:
 *                      type: boolean
 *              example:
 *                  email: test@getmilou.de
 *                  lastName: Testus
 *                  firstName: Maximus
 *                  confirmed: true
 *       '401':
 *         description: Unauthorized. Token not valid.
 *         schema:
 *              type: string
 *              example: Unauthorized
 */
// profile
router.get('/profile', passport.authenticate('jwt',{session: false}), async (req, res) => {
    // http://www.passportjs.org/docs/username-password/
    // request just contains an JWT token in its header, that will be checked by passport automaticaly. If unathorized, 401 will be sent back.
    try{
        res.json({
                email: req.user.email,
                lastName: req.user.lastName,
                firstName: req.user.firstName,
                confirmed: req.user.confirmed
        });
    } catch(err){
        console.log(err);
        res.json("error occured");
    }
});

/**
 * @swagger
 *  /user/reset/forgot:
 *      post:
 *          description: User has forgotten password. A token will be generated, put in a link (as parameter) and sent to users email.
 *          summary: starts reset process for forgotten passwords.
 *          tags:
 *            - user
 *          parameters:
 *            - in: body
 *              name: email
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                  example:
 *                      email: test@getmilou.de
 *          produces:
 *            - application/json
 *          consumes:
 *            - application/json
 *          responses:
 *              201:
 *                  description: OK, token sent.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: Reset link was sent to email.
 *              404:
 *                  description: Specified email not found.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: Specified email not found.
 */
router.post('/reset/forgot', async (req, res) => {

    // if user exists: send token to mail and store it at userTokens
    if(await UserModel.exists({email: req.body.email})){


        // todo generate token
        // todo safe in UserTokenModel -> specify type = "PASSWORD_RESET"
        // todo send email
        res.status(201).json({message: "Reset link was sent to email."});
    }

    // if user does not exist: 404
    else{
        res.status(404).json({message: "Specified email not found."});
    }
});

/**
 * @swagger
 *  /user/reset/confirm/:id/:token:
 *      post:
 *          summary: confirms a user, who forgot the password
 *          description: Will only be called by user via a link, that he received in an email.
 *                       It Redirects the user to a page, that allows password change.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: id
 *              type: string
 *            - in: path
 *              name: resetToken
 *              type: string
 *      response:
 *          200:
 *              description: todo! Redirect to frontend
 *          404:
 *              description: User not found or Token invalid or Token expired.
 *              schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: Invalid user, token, or token was used already
 */
router.post('/reset/confirm/:id/:token', async (req, res) => {

    const reqUserId = req.params.id;
    const reqToken = req.params.token;

    const userToken = await UserTokenModel.find({userID : reqUserId, token : reqToken, tokenType : "PASSWORD_RESET"});

    // todo specify further
    if (userToken === null){
        res.status(404).json({message: "Invalid user, token, or token was used already"})
    }

    // todo what statusCode would be appropriate?
    else if(userToken.expirationDate < new Date.now()){
        res.status(400).json({message: "link expired"})
    }

    // todo set token!
    // todo redirect to frontend
    else {
        res.redirect("")
    }
});

/**
 * @swagger
 *  /user/reset/change/:id/:token:
 *      post:
 *          summary: confirmed user changes password
 *          description:
 *              Final call of the password reset process. id and token used for authentication.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          consumes:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: id
 *              type: string
 *            - in: path
 *              name: resetToken
 *              type: string
 *            - in: body
 *              name: password
 *              schema:
 *                  type: object
 *                  properties:
 *                      password:
 *                          type: string
 *                  example:
 *                      password: 654321
 *          responses:
 *              201:
 *                  description: OK. password was reset.
 *              404:
 *                  description: User not found.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: User not found.
 *              400:
 *                  description: todo! what statusCode in this case? Token invalid
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: Token invalid.
 */
router.post('/reset/change/:id/:token', async (req, res) => {

    const reqUserId = req.params.id;
    const reqToken = req.params.token;

    const userToken = await UserTokenModel.findOne({userID : reqUserId, tokenType : "PASSWORD_RESET"});

    // todo specify further
    if (userToken === null){
        res.status(404).json({message: "User not found"})
    }

    else if (userToken.token !== reqToken){
        res.status(400).json({message: "Token not found or expired"})
    }

    // todo what statusCode would be appropriate?
    else if(userToken.expirationDate < new Date.now()){
        res.status(400).json({message: "Token not found or expired"})
    }


    else {
        await UserModel.updateOne({_id: reqUserId},{password: hash(req.body.password)});
        res.status(201).json({message: "Password was reset"});
    }

});


/**
 * @swagger
 * /user/edit:
 *  put:
 *   description: Edit user account information.
 *   summary: Edit user information
 *   tags:
 *    - user
 *   security:
 *      - bearerAuth: []
 *   parameters:
 *       - in: body
 *         name: changeInformation
 *         description: information that has to be changed.
 *         schema:
 *           type: object
 *           properties:
 *             lastName:
 *               type: string
 *             firstName:
 *               type: string
 *           example:
 *             lastName: Homer
 *             firstName: Simpson
 *   responses:
 *       200:
 *          description: Token accepted, User information will be changed
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  firstName:
 *                      type: string
 *                  confirmed:
 *                      type: boolean
 *              example:
 *                  email: homer.simpson@milou.de
 *                  lastName: Homer
 *                  firstName: Simpson
 *                  confirmed: true
 *       404:
 *          description: Token rejected, user not found or deleted.
 *          schema:
 *              type: string
 *              example: Unauthorized
 */
router.put('/edit', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/

    let changes = {};
    if(req.body.firstName !== undefined){
        changes.firstName = req.body.firstName;
    }
    if(req.body.lastName !== undefined){
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
 *   description:
 *      Delete a user account and if exists portfolio details as well as user information on finAPI. JWT needs to be passed as Bearer-Token in header.
 *   summary: Delete a user
 *   security:
 *      - bearerAuth: []
 *   tags:
 *    - user
 *   responses:
 *    '200':
 *      description: Accepted, user-account will be deleted.
 *      schema:
 *              type: string
 *              example: "successfully deleted user"
 *    '404':
 *      description: Token rejected.
 *      schema:
 *              type: string
 *              example: Unauthorized
 */
// delete profile
router.delete('/profile', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/

    // JWT token in header as bearer token

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
 * swagger
 *  /user/bank:
 *     get:
 *       description: get a bank
 *       summary: get bank
 *       tags:
 *        - user
 *       responses:
 *         '200':
 *           description: .
 *         '404':
 *           description: .
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
 * swagger
 *  /user/bank:
 *    post:
 *      description: add a bank connection
 *      summary: Adds bank connection
 *      tags:
 *       - user
 *      responses:
 *        '200':
 *          description: success
 *        '404':
 *          description: not found
 */
// add a bank_connection
router.post('/bank_connection', (req, res) => {
    res.statusCode = 200;
    res.send("bank added")
});

/**
 * swagger
 *  /user/bank:
 *    delete:
 *      description: bank-connection with id will be deleted.
 *      summary: Bank-connection with id wil be deleted
 *      tags:
 *      - user
 *      responses:
 *        '200':
 *          description: Accepted, bank-connection deleted.
 */
// delete a bank connection
router.delete('/bank_connection/:id', (req, res) => {
    res.statusCode = 200;
    res.send("bank deleted");
});

module.exports = router