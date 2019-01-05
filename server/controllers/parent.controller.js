// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import map from 'lodash/fp/map'
import size from 'lodash/fp/size'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    destroy,
    update,
    findMultiple,
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
                const { school_id } = dataValues

                return findOne('School', { school_id }).then(school => {
                    if (school) {
                        const { dataValues: schoolValues } = school
                        return findOne('Bus', { driver_id: id }).then(bus => {
                            if (bus) {
                                const { dataValues: busValues } = bus
                                const { registration_no, description } = bus
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
                return res
                    .status(200)
                    .json({ status: 404, data: { message: 'No Driver Found' } })
            }
        })
        .catch(e => {
            return next(e)
        })
}

export default {
    getDriverData,
    getUserData,
}
