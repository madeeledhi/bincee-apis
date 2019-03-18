// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'

// src
import notifyCtrl from '../controllers/notifications.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/create').post(notifyCtrl.createNotificationStatus)
router.route('/update/:id').post(notifyCtrl.updateNotificationStatus)
router.route('/listbyid/:id').post(notifyCtrl.listAll)

export default router
