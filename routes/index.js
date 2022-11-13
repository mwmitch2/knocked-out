
let express = require('express')
let router = express.Router()
let passport = require('passport')
let User = require('../models/user')
let Organizer = require('../models/organizer')
let Tournament = require('../models/tournament')
let roles = require('../roles')
const userAuth = require('../middleware/userAuth')
const roleAuth = require('../middleware/roleAuth')

// GET: root
router.get('/', (req, res) => {
    res.render('welcome', { user: req.user })
})

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

// Handle sign-up
router.post('/register', (req, res) => {
    // Save according to the role (Team or Organizer)
    if (req.body.role == roles.ORGANIZER) {
        let newOrganizer = new Organizer({ username: req.body.username })
        newOrganizer.role = req.body.role

        Organizer.register(newOrganizer, req.body.password, (err, user) => {
            if (err) {
                console.log(err)
                return res.render('register', { error: err.message })
            }

            passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        })
    } else if (req.body.role == 'team') {
        let newUser = new User({ username: req.body.username })
        newUser.role = req.body.role
        newUser.teamName = req.body.teamName

        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                console.log(err)
                return res.render('register', { error: err.message })
            }

            passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        })
    }
})

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

// Handle login
router.post('/login', passport.authenticate('local'), userAuth.checkLoggedIn, (req, res) => {
    if (req.user.role === roles.TEAM || req.user.role === roles.ORGANIZER) {
        res.redirect('/tournaments')
    }
    else if (req.user.role === roles.ADMIN) {
        res.redirect('/admin')
    }

})

// Handle logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

router.get('/admin', userAuth.checkLoggedIn, roleAuth.isAdmin, (req, res) => {
    User.find({ role: roles.TEAM }, (err, teams) => {
        if (err) {
            console.log(err)
            return;
        }

        Tournament.find({}, (err, tournaments) => {
            if (err) console.log(err)
            res.render('admin', { teams: teams, tournaments: tournaments })
        })
    })
})

router.post('/organizer', userAuth.checkLoggedIn, roleAuth.isOrganizer, (req, res) => {
    // Search for a tournament created by this organizer
    Tournament.findOne({ "name": req.body.tournamentName }).populate('teams').exec((err, tournament) => {
        if (err) {
            console.log(err)
        } else {
            // Return tournament created by this organizer
            res.render('organizer', { tournament: tournament })
        }
    })
})

router.get('/organizer/create', userAuth.checkLoggedIn, roleAuth.isOrganizer, (req, res) => {
    res.render('organizer', { tournament: "" })
})

router.post('/delete-team', (req, res) => {
    var teamId = req.body.teamId;
    Tournament.findOneAndUpdate({ teams: teamId }, { $pull: { teams: teamId } }, (err) => {
        if (err) console.log(err)
        User.deleteOne({ _id: teamId }, (err) => {
            if (err) console.log(err)
        })
    })
    // User.findByIdAndDelete(teamId, (err) => {
    //     if(err) console.log(err)
    // });
    res.redirect('/admin');
})

router.post('/end-tournament', (req, res) => {
    var tournamentId = req.body.tournamentId;
    Tournament.findById(tournamentId, (err, tournament) => {
        if (err) console.log(err)
        tournament.teams.forEach(team => {
            User.findByIdAndDelete(team.valueOf(), (err) => {
                if (err) console.log(err)
            })
        });
        Tournament.deleteOne({ '_id': tournamentId }, (err) => {
            if (err) console.log(err)
        })
    })

    res.redirect('/admin');
})

module.exports = router;