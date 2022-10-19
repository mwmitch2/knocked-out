let express = require('express')
var router = express.Router()
//let Tournament = require('../models/tournament')

// Tournaments page - display all
router.get('/', function(req, res) {
    res.render('tournaments/index')
})

// Handle new tournament POST request

module.exports = router