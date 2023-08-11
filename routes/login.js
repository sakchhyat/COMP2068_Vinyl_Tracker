var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport')

/* GET users listing. */
router.get('/', function(req, res, next) {    
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', { title: 'Login Here', messages: messages });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/records',
  failureRedirect: '/login',
  failureMessage: 'Invalid credentials'
}));

module.exports = router;
