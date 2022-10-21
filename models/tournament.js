let mongoose = require('mongoose')

let tournamentSchema = new mongoose.Schema({
    name: String,
    size: Number,
    type: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
})

module.exports = mongoose.model('Tournament', tournamentSchema)
