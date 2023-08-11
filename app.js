// iimport required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');
const rating = require('./public/javascripts/rating');

// import routers for different routes
var indexRouter = require('./routes/index');
var recordsRouter = require('./routes/records');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');

//import passport related modules
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy; 
const User = require('./models/user'); 

//import configuration
const config = require('./config/globals.js');

// set up the connection string for the MongoDB database
let connectionString = config.db;

// initialize the Express app
var app = express();

// Configure view engine and static files
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'hbs'); 
app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

// Register Handlebars helper for generating rating stars
hbs.registerHelper('generateRatingStars', function(rating) {
  let stars = '';
  for (let i = 1; i <= rating; i++) {
    stars += '<img src="/images/ratingStar.png" alt="Rating Star" class="header-icon">';
  }
  return new hbs.SafeString(stars);
});

// Set up session management
app.use(session({
  secret: 'vinyltrackergrailzrock', 
  resave: false,
  saveUninitialized: false
}));

// Set up passport for authentication
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); 
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up GitHub authentication strategy using Passport
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

// GitHub authentication routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/records'); // Redirect to records page after successful authentication
  }
);

// Use routers for different routes
app.use('/', indexRouter);
app.use('/records', recordsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// Connect to MongoDB database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the configured app
module.exports = app;
