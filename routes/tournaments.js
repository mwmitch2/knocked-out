let express = require('express')
let router = express.Router()
let Tournament = require('../models/tournament')
let roles = require('../roles')
const userAuth = require('../middleware/userAuth')
const roleAuth = require('../middleware/roleAuth')

// Tournaments page - display all
router.get('/', userAuth.checkLoggedIn, roleAuth.isTeamOrOrganizer, (req, res) => {
    if (req.user.role === roles.TEAM) {
        Tournament.findOne({ teams: req.user._id }).populate("teams").exec((err, tournament) => {
            if (err) throw err;
            if (tournament) {
                res.render('tournamentView', { tournament: tournament });
            } else {
                // Get all tournaments and send data to the view
                Tournament.find({ full: false }, (err, tournaments) => {
                    res.render('tournaments/index', { tournaments: tournaments })
                })
            }
        })
    } else if (req.user.role === roles.ORGANIZER) {
        // Get tournaments that the organizer has created
        Tournament.find({ "author.username": req.user.username }, (err, tournaments) => {
            res.render("tournaments/index", { tournaments: tournaments })
        })
    }
})

// Handle POST request to create new tournament
router.post('/new', userAuth.checkLoggedIn, roleAuth.isOrganizer, (req, res) => {
    // get data from form and add to tournament array
    let name = req.body.name;
    let size = req.body.size;
    let type = req.body.type;
    let author = {
        id: req.user._id,
        username: req.user.username
    }

    let newTournament = { name: name, size: size, type: type, author: author }

    Tournament.create(newTournament, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            res.render('organizer', { tournament: newlyCreated })
        }
    })
})

// SHOW - shows more info about one tournament
router.get("/:id", userAuth.checkLoggedIn, roleAuth.isTeam, (req, res) => {
    // find the tournament with provided ID
    Tournament.findById(req.params.id).populate('teams').exec((err, foundTournament) => {
        if (err || !foundTournament) {
            console.log(err);
            return res.redirect('/tournaments');
        }

        // render template with that tournament
        res.render('tournaments/show', { tournament: foundTournament });
    });
});

// Handle POST for team joining a tournament
router.post("/:id", userAuth.checkLoggedIn, roleAuth.isTeam, (req, res) => {
    // lookup tournament using ID
    Tournament.findOne({ _id: req.params.id }).exec((err, tournament) => {
        if (err) throw err

        if (tournament.full) {
            res.status(403).send({ message: "tournament is full" });
            return;
        }

        tournament.teams.addToSet(req.user)

        tournament.save()
        res.render('tournamentView', { tournament: tournament })
    })
})

module.exports = router
