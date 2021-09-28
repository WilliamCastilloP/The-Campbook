const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');


const UserSchema = new Schema ({
    email: {
        type: String,
        required: true
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)