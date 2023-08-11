var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Handling GET request for the home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', user: req.user });
});

// Handling GET request for logging out
router.get('/logout', (req, res, next) => {
  // Logging out the current user and redirecting to the login page
  req.logout(function (err) {
    res.redirect('/login');
  });
});

module.exports = router;
