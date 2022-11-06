let express = require('express')
let router = express.Router()
let Tournament = require('../models/tournament')

// Tournaments page - display all
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        // Get all tournaments and send data to the view
        Tournament.find({}, function(err, tournaments) {
            res.render('tournaments/index', {tournaments: tournaments})
        })
    } else {
        res.render('login')
    }
})

// Handle POST request to create new tournament
router.post('/new', function(req, res) {
    // get data from form and add to tournament array
    let name = req.body.name;
    let size = req.body.size;
    let type = req.body.type;
    let author = {
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

// SHOW - shows more info about one tournament
router.get("/:id", function(req, res){
    // find the tournament with provided ID
    Tournament.findById(req.params.id).populate('teams').exec(function(err, foundTournament){
        if(err || !foundTournament){
            console.log(err);
            return res.redirect('/tournaments');
        }
    
        // render template with that tournament
        res.render('tournaments/show', {tournament: foundTournament});
    });
});

// Handle POST for team joining a tournament
router.post("/:id", function(req, res){
    // lookup tournament using ID
    Tournament.findById(req.params.id, function(err, tournament){
        if(err){
            console.log(err);
            res.redirect('/tournaments' + tournament._id);
        } else {
            // addToSet() makes sure it is unique
            tournament.teams.addToSet(req.user)            
            tournament.save()
            res.redirect('/tournaments/' + tournament._id)
        }
    })
})

module.exports = router
