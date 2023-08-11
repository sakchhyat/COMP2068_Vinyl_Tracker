var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Handling GET request for the login page
router.get('/', function(req, res, next) {    
  let messages = req.session.messages || [];
  req.session.messages = [];
  
  // Rendering the login page with title and messages
  res.render('login', { title: 'Login Here', messages: messages });
});

// Handling POST request for user authentication
router.post('/', passport.authenticate('local', {
  successRedirect: '/records',
  failureRedirect: '/login',
  failureMessage: 'Invalid credentials'
}));

module.exports = router;
