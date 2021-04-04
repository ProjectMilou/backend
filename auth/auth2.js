const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user');
const UserTokenModel = require('../models/userToken')

const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// adapted from https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

// todo: store in AWS Secret Manager
const jwtSecret = "TOP SECRET TODO";

const genToken = user => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        iat: new Date().getTime(),
        // exp: token expires in one day (+1)
        exp: new Date().setDate(new Date().getDate() + 1)
    }, jwtSecret);
}

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            if(await UserModel.exists({email:email})) {
                return done(null, {
                    response: {
                        message: "Signup failed - mail has got an account already"
                    },
                    statusCode: 409
                });
            }
            else{
                try {

                    // new user is stored in db
                    await UserModel.create({
                        email,
                        password,
                        lastName : "",
                        firstName : "",
                        confirmed : false
                    });

                    // todo: generate token and send it to mail!
                    // token and mail are stored usertokens
                    await UserTokenModel.create({
                        email:email,
                        token:"token12345"
                    });

                    return done(null, {
                        response: {
                            message: "Signup success",
                        },
                        statusCode: 201
                    });
                } catch (error) {
                    done(error);
                }
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    'jwt',
    new JWTstrategy(
        {
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                if(new Date().getTime() > token.exp){
                    new Error('Token is expired');
                }
                const body = {id: token.id, email: token.email};
                return done(null, body);
            } catch (error) {
                done(error);
            }
        }
    )
);

module.exports = genToken;