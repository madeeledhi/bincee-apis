// libs
import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'
// src
import avatarController from '../controllers/avatar.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/upload').post(avatarController.uploadAvatar)

export default router
