const mongoose = require('mongoose');
const localMongoosePassport = require('passport-local-mongoose');

const userSchemaDefn = {
    username: String,
    password: String
}


var userSchema = new mongoose.Schema(userSchemaDefn);
userSchema.plugin(localMongoosePassport);
module.exports = mongoose.model('user', userSchema);