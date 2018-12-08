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
router.route('/driver/bus/:id').get(schoolCtrl.driverBusList)

router
    .route('/bus/:id')
    .get(schoolCtrl.getBus)
    .delete(schoolCtrl.deleteBus)
    .post(schoolCtrl.updateBus)

router
    .route('/leave/create')
    .post(validate(paramValidation.createLeave), schoolCtrl.createLeave)

router
    .route('/leave/:id')
    .get(schoolCtrl.getLeave)
    .delete(schoolCtrl.deleteLeave)
    .post(schoolCtrl.updateLeave)

router.route('/student/leaves/:id').get(schoolCtrl.studentLeaveList)
router
    .route('/notification/create')
    .post(
        validate(paramValidation.createNotification),
        schoolCtrl.createNotification,
    )
router
    .route('/student/notification/:id')
    .get(schoolCtrl.studentNotificationList)
router.route('/notification/list/:id').get(schoolCtrl.schoolNotificationList)
router.route('/notification/list/').get(schoolCtrl.notificationList)

router
    .route('/notification/:id')
    .get(schoolCtrl.getAnnouncement)
    .post(schoolCtrl.updateAnnouncement)

router
    .route('/grade/create')
    .post(validate(paramValidation.createGrade), schoolCtrl.createGrade)
router.route('/grade/list').get(schoolCtrl.gradeList)

router
    .route('/grade/:id')
    .get(schoolCtrl.getGrade)
    .delete(schoolCtrl.deleteGrade)
    .post(schoolCtrl.updateGrade)

router
    .route('/shift/create')
    .post(validate(paramValidation.createShift), schoolCtrl.createShift)
router.route('/shift/list').get(schoolCtrl.shiftList)

router
    .route('/shift/:id')
    .get(schoolCtrl.getShift)
    .delete(schoolCtrl.deleteShift)
    .post(schoolCtrl.updateShift)

router
    .route('/student/create')
    .post(validate(paramValidation.createStudent), schoolCtrl.createStudent)
router.route('/student/list').get(schoolCtrl.studentList)
router.route('/parent/student/:id').get(schoolCtrl.parentStudentList)

router
    .route('/student/:id')
    .get(schoolCtrl.getStudent)
    .delete(schoolCtrl.deleteStudent)
    .post(schoolCtrl.updateStudent)

router
    .route('/driver/create')
    .post(validate(paramValidation.createDriver), schoolCtrl.createDriver)
router.route('/driver/list').get(schoolCtrl.driverList)

router
    .route('/driver/:id')
    .get(schoolCtrl.getDriver)
    .delete(schoolCtrl.deleteDriver)
    .post(schoolCtrl.updateDriver)

router
    .route('/parent/create')
    .post(validate(paramValidation.createParent), schoolCtrl.createParent)
router.route('/parent/list').get(schoolCtrl.parentList)

router
    .route('/parent/:id')
    .get(schoolCtrl.getParent)
    .delete(schoolCtrl.deleteParent)
    .post(schoolCtrl.updateParent)

export default router
