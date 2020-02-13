const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const db = require('../models');
const { secret } = require('../config');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      db.User.findOne({
        where: {
          email: email
        }
      }).then(function(dbUser) {
        if (!dbUser) {
          return done(null, false, {
            message: 'Incorrect email.'
          });
        } else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        return done(null, dbUser);
      });
    }
  )
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    },
    function(jwtPayload, cb) {
      return db.User.findOne({
        where: {
          email: jwtPayload.user.email
        }
      })
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.serializeUser(function(user, cb) {
  user.password = null;
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
