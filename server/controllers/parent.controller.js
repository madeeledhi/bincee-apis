// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import map from 'lodash/fp/map'
import size from 'lodash/fp/size'
import filter from 'lodash/fp/filter'
import uniqBy from 'lodash/fp/uniqBy'
import flow from 'lodash/fp/flow'
import flatten from 'lodash/fp/flatten'

import Sequelize from 'sequelize'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    destroy,
    update,
    findMultiple,
    sendShiftNotification,
    getFBData,
    sendNotification,
} from '../utils'
import config from '../../config/config'
const Op = Sequelize.Op

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
                                    shift_morning,
                                    shift_evening,
                                    driver_id,
                                } = studentValue
                                return findOne('Driver', {
                                    driver_id,
                                }).then(driver => {
                                    return findOne('Grade', {
                                        grade_id,
                                    }).then(grade => {
                                        return {
                                            ...studentValue,
                                            grade: grade
                                                ? grade.dataValues
                                                : {},
                                            driver: driver
                                                ? driver.dataValues
                                                : {},
                                        }
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
                        return findMultiple('Bus', { driver_id: id }).then(
                            buses => {
                                if (size(buses) > 0) {
                                    const mappedBusses = map(bus => {
                                        const { dataValues: busValues } = bus
                                        return busValues
                                    })(buses)

                                    return res.status(200).json({
                                        status: 200,
                                        data: {
                                            ...driverValues,
                                            school: schoolValues,
                                            buses: mappedBusses,
                                        },
                                    })
                                } else {
                                    return res.status(200).json({
                                        status: 200,
                                        data: {
                                            ...driverValues,
                                            school: schoolValues,
                                            buses: [],
                                        },
                                    })
                                }
                            },
                        )
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
                    const { shift_morning, shift_evening } = studentValues
                    return findMultiple('Shift', {
                        shift_id: {
                            [Op.or]: [shift_morning, shift_evening],
                        },
                    }).then(shifts => {
                        if (size(shifts) > 0) {
                            return map(shift => {
                                const { dataValues: shiftValues } = shift
                                return shiftValues
                            })(shifts)
                        } else {
                            return []
                        }
                    })
                })(students)
                return Promise.all(mappedShifts).then(response => {
                    const filtered = flow(
                        flatten,
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
    const { topic } = getOr({}, 'body')(req)
    const notification = {
        title: `Test Notification`,
        body: `Check Notification Recieved`,
        type: 'Evening1',
    }
    return sendNotification(topic, notification, { test: 'success' }).then(
        resp => {
            console.log('resp: ', resp)
            return res.status(200).json({
                status: 200,
                data: { message: 'Notifications sent successfully' },
            })
        },
    )
}

export default {
    getDriverData,
    getUserData,
    getDriverShifts,
    testNotification,
}
