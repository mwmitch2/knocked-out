var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
})

const tourneySchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text value']
    }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Organizer', UserSchema, 'users')
module.exports = mongoose.model('Tourney', tourneySchema)