// libs
import getOr from 'lodash/fp/getOr'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniqueId from 'lodash/fp/uniqueId'
import size from 'lodash/fp/size'
import toLower from 'lodash/fp/toLower'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import split from 'lodash/fp/split'
import includes from 'lodash/fp/includes'

import Sequelize from 'sequelize'

// src
import {
    createFBData,
    updateFBData,
    findOne,
    listAll,
    findById,
    findMultiple,
    createOne,
    createMutiple,
    destroy,
    update,
} from '../utils'

const Op = Sequelize.Op

function createRide(req, res) {
    const { driver_id, shifts } = getOr({}, 'body')(req)
    //  Return students for current driver and return pickup or dropoff for current shift
    return findMultiple('Student', {
        driver_id,
    })
        .then(students => {
            if (size(students) > 0) {
                const filteredStudents = flow(
                    filter(student => {
                        const { dataValues: studentValues } = student
                        const {
                            status,
                            shift_morning,
                            shift_evening,
                        } = studentValues

                        return (
                            toLower(status) === 'active' &&
                            ((shift_morning &&
                                includes(`${shift_morning}`)(shifts)) ||
                                (shift_evening &&
                                    includes(`${shift_evening}`)(shifts)))
                        )
                    }),
                    map(filteredStudent => {
                        const {
                            id,
                            fullname,
                            grade,
                            photo,
                            shift_morning: studentShiftMorning,
                            shift_evening: studentShiftEvening,
                            parent_id,
                        } = filteredStudent
                        return findOne('Parent', {
                            parent_id,
                        }).then(parent => {
                            const { dataValues: parentValues } = parent
                            const {
                                fullname: parentname,
                                phone_no,
                                address,
                                lat,
                                lng,
                                email,
                            } = parentValues
                            return {
                                id,
                                parent_id,
                                fullname,
                                grade,
                                photo,
                                shift_morning: studentShiftMorning,
                                shift_evening: studentShiftEvening,
                                parentname,
                                phone_no,
                                address,
                                lat,
                                lng,
                                email,
                            }
                        })
                    }),
                )(students)
                return Promise.all(filteredStudents).then(response =>
                    res.status(200).json({
                        status: 200,
                        data: filter(({ lat, lng }) => lat !== 0 || lng !== 0)(
                            response,
                        ),
                    }),
                )
            }
            return res.status(200).json({
                status: 404,
                data: { message: 'No students Registered' },
            })
        })
        .catch(e => {
            return next(e)
        })
}

function absenteeStudents(req, res, next) {
    const { driver_id, shifts } = getOr({}, 'body')(req)

    return findMultiple('Student', {
        driver_id,
    })
        .then(students => {
            if (size(students) > 0) {
                const mappedStudents = map(student => {
                    const { dataValues: studentValues } = student
                    return studentValues
                })(students)
                const filteredResponse = filter(
                    ({ status, shift_evening, shift_morning }) =>
                        toLower(status) === 'leave' &&
                        ((shift_morning &&
                            includes(`${shift_morning}`)(shifts)) ||
                            (shift_evening &&
                                includes(`${shift_evening}`)(shifts))),
                )(mappedStudents)
                return res.status(200).json({
                    status: 200,
                    data: filteredResponse,
                })
            }
            return res.status(200).json({ status: 200, data: [] })
        })
        .catch(e => {
            return next(e)
        })
}

export default {
    createRide,
    absenteeStudents,
}
