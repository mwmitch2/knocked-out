const express = require('express')
const router = express.Router()
const { getTourneys, setTourney, updateTourney, deleteTourney } = require('../controllers/organizerController')

router.route('/').get(getTourneys).post(setTourney)
router.route('/:id').delete(deleteTourney).put(updateTourney)

module.exports = router