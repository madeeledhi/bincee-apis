// libs
import express from 'express'
import validate from 'express-validation'

// src
import paramValidation from '../../config/param-validation'
import adminCtrl from '../controllers/admin.controller'

const router = express.Router() // eslint-disable-line new-cap

router
    .route('/school/create')
    .post(validate(paramValidation.createSchool), adminCtrl.createSchool)
router.route('/school/list').get(adminCtrl.schoolList)

router
    .route('/school/:id')
    .get(adminCtrl.getSchool)
    .delete(adminCtrl.deleteSchool)
    .post(adminCtrl.updateSchoolDetails)

export default router
