// libs
import express from 'express'
import validate from 'express-validation'

// src
import paramValidation from '../../config/param-validation'
import userCtrl from '../controllers/user.controller'

const router = express.Router() // eslint-disable-line new-cap

/** GET /api/users - Get list of users */
router.route('/list').get(userCtrl.list)

/** POST /api/users - Create new user */
router
    .route('/create')
    .post(validate(paramValidation.createUser), userCtrl.create)

router
    .route('/:userId')

    /** GET /api/users/:userId - Get user */
    .get(userCtrl.getUserById)

    /** post /api/users/:userId - Update user */
    .post(validate(paramValidation.updateUser), userCtrl.updateUserById)

    /** DELETE /api/users/:userId - Delete user */
    .delete(userCtrl.removeUserById)

router
    .route('/')

    /** GET /api/users/:userId - Get user */
    .get(userCtrl.getUserByUsername)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load)

export default router
