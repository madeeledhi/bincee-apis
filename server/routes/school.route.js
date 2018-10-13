// libs
import express from 'express'
import validate from 'express-validation'

// src
import paramValidation from '../../config/param-validation'
import schoolCtrl from '../controllers/school.controller'

const router = express.Router() // eslint-disable-line new-cap

router
    .route('/bus/create')
    .post(validate(paramValidation.createBus), schoolCtrl.createBus)
router.route('/bus/list').get(schoolCtrl.busList)

router
    .route('/bus/:id')
    .get(schoolCtrl.getBus)
    .delete(schoolCtrl.deleteBus)
    .post(schoolCtrl.updateBus)

router
    .route('/driver/create')
    .post(validate(paramValidation.createDriver), schoolCtrl.createDriver)
router.route('/driver/list').get(schoolCtrl.driverList)

router
    .route('/driver/:id')
    .get(schoolCtrl.getDriver)
    .delete(schoolCtrl.deleteDriver)
    .post(schoolCtrl.updateDriver)

export default router
