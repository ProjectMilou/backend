const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtSecret = 'your_jwt_secret';

const genToken = user => {
    return jwt.sign({
        iss: 'getmilou.de',
        sub: user.id,
        iat: new Date().getTime(),
        // exp: token expires in one day (+1)
        exp: new Date().setDate(new Date().getDate() + 1)
    }, jwtSecret);
}



passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        if (email !== 'test@getmilou.de' || password !== '123456') {
            cb(null, false, {message: 'Incorrect email or password.'});
        }
        cb(null, {email, id: email});
        /*return UserModel.findOne({email, password})
            .then(user => {
                if (!user) {
                    return cb(null, false, {message: 'Incorrect email or password.'});
                }
                return cb(null, user, {message: 'Logged In Successfully'});
            })
            .catch(err => cb(err));*/
    }
));

passport.use('jwt',
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : jwtSecret
    },
    function (jwtPayload, done) {
        console.log(jwtPayload);
        if(new Date().getTime() > jwtPayload.exp){
            new Error('Token is expired');
        }
        return done(null, {id: jwtPayload.sub});
        /*return User.findById(jwtPayload.sub)
            .then(user =>
                {
                    return done(null, user);
                }
            ).catch(err =>
            {
                return done(err);
            });*/
    })
)

module.exports = genToken;