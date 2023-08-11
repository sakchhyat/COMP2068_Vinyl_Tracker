var express = require('express');
var router = express.Router();
const Record = require('../models/records');
const passport = require('passport');


function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  Record.find((err, records) => {
    if (err) {
      console.log(err);
    }
    else {
        res.render('records/index', { title: 'Record Collection', dataset: records, user: req.user });
    }
  })
});

router.get('/add', isLoggedIn, function(req, res, next) {
  res.render('records/add', { title: 'Add a new record' });
});




router.post('/add', isLoggedIn ,(req, res, next) => {

  const { albumTitle, albumArtist, releaseYear, noOfSongs } = req.body;

  Record.create({
    albumTitle: albumTitle,
    albumArtist: albumArtist,
    releaseYear: releaseYear,
    noOfSongs: noOfSongs
  }, (err, newRecord) => {
    if (err) {
        console.log(err);
    }
    else {        
        res.redirect('/records');
    }
  });
});

router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
  Record.remove({ _id: req.params._id }, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        res.redirect('/records')
    }
  })
});


router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
  Record.findById(req.params._id, (err, project) => {
    if (err) {
        console.log(err);
    }
    else {
      res.render('records/edit', {
        title: 'Edit a Record\'s metadata',
        albumTitle: albumTitle,         
        user: req.user
      })
    }

  })
});

router.post('/edit/:_id', isLoggedIn, (req,res,next) => {
  Project.findOneAndUpdate({_id: req.params._id}, {
      albumTitle: req.body.albumTitle,
      albumArtist: req.body.albumArtist,
      releaseYear: req.body.releaseYear,
      noOfSongs: req.body.noOfSongs,
      status: req.body.status
  }, (err, updatedRecord) => {
      if (err) {
          console.log(err)
      }
      else {
          res.redirect('/records');
      }
  });
});


module.exports = router;
