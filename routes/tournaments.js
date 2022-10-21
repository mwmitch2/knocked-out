let express = require('express')
let router = express.Router()
let Tournament = require('../models/tournament')

// Tournaments page - display all
router.get('/', function(req, res) {
    res.render('tournaments/index')
})

// Handle POST request to create new tournament
router.post('/new', function(req, res) {
    // get data from form and add to tournament array
    let name = req.body.name;
    let size = req.body.size;
    var type = req.body.type;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    let newTournament = {name: name, size: size, type: type, author: author}
    
    Tournament.create(newTournament, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/tournaments')
        }
    })
})


module.exports = router
