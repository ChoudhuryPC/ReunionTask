var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./db.js');
// console.log(config);

// passport.use(new LocalStrategy({
//     usernameField: 'username',
//   },User.authenticate()));

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//   }, User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser()); 

exports.getToken = function(user) {
    return jwt.sign(user, config.secret,
        {expiresIn: '7d'});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log(jwt_payload)
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                console.log(err)
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});