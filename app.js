var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs')
const rating = require('./public/javascripts/rating');


var indexRouter = require('./routes/index');
var recordsRouter = require('./routes/records');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');

const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy; 
const User = require('./models/user'); 


const config = require('./config/globals.js');
let connectionString = config.db;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('generateRatingStars', function(rating) {
  let stars = '';
  for (let i = 1; i <= rating; i++) {
    stars += '<img src="/images/ratingStar.png" alt="Rating Star" class="header-icon">';
  }
  return new hbs.SafeString(stars);
});

app.use(session({
  secret: 'vinyltrackergrailzrock',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GitHubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
}, (accessToken, refreshToken, profile, done) => {
  
  User.findOne({ oauthId: profile.id }, (err, user) => {
    if (err) return done(err);
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        oauthId: profile.id,
        oauthProvider: 'github',
        created: new Date()
      });
      newUser.save((err) => {
        if (err) return done(err);
        return done(null, newUser);
      });
    }
  });
}));

app.use('/', indexRouter);
app.use('/records', recordsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful GitHub authentication, redirect as needed
    res.redirect('/records'); // Redirect to records page for example
  }
);




mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
