// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'

// src
import rideCtrl from '../controllers/ride.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/create').post(rideCtrl.createRide)
router.route('/absentees').post(rideCtrl.absenteeStudents)

export default router
