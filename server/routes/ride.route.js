// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'

// src
import rideCtrl from '../controllers/ride.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/create').post(rideCtrl.createRide)
router.route('/absentees/:id').get(rideCtrl.absenteeStudents)
router.route('/start').post(rideCtrl.startRide)
router.route('/end').post(rideCtrl.endRide)
router.route('/update').post(rideCtrl.updateDriverLocation)
router.route('/arrived').post(rideCtrl.arrivedAtLocation)
router.route('/parentConfirm').post(rideCtrl.confirmDropOrPickup)

export default router
