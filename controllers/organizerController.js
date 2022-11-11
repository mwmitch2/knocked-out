const asyncHandler = require('express-async-handler')
const Tourney = require('../models/organizer')

// @desc    Get tournaments
// @route   GET /api/tourneys
// @access  Private
const getTourneys = asyncHandler(async(req, res) => {
    const tourneys = await Tourney.find()
    res.status(200).json(tourneys)
})

// @desc    Set tournament
// @route   POST /api/tourneys
// @access  Private
const setTourney = asyncHandler(async(req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Enter a text field')
    }

    const tourney = await Tourney.create({
        text: req.body.text
    })

    res.status(200).json(tourney)
})

// @desc    Update tournament
// @route   PUT /api/tourneys/:id
// @access  Private
const updateTourney = asyncHandler(async(req, res) => {
    const tourney = await Tourney.findById(req.params.id)

    if(!tourney) {
        res.status(400)
        throw new Error('Tourney not found')
    }

    const updatedTourney = await Tourney.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedTourney)
})

// @desc    Delete tournament
// @route   DELETE /api/tourneys/:id
// @access  Private
const deleteTourney = asyncHandler(async(req, res) => {
    const tourney = await Tourney.findById(req.params.id)

    if(!tourney) {
        res.status(400)
        throw new Error('Tourney not found')
    }

    await tourney.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getTourneys, 
    setTourney,
    updateTourney,
    deleteTourney
}