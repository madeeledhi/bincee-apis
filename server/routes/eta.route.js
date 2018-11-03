// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'

// src
import etaCtrl from '../controllers/eta.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/find').post(etaCtrl.getEta)

export default router
