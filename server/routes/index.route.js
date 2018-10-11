// libs
import express from 'express'

// src
import userRoutes from './user.route'
import authRoutes from './auth.route'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    console.log('here')

    res.status(200).json('OK')
})

// mount user routes at /users
router.use('/users', userRoutes)

// mount auth routes at /auth
router.use('/auth', authRoutes)

export default router
