const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

/**
 * @api {post} /auth/login Login route
 * @apiName login
 * @apiGroup auth
 * @apiPermission Public
 * @apiVersion 1.0.0
 *
 * @apiError 500 SQL Error
 * @apiParam {String} email User Email
 * @apiParam {String} password User Password
 * @apiDescription Route permettant la connexion d'un utilisateur via l'api.
 */

router.post('/login', passport.authenticate('local'), function(req, res) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      } else {
        user.password = '';
        req.user = user;
        const token = jwt.sign({ user }, secret);
        return res.status(200).json({ user, token });
      }
    });
  })(req, res);
});

/**
 * @api {post} /auth/signup Signup route
 * @apiName signup
 * @apiGroup auth
 * @apiPermission Public
 * @apiVersion 1.0.0
 *
 * @apiError 500 SQL Error
 * @apiError 401 Unauthoriezed
 * @apiParam {String} email User Email
 * @apiParam {String} password User Password
 * @apiDescription Route permettant l'inscription d'un utilisateur.
 */

router.post('/signup', function(req, res) {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(dbUser) {
    if (!dbUser) {
      db.User.create({
        email: req.body.email,
        password: req.body.password
      })
        .then(user => {
          user.password = '';
          res.status(200).json(user);
        })
        .catch(function(err) {
          res.json(err);
        });
    } else {
      res.status(400).json('Account Already exist.');
    }
  });
});

module.exports = router;
