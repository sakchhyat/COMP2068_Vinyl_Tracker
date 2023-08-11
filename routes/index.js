var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    res.redirect('/login');
  });
});

module.exports = router;
