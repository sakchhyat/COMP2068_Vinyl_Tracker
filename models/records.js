const mongoose = require('mongoose')

const recordsCollectionSchemaDefn = {
    albumTitle: {
        type: String,
        required: true
    },
    albumArtist: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    noOfSongs: {
        type: Number
    },
    rating: {
        type: Number
    }
}


const Record = mongoose.models.Record || mongoose.model('Record', recordsCollectionSchemaDefn);

module.exports = Record;