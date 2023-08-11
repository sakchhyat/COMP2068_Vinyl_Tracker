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
    }    
}


var recordsSchema = new mongoose.Schema(recordsCollectionSchemaDefn)
module.exports = mongoose.model('Record', recordsSchema);