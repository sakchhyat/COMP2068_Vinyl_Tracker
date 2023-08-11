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


router.get('/delete/:id',isLoggedIn, async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndRemove(req.params.id);
    if (!deletedRecord) {
      return res.status(404).send('Record not found');
    }
    res.redirect('/records'); 
  } catch (error) {
    res.status(500).send('Error deleting record');
  }
});



  router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
      const record = await Record.findById(req.params.id);
      res.render('records/edit', { title: 'Edit Record', record }); // Pass the record object
    } catch (error) {
      res.status(500).send('Error fetching record');
    }
  });

router.post('/edit/:_id', isLoggedIn, (req,res,next) => {
  Record.findOneAndUpdate({_id: req.params._id}, {
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
