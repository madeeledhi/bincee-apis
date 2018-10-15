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
router.route('/list').get(userCtrl.list)

router
    .route('/:id')

    /** GET /api/users/:userId - Get user */
    .get(userCtrl.getUserById)

    /** post /api/users/:userId - Update user */
    .post(userCtrl.updateUser)

    /** DELETE /api/users/:userId - Delete user */
    .delete(userCtrl.removeUserById)

router
    .route('/')

    /** GET /api/users/:userId - Get user */
    .get(userCtrl.getUserByUsername)

export default router
