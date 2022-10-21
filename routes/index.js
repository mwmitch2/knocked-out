let express = require('express')
let router = express.Router()
let passport = require('passport')
let User = require('../models/user')
let Organizer = require('../models/organizer')

// GET: root
router.get('/', function(req, res) {
    res.render('welcome')
})

// Register Page
router.get('/register', function(req, res) {
    res.render('register')
})

// Handle sign-up
router.post('/register', function(req, res) {

    // Save according to the role (Team or Organizer)
    if (req.body.role == 'organizer') {
        let newOrganizer = new Organizer({username: req.body.username})
        newOrganizer.role = req.body.role
        
        Organizer.register(newOrganizer, req.body.password, function(err, user) {
            if (err) {
                console.log(err)
                return res.render('register', {error: err.message})
            } 

            passport.authenticate('local')(req, res, function() {
                res.redirect('/')
            })
        })
    } else if (req.body.role == 'team') {
        let newUser = new User({username: req.body.username})
        newUser.role = req.body.role
        newUser.teamName = req.body.teamName
    
        User.register(newUser, req.body.password, function(err, user) {
            if (err) {
                console.log(err)
                return res.render('register', {error: err.message})
            }
    
            passport.authenticate('local')(req, res, function() {
                res.redirect('/')
            })
        })
    }
})

// Login Page
router.get('/login', function(req, res) {
    res.render('login')
})

// Handle login
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/',
        failureRedirect: '/login',
    }), function(req, res) {
})

// Handle logout
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

router.get('/admin', function(req, res) {
    User.find({ role:"team"}, function (err, teams) {
        if(err) console.log(err)
        res.render('admin', {"teams": teams})
    })
})

router.get('/organizer', function(req, res) {
    if (req.isAuthenticated()) {
        res.render('organizer') 
    } else {
        res.render('login')
    }
})

router.post('/admin', function(req, res) {
    var teamName = req.body.teamName;
    User.collection.deleteOne({ teamName: teamName });
    res.redirect('/admin');
})

module.exports = router;