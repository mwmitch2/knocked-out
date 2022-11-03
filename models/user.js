let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    teamName: String,
    role: String
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema, 'users')