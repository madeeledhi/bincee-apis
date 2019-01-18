// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import map from 'lodash/fp/map'
import size from 'lodash/fp/size'
import filter from 'lodash/fp/filter'
import uniqBy from 'lodash/fp/uniqBy'
import flow from 'lodash/fp/flow'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    destroy,
    update,
    findMultiple,
    sendBulkNotifications,
    getFBData,
} from '../utils'
import config from '../../config/config'

function getUserData(req, res, next) {
    const { id: parent_id } = getOr({}, 'params')(req)
    return findOne('Parent', { parent_id })
        .then(parent => {
            if (parent) {
                const { dataValues: parentValues } = parent
                const { school_id } = parentValues

                return findOne('School', { school_id }).then(school => {
                    const schoolData = school ? school.dataValues : {}
                    return findMultiple('Student', {
                        parent_id,
                    }).then(students => {
                        if (size(students) > 0) {
                            const kids = map(student => {
                                const { dataValues: studentValue } = student
                                const {
                                    grade: grade_id,
                                    shift: shift_id,
                                    driver_id,
                                } = student
                                return findOne('Driver', {
                                    driver_id,
                                }).then(driver => {
                                    return findOne('Shift', {
                                        shift_id,
                                    }).then(shift => {
                                        return findOne('Grade', {
                                            grade_id,
                                        }).then(grade => {
                                            return {
                                                ...studentValue,
                                                grade: grade
                                                    ? grade.dataValues
                                                    : {},
                                                shift: shift
                                                    ? shift.dataValues
                                                    : {},
                                                driver: driver
                                                    ? driver.dataValues
                                                    : {},
                                            }
                                        })
                                    })
                                })
                            })(students)
                            return Promise.all(kids).then(kidsData => {
                                return res.status(200).json({
                                    status: 200,
                                    data: {
                                        ...parentValues,
                                        school: schoolData,
                                        kids: kidsData,
                                    },
                                })
                            })
                        }
                        return res.status(200).json({
                            status: 200,
                            data: {
                                ...parentValues,
                                school: schoolData,
                                kids: [],
                            },
                        })
                    })
                })
            }

            return res
                .status(200)
                .json({ status: 404, data: { message: 'No Parent Found' } })
        })
        .catch(e => {
            return next(e)
        })
}

function getDriverData(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Driver', { driver_id: id })
        .then(driver => {
            if (driver) {
                const { dataValues: driverValues } = driver
                const { school_id } = driverValues

                return findOne('School', { school_id }).then(school => {
                    if (school) {
                        const { dataValues: schoolValues } = school
                        return findOne('Bus', { driver_id: id }).then(bus => {
                            if (bus) {
                                const { dataValues: busValues } = bus
                                const {
                                    registration_no,
                                    description,
                                } = busValues
                                return res.status(200).json({
                                    status: 200,
                                    data: {
                                        ...driverValues,
                                        school: schoolValues,
                                        bus: {
                                            registration_no,
                                            description,
                                        },
                                    },
                                })
                            } else {
                                return res.status(200).json({
                                    status: 200,
                                    data: {
                                        ...driverValues,
                                        school: schoolValues,
                                        bus: {},
                                    },
                                })
                            }
                        })
                    } else {
                        return res.status(200).json({
                            status: 200,
                            data: {
                                ...driverValues,
                                school: {},
                                bus: {},
                            },
                        })
                    }
                })
            } else {
                return res.status(200).json({
                    status: 404,
                    data: { message: 'No Driver Found' },
                })
            }
        })
        .catch(e => {
            return next(e)
        })
}

function getDriverShifts(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Student', { driver_id: id })
        .then(students => {
            if (size(students) > 0) {
                const mappedShifts = map(student => {
                    const { dataValues: studentValues } = student
                    const { shift } = studentValues
                    return findOne('Shift', { shift_id: shift }).then(shift => {
                        if (shift) {
                            const { dataValues: shiftValues } = shift
                            return shiftValues
                        } else {
                            return { shift_id: '' }
                        }
                    })
                })(students)
                return Promise.all(mappedShifts).then(response => {
                    const filtered = flow(
                        filter(({ shift_id }) => shift_id !== ''),
                        uniqBy('shift_id'),
                    )(response)
                    return res.status(200).json({
                        status: 200,
                        data: filtered,
                    })
                })
            } else {
                return res.status(200).json({ status: 200, data: [] })
            }
        })
        .catch(e => {
            return next(e)
        })
}

function testNotification(req, res, next) {
    return getFBData('token', '3').then(response => {
        console.log('response: ', response)
        const { token } = response
        const notification = {
            title: `Test Notification`,
            body: `Check Notification Recieved`,
            type: 'Evening1',
        }
        if (token) {
            return sendBulkNotifications(token, notification, {
                studentId: 1,
            }).then(resp => {
                console.log('resp: ', resp)
                return res.status(200).json({
                    status: 200,
                    data: { message: 'Notifications sent successfully' },
                })
            })
        } else {
            return res.status(200).json({
                status: 302,
                data: {
                    message: 'Notification Failed',
                },
            })
        }
    })
}

export default {
    getDriverData,
    getUserData,
    getDriverShifts,
    testNotification,
}
