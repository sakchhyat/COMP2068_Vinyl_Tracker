var express = require('express');
var router = express.Router();
const Record = require('../models/records');

/* GET users listing. */
router.get('/', function(req, res, next) {
      Record.find((err, records) => {
        if (err) {
          console.log(err);
        }
        else {
            res.render('records/index', { title: 'Record Collection', dataset: records });
        }
      })
  });

  router.get('/add', function(req, res, next) {
    res.render('records/add', { title: 'Add a new record' });
  });




  router.post('/add', (req, res, next) => {

    const { albumTitle, albumArtist, releaseYear, noOfSongs } = req.body;

    Record.create({
      albumTitle: albumTitle,
      albumArtist: albumArtist,
      releaseYear: releaseYear,
      noOfSongs: noOfSongs
    }, (err, newProject) => {
      if (err) {
          console.log(err);
      }
      else {        
          res.redirect('/records');
      }
    });
  });


module.exports = router;
