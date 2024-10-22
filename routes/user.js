"use strict";
const express = require("express");
const passport = require("passport");
const genToken = require("../auth/auth");
const UserModel = require("../models/user");
const UserTokenModel = require("../models/userToken");
const { hash } = require("../encryption/encryption");
const finAPI = require("../models/finAPI");
const confirmation = require("../auth/confirmation");
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
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    if (req.user.statusCode === 409) {
      res.status(409).json({
        message: "Signup failed - mail has got an account already",
      });
    }

    // success
    else {
      await confirmation.startConfirmationProcess(req.user.user);
      res.status(201).json({
        message: "Signup success, check your mails",
      });
    }
  }
);

/**
 * @swagger
 *  /user/confirm/resent:
 *      post:
 *          summary:
 *              resent a confirmation link to an email-address
 *          description:
 *              If a user has not confirmed the account right away or has lost the email with the confirmation link somehow, <br>
 *              this route enables sending another one, restarting the confirmation process internally.
 *          tags:
 *            - user
 */
router.post(
  "/confirm/resent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await confirmation.startConfirmationProcess(req.user);
    res.status(201).json({ message: "Resent confirmation email." });
  }
);

/**
 * @swagger
 * /user/confirm/:id/:token:
 *   get:
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
router.get("/confirm/:id/:token", async (req, res) => {
  const token = req.params.token;
  const id = req.params.id;

  const confirmed = await confirmation.endConfirmationProcess(id, token);

  if (confirmed) res.redirect("https://milou.io/profile");
  else
    res
      .status(404)
      .json({ message: "User not found or Token not found or Token invalid." });
});

/**
 * @swagger
 * /user/login:
 *  post:
 *    description: Checks if email and password are correct. sends back a token that needs to be passed in the header of each user-relevant request.
 *    summary: Login of a user
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
 *              token: adsfuahf.asdfadsfag.asdfafsfd
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
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({
          message: info.message,
        });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { id: user._id };
        const token = genToken(body); //jwt.sign({ user: body }, 'TOP_SECRET');

        return res.json({
          user: {
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            confirmed: user.confirmed,
          },
          token: token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

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
 *                  lastName: Longus
 *                  firstName: Schlongus
 *                  confirmed: true
 *       '401':
 *         description: Unauthorized. Token not valid.
 *         schema:
 *              type: string
 *              example: Unauthorized
 */
// profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // http://www.passportjs.org/docs/username-password/
    // request just contains an JWT token in its header, that will be checked by passport automatically. If unauthorized, 401 will be sent back.
    try {
      res.json({
        email: req.user.email,
        lastName: req.user.lastName,
        firstName: req.user.firstName,
        confirmed: req.user.confirmed,
      });
    } catch (err) {
      console.log(err);
      res.json("error occurred");
    }
  }
);

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
router.put(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/

    let changes = {};
    if (req.body.firstName !== undefined) {
      changes.firstName = req.body.firstName;
    }
    if (req.body.lastName !== undefined) {
      changes.lastName = req.body.lastName;
    }

    try {
      await UserModel.updateOne({ _id: req.user.id }, changes, null);
      const user = await UserModel.findOne({ _id: req.user.id });
      res.json({
        user: {
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          confirmed: user.confirmed,
        },
      });
    } catch (err) {
      console.log(err);
      res.json("error occurred");
    }
  }
);

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
router.post("/reset/forgot", async (req, res) => {
  // if user exists: send token to mail and store it at userTokens
  const resetWorked = await confirmation.startResetProcess(req.body.email);
  if (resetWorked) {
    res.status(201).json({ message: "Reset Process started, check your mail" });
  }

  // if user does not exist: 404
  else {
    res.status(404).json({ message: "Specified email not found." });
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
 *              description: confirms a user for an upcoming password change (link will be in email, that is sent to user)
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
router.get("/reset/confirm/:id/:token", async (req, res) => {
  const id = req.params.id;
  const token = req.params.token;

  const resetResponse = await confirmation.resetConfirm(id, token);

  if (!resetResponse) {
    res
      .status(404)
      .json({ message: "token invalid or expired or user not found." });
  } else {
    // now that user is confirmed -> redirect to frontend-webform
    const newToken = resetResponse.token;
    const url = "https://milou.io/reset/" + id + "/" + newToken;
    res.redirect(url);
  }
});

/**
 * @swagger
 *  /user/reset/change/:id/:token:
 *      put:
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
 *              401:
 *                  description:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                      example:
 *                          message: Unauthorized
 */
router.put("/reset/change/:id/:token", async (req, res) => {
  const reqUserId = req.params.id;
  const reqToken = req.params.token;
  const newHashedPassword = hash(req.body.password);

  const userConfirmed = await confirmation.endResetProcess(reqUserId, reqToken);

  if (!userConfirmed) {
    res.status(401).json({ message: "Unauthorized, confirmation failed." });
  } else {
    await UserModel.updateOne(
      { _id: reqUserId },
      { password: newHashedPassword },
      null
    );
    console.log("bong");
    res.status(201).json({ message: "Password was successfully changed" });
  }
});

/**
 * @swagger
 *  /user/bank/search/:searchString:
 *      get:
 *          summary:
 *              Search for a bank in finAPI
 *          description:
 *              Return all banks, that match the search-string while also being supported by finAPI.<br>
 *              Only Banks shown, that are available at finAPI. A location can be optionally specified to filter banks, array of two-letter country codes (ISO 3166 ALPHA-2), for example DE, AT.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          parameters:
 *            - in: path
 *              name: searchString
 *              type: string
 *            - in: body
 *              name: location
 *              type: array
 *              items:
 *               type: string
 *          responses:
 *              200:
 *                  description:
 *                      OK. Matched banks are shown.
 */
router.get("/bank/search/:searchString", async (req, res) => {
  const searchString = req.params.searchString;
  const location = req.body.location;

  const banks = await finAPI.searchBanks(searchString, location);
  res.status(200).send(banks);
});

/**
 * @swagger
 *  /user/bank/connections/add/:bankId:
 *      post:
 *          summary:
 *              starts the process for adding a bank via finAPI
 *          description:
 *              The bank-ID will be used to specify a bank for a "bank-connection-import" on finAPI.<br>
 *              <b>A link to a webform</b> (leading to finAPI) will be returned. The user can input sensitive bank data on that page, because we are legally not allowed to do so.<br>
 *              If the user confirmed his connection successfully on that other page, his securities (portfolios) will be available to us on finAPI.
 *          tags:
 *            - user
 *          parameters:
 *            - in: path
 *              name: bankId
 *              type: integer
 *          security:
 *            - bearerAuth: []
 *          responses:
 *              200:
 *                  description:
 *                      OK. Webform passed in body.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          webform:
 *                              type: string
 *                      example:
 *                          webform: "some link"
 *
 */
router.post(
  "/bank/connections/add/:bankId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    const bankId = req.params.bankId;
    const user = req.user;
    const finResponse = await finAPI.importBankConnection(user, bankId);
    res.json(finResponse);
  }
);

/**
 * @swagger
 *  /user/bank/connections:
 *      get:
 *          summary:
 *              Get all bank-connections of a user
 *          description:
 *              Specify a user by JWT. <br>
 *              All of the users currently registered bank-connections will be returned as an array.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          security:
 *            - bearerAuth: []
 *
 */

// get bankconnections
router.get(
  "/bank/connections",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;

    await finAPI.updateAllFinApiConnections(user);
    await finAPI.refreshBankConnections(user);

    const finResponse = await finAPI.getAllBankConnections(user);
    if (finResponse === null) res.json({ bankConnections: [] });
    else res.json(finResponse);
  }
);

/**
 * @swagger
 *  /user/bank/refresh:
 *      get:
 *          summary:
 *              Refresh all bank-connections of a user, importing his securities into our database
 *          description:
 *              Specify a user by JWT. <br>
 *              All of the users securities will be refreshed and new ones will be imported.<br>
 *              Has to happen after the successful import of a bank-connection, because <b>we don't <br>
 *              get notified about the (successful) import of a bank-connection.</b>
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          security:
 *            - bearerAuth: []
 */
router.get(
  "/bank/refresh",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;

    await finAPI.updateAllFinApiConnections(user);
    await finAPI.refreshBankConnections(user);
    await finAPI.refreshPortfolios(user);

    res.status(200).json("User-related bank information successfully updated.");
  }
);

/**
 * @swagger
 *  /user/bank/connections/:id:
 *      delete:
 *          summary:
 *              Get all bank-connections of a user
 *          description:
 *              Specify a user by JWT. <br>
 *              All of the users currently registered bank-connections will be returned as an array.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          security:
 *            - bearerAuth: []
 */
// delete bankConnection by id
router.delete(
  "/bank/connections/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const bankConnectionId = req.params.id;

    await finAPI.deleteOneBankConnection(user, bankConnectionId);
    res
      .status(200)
      .json({ message: "deleted bank connection " + bankConnectionId });
  }
);

/**
 * @swagger
 *  /user/bank/connections:
 *      delete:
 *          summary:
 *              Delete all of a users bank-connections.
 *          description:
 *              Specify a user by JWT. <br>
 *              All of the users currently registered bank-connections will be deleted from finAPI <br>
 *              and our database.
 *          tags:
 *            - user
 *          produces:
 *            - application/json
 *          security:
 *            - bearerAuth: []
 *
 */
// delete all bankConnections
router.delete(
  "/bank/connections",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    await finAPI.deleteAllBankConnections(user);
    res.status(200).json({ message: "deleted all bank connection" });
  }
);

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
router.delete(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // implement the following authorization: http://www.passportjs.org/docs/username-password/
    // JWT token in header as bearer token

    try {
      const user = await UserModel.findOne({ _id: req.user.id });
      await UserModel.deleteOne({ _id: req.user.id });
      await UserTokenModel.deleteMany({ email: user.email });
      await finAPI.deleteFinAPIUser(user);

      res.json("successfully deleted user").status(200);
    } catch (err) {
      console.log(err);
      res.json("error occurred");
    }
  }
);

module.exports = router;
