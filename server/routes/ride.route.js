// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'

// src
import rideCtrl from '../controllers/ride.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/start').post(rideCtrl.startRide)
router.route('/end').post(rideCtrl.endRide)
router.route('/update').post(rideCtrl.updateDriverLocation)

export default router
