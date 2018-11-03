// libs
import express from 'express'

// src
import userRoutes from './user.route'
import authRoutes from './auth.route'
import adminRoutes from './admin.route'
import schoolRoute from './school.route'
import rideRoute from './ride.route'
import parentRoute from './parent.route'
import etaRoute from './eta.route'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'))

// mount user routes at /users
router.use('/users', userRoutes)

router.use('/eta', etaRoute)

// mount user routes at /admin
router.use('/admin', adminRoutes)

// mount user routes at /school
router.use('/school', schoolRoute)

// mount auth routes at /auth
router.use('/auth', authRoutes)

router.use('/ride', rideRoute)

router.use('/parent', parentRoute)

export default router
