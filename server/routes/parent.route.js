// libs
import express from 'express'
import validate from 'express-validation'

// src
import parentCtrl from '../controllers/parent.controller'

const router = express.Router() // eslint-disable-line new-cap

/** GET /api/users - Get list of users */
router.route('/getData/:id').get(parentCtrl.getUserData)

export default router
