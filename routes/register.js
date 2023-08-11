var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register Here' });
  });

router.post('/', (req, res, next) => {

  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);        
        return res.redirect('/register');
      }
      else {
        req.login(newUser, (err) => {
          res.redirect('/records');
        });
      }
    });
});

module.exports = router;
