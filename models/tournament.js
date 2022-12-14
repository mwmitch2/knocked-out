let mongoose = require('mongoose')

let tournamentSchema = new mongoose.Schema({
    name: String,
    size: Number,
    type: String,
    full: {
        type: Boolean,
        default: false
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            sparse: true
        }
     ]
})

module.exports = mongoose.model('Tournament', tournamentSchema)
