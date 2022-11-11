const asyncHandler = require('express-async-handler')


// @desc    Get tournaments
// @route   GET /api/tourneys
// @access  Private
const getTourneys = asyncHandler(async(req, res) => {
    res.status(200).json({ message: 'Get tourneys' })
})

// @desc    Set tournament
// @route   POST /api/tourneys
// @access  Private
const setTourney = asyncHandler(async(req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Enter a text field')
    }

    res.status(200).json({ message: 'Create tourneys' })
})

// @desc    Update tournament
// @route   PUT /api/tourneys/:id
// @access  Private
const updateTourney = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Update tourneys ${req.params.id}` })
})

// @desc    Delete tournament
// @route   DELETE /api/tourneys/:id
// @access  Private
const deleteTourney = asyncHandler(async(req, res) => {
    res.status(200).json({ message: `Delete tourneys ${req.params.id}` })
})

module.exports = {
    getTourneys, 
    setTourney,
    updateTourney,
    deleteTourney
}