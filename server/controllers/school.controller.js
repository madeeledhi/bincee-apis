// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import split from 'lodash/fp/split'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import size from 'lodash/fp/size'
import reduce from 'lodash/fp/reduce'
import keys from 'lodash/fp/keys'
import filter from 'lodash/fp/filter'
import isFinite from 'lodash/isFinite'
import parseInt from 'lodash/parseInt'
import flatten from 'lodash/fp/flatten'

// src
import {
    findOne,
    listAll,
    findById,
    findMultiple,
    createOne,
    createMutiple,
    destroy,
    update,
    sendNotification,
    sendShiftNotification,
    sendEmail,
    getFBData,
    sendSMS,
} from '../utils'
import config from '../../config/config'
import Announcement from '../models/announcement.model'

//Create funtions
function createBus(req, res, next) {
    const { registration_no, description, driver_id } = getOr({}, 'body')(req)
    return findOne('Bus', { registration_no }).then(resBus => {
        if (!resBus) {
            return createOne('Bus', {
                registration_no,
                description,
                driver_id,
            })
                .then(bus => {
                    return res.status(200).json({ status: 200, data: bus })
                })
                .catch(e => {
                    return next(e)
                })
        }

        return res
            .status(200)
            .json({ status: 302, data: { message: 'Bus Already Exists' } })
    })
}
function createStudent(req, res, next) {
    const {
        fullname,
        grade,
        shift_morning,
        shift_evening,
        parent_id,
        driver_id,
        status,
        photo,
    } = getOr({}, 'body')(req)

    return findOne('Student', { fullname, parent_id }).then(resStu => {
        if (!resStu) {
            return createOne('Student', {
                fullname,
                grade,
                shift_morning,
                shift_evening,
                parent_id,
                driver_id,
                status,
                photo,
            })
                .then(student => {
                    return res.status(200).json({ status: 200, data: student })
                })
                .catch(e => {
                    return next(e)
                })
        }

        return res
            .status(200)
            .json({ status: 302, data: { message: 'Student Already Exists' } })
    })
}

function createNotification(req, res, next) {
    const {
        studentArray,
        last_updated = new Date(),
        title,
        description,
        type,
        school_id,
    } = getOr({}, 'body')(req)
    return createOne('Announcement', {
        school_id,
        last_updated,
        type,
        title,
        description,
    })
        .then(announcement => {
            if (type === 'school') {
                sendNotification(`${type}_${school_id}`, {
                    id: announcement.id,
                    title,
                    description,
                    type: 'Announcement',
                })
                return res.status(200).json({
                    status: 200,
                    data: announcement,
                })
            } else {
                const { dataValues } = announcement
                const { id: announcement_id } = dataValues
                if (size(studentArray) > 0) {
                    const multiply = map(
                        ({ id: student_id, parent_id, fullname }) => {
                            return createOne('Notify', {
                                student_id,
                                announcement_id,
                            }).then(notify => {
                                sendShiftNotification(
                                    parent_id,
                                    {
                                        id: announcement.id,
                                        title,
                                        student: fullname,
                                        description,
                                        type: 'Alert',
                                    },
                                    {
                                        student_id,
                                    },
                                )

                                return notify
                            })
                        },
                    )(studentArray)
                    return Promise.all(multiply).then(response =>
                        res.status(200).json({
                            status: 200,
                            data: {
                                announcement: dataValues,
                                notify: response,
                            },
                        }),
                    )
                } else {
                    return res.status(200).json({
                        status: 200,
                        data: {
                            announcement,
                            notify: [],
                        },
                    })
                }
            }
        })
        .catch(e => {
            return next(e)
        })
}

function createLeave(req, res, next) {
    const {
        from_date: from,
        to_date: to,
        student_id,
        comment,
        school_id,
    } = getOr({}, 'body')(req)

    const isNumber = flow(
        parseInt,
        isFinite,
    )
    const getInt = data => (isNumber(data) ? parseInt(data) : '')
    if (!(typeof getInt(to) === 'number' || typeof getInt(from) === 'number')) {
        return res.status(200).json({
            status: 400,
            data: { message: 'Invalide from/to date' },
        })
    }

    if (from > to) {
        return res.status(200).json({
            status: 400,
            data: { message: 'From_Date Cannot be After To_Date' },
        })
    }
    const day = 24 * 60 * 60
    const from_date = new Date(getInt(from) * 1000)
    const to_date = new Date((getInt(to) + day) * 1000)

    return findOne('Leaves', { from_date, to_date, student_id }).then(
        resLeave => {
            if (!resLeave) {
                return createOne('Leaves', {
                    from_date,
                    to_date,
                    student_id,
                    comment,
                    school_id,
                })
                    .then(Leave => {
                        return res
                            .status(200)
                            .json({ status: 200, data: Leave })
                    })
                    .catch(e => {
                        return next(e)
                    })
            }
            return res.status(200).json({
                status: 302,
                data: { message: 'Leave Already Exists' },
            })
        },
    )
}
function createDriver(req, res, next) {
    const {
        username,
        password,
        fullname,
        phone_no,
        status,
        photo,
        enableFleet,
    } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues

            return findOne('User', {
                username,
                password,
            }).then(resUser => {
                if (!resUser) {
                    const token = jwt.sign({ username }, config.jwtSecret)
                    const user = { username, password, type: 3, token }
                    const driver = {
                        fullname,
                        phone_no,
                        status,
                        school_id: id,
                        photo,
                        enableFleet,
                    }
                    return createOne('User', user)
                        .then(savedUser => {
                            const { dataValues } = savedUser
                            const { id: driver_id, username } = dataValues
                            return createOne('Driver', {
                                driver_id,
                                ...driver,
                            }).then(savedDriver => {
                                const { dataValues: driverValues } = savedDriver
                                sendSMS(
                                    phone_no,
                                    `Welcome to Bincee, Your Account Username: ${username} with Password: ${password} has been created`,
                                )
                                return res
                                    .status(200)
                                    .json({
                                        status: 200,
                                        data: {
                                            username,
                                            ...driverValues,
                                        },
                                    })
                                    .catch(err => {
                                        destroy('User', { id: driver_id })
                                        return next(e)
                                    })
                            })
                        })
                        .catch(e => next(e))
                }

                return res
                    .status(200)
                    .json({
                        status: 302,
                        data: {
                            message: 'Driver Already Exists',
                        },
                    })
                    .catch(e => {
                        return next(e)
                    })
            })
        }
        return res
            .status(200)
            .json({ status: 400, data: { message: 'Cannot Create Driver' } })
    })
}
function createParent(req, res, next) {
    const {
        username,
        password,
        fullname,
        phone_no,
        address,
        email,
        lat,
        lng,
        status,
        photo,
    } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues

            return findOne('User', {
                username,
                password,
            }).then(resUser => {
                if (!resUser) {
                    const token = jwt.sign({ username }, config.jwtSecret)
                    const user = { username, password, type: 4, token }
                    const parent = {
                        fullname,
                        phone_no,
                        address,
                        email,
                        lat,
                        lng,
                        status,
                        school_id: id,
                        photo,
                    }
                    return createOne('User', user)
                        .then(savedUser => {
                            const { dataValues } = savedUser
                            const { id: parent_id, username } = dataValues
                            return createOne('Parent', {
                                parent_id,
                                ...parent,
                            }).then(savedParent => {
                                const { dataValues: parentValues } = savedParent

                                sendEmail(
                                    email,
                                    'Bincee Login Credentials',
                                    {
                                        username,
                                        password,
                                    },
                                    false,
                                )
                                sendEmail(
                                    email,
                                    'Welcome to Bincee',
                                    {
                                        title: 'Welcome',
                                        message: 'Welcome to Bincee Tracking',
                                    },
                                    true,
                                )
                                return res
                                    .status(200)
                                    .json({
                                        status: 200,
                                        data: {
                                            username,
                                            ...parentValues,
                                        },
                                    })
                                    .catch(err => {
                                        destroy('User', {
                                            id: parent_id,
                                        })
                                        return next(e)
                                    })
                            })
                        })
                        .catch(e => next(e))
                }

                return res.status(200).json({
                    status: 302,
                    data: { message: 'Parent Already Exists' },
                })
            })
        }
        return res
            .status(200)
            .json({ status: 400, data: { message: 'Cannot Create Parent' } })
    })
}
function createGrade(req, res, next) {
    const { grade_name, section } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)
    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues
            const grade_section = `${grade_name + section}`
            return findOne('Grade', { grade_name, section })
                .then(resGrade => {
                    if (!resGrade) {
                        return createOne('Grade', {
                            grade_name,
                            section,
                            grade_section,
                            school_id: id,
                        }).then(grade => {
                            return res
                                .status(200)
                                .json({ status: 200, data: grade })
                        })
                    }

                    return res.status(200).json({
                        status: 302,
                        data: {
                            message: 'Grade Already Exists',
                        },
                    })
                })
                .catch(e => {
                    return next(e)
                })
        }
        return res
            .status(200)
            .json({ status: 400, data: { message: 'Cannot Create Grade' } })
    })
}
function createShift(req, res, next) {
    const { shift_name, start_time, end_time, type } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)
    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id } = dataValues
            return findOne('Shift', {
                shift_name,
                start_time,
                end_time,
                type,
                school_id: id,
            })
                .then(resShift => {
                    if (!resShift) {
                        return createOne('Shift', {
                            shift_name,
                            start_time,
                            end_time,
                            type,
                            school_id: id,
                        }).then(shift => {
                            return res
                                .status(200)
                                .json({ status: 200, data: shift })
                        })
                    }

                    return res.status(200).json({
                        status: 302,
                        data: {
                            message: 'Shift Already Exists',
                        },
                    })
                })
                .catch(e => {
                    return next(e)
                })
        }
        return res
            .status(200)
            .json({ status: 400, data: { message: 'Cannot Create Shift' } })
    })
}

//Delete funtions
function deleteBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { id })
        .then(() =>
            res
                .status(200)
                .json({ status: 200, data: { message: 'Bus Deleted' } }),
        )
        .catch(e => next(e))
}
function deleteLeave(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Leaves', { id })
        .then(() =>
            res
                .status(200)
                .json({ status: 200, data: { message: 'Leave Deleted' } }),
        )
        .catch(e => {
            return next(e)
        })
}
function deleteShift(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Shift', { shift_id: id })
        .then(() =>
            res
                .status(200)
                .json({ status: 200, data: { message: 'Shift Deleted' } }),
        )
        .catch(e => next(e))
}
function deleteGrade(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Grade', { grade_id: id })
        .then(() =>
            res
                .status(200)
                .json({ status: 200, data: { message: 'Grade Deleted' } }),
        )
        .catch(e => next(e))
}

function deleteStudent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Leaves', { student_id: id }).then(() => {
        return destroy('Student', { id })
            .then(() =>
                res.status(200).json({
                    status: 200,
                    data: { message: 'Student Deleted' },
                }),
            )
            .catch(e => next(e))
    })
}
function deleteDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { driver_id: id })
        .then(() => {
            return destroy('Driver', { driver_id: id }).then(() => {
                return destroy('User', {
                    id,
                }).then(() =>
                    res.status(200).json({
                        status: 200,
                        data: { message: 'Driver Deleted' },
                    }),
                )
            })
        })
        .catch(e => next(e))
}
function deleteParent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Parent', { parent_id: id })
        .then(() => {
            return destroy('User', {
                id,
            }).then(() =>
                res.status(200).json({
                    status: 200,
                    data: { message: 'Parent Deleted' },
                }),
            )
        })
        .catch(e => next(e))
}

//Update funtions
function updateBus(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Bus', { id }, newData)
        .then(bus => res.status(200).json({ status: 200, data: bus }))
        .catch(e => {
            return next(e)
        })
}

function updateLeave(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Leaves', { id }, newData).then(leave =>
        res.status(200).json({ status: 200, data: leave }),
    )
}
function updateAnnouncement(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Announcement', { id }, newData)
        .then(announcement =>
            res.status(200).json({ status: 200, data: announcement }),
        )
        .catch(e => {
            return next(e)
        })
}
function updateGrade(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Grade', { grade_id: id }, newData)
        .then(grade => res.status(200).json({ status: 200, data: grade }))
        .catch(e => {
            return next(e)
        })
}
function updateShift(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Shift', { shift_id: id }, newData)
        .then(shift => res.status(200).json({ status: 200, data: shift }))
        .catch(e => {
            return next(e)
        })
}
function updateStudent(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Student', { id }, newData)
        .then(student => res.status(200).json({ status: 200, data: student }))
        .catch(e => {
            return next(e)
        })
}
function updateDriver(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Driver', { driver_id: id }, newData)
        .then(driver => res.status(200).json({ status: 200, data: driver }))
        .catch(e => {
            return next(e)
        })
}
function updateParent(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Parent', { parent_id: id }, newData)
        .then(parent => res.status(200).json({ status: 200, data: parent }))
        .catch(e => {
            return next(e)
        })
}

//Get funtions
function getBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Bus', { id })
        .then(bus => res.status(200).json({ status: 200, data: bus }))
        .catch(e => {
            return next(e)
        })
}
function getLeave(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Leaves', { id })
        .then(leave => res.status(200).json({ status: 200, data: leave }))
        .catch(e => {
            return next(e)
        })
}
function getAnnouncement(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Announcement', { id })
        .then(announcement =>
            res.status(200).json({ status: 200, data: announcement }),
        )
        .catch(e => {
            return next(e)
        })
}
function getShift(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Shift', { shift_id: id })
        .then(shift => res.status(200).json({ status: 200, data: shift }))
        .catch(e => {
            return next(e)
        })
}
function getGrade(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Grade', { grade_id: id })
        .then(grade => res.status(200).json({ status: 200, data: grade }))
        .catch(e => {
            return next(e)
        })
}
function getStudent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Student', { id })
        .then(student => res.status(200).json({ status: 200, data: student }))
        .catch(e => {
            return next(e)
        })
}
function getDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Driver', { driver_id: id })
        .then(driver => res.status(200).json({ status: 200, data: driver }))
        .catch(e => {
            return next(e)
        })
}
function getParent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Parent', { parent_id: id })
        .then(parent => res.status(200).json({ status: 200, data: parent }))
        .catch(e => {
            return next(e)
        })
}

//getList funtions
function busList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id, type } = dataValues

                return findMultiple('Driver', {
                    school_id: id,
                }).then(drivers => {
                    if (size(drivers) > 0) {
                        const mappedBuses = map(driver => {
                            const { dataValues: driverValues } = driver
                            const { driver_id } = driverValues
                            return findMultiple('Bus', { driver_id }).then(
                                bus => {
                                    return bus
                                },
                            )
                        })(drivers)
                        return Promise.all(mappedBuses).then(buses => {
                            if (size(buses) > 0) {
                                const filteredBuses = flow(
                                    flatten,
                                    filter(b => b),
                                )(buses)
                                const busMap = map(bus => {
                                    const { dataValues: busValues } = bus
                                    console.log('bus:', bus)
                                    const { driver_id } = busValues
                                    return findOne('Driver', {
                                        driver_id,
                                    }).then(driver => {
                                        return {
                                            ...busValues,
                                            driver_name: driver
                                                ? driver.dataValues.fullname
                                                : '',
                                        }
                                    })
                                })(filteredBuses)
                                return Promise.all(busMap).then(results => {
                                    return res.status(200).json({
                                        status: 200,
                                        data: results,
                                    })
                                })
                            } else {
                                return res.status(200).json({
                                    status: 404,
                                    data: { message: 'No Bus Found' },
                                })
                            }
                        })
                    } else {
                        return res.status(200).json({
                            status: 404,
                            data: { message: 'No Bus Found' },
                        })
                    }
                })
            }
            return res
                .status(200)
                .json({ status: 404, data: { message: 'No Buses Found' } })
        })
        .catch(e => {
            return next(e)
        })
}
function gradeList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id, type } = dataValues

                return findMultiple('Grade', {
                    school_id: id,
                }).then(grade =>
                    res.status(200).json({ status: 200, data: grade }),
                )
            }
            return res
                .status(200)
                .json({ status: 404, data: { message: 'No Grades Found' } })
        })
        .catch(e => {
            return next(e)
        })
}
function shiftList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id, type } = dataValues

                return findMultiple('Shift', {
                    school_id: id,
                }).then(shift =>
                    res.status(200).json({ status: 200, data: shift }),
                )
            }
            return res
                .status(200)
                .json({ status: 404, data: { message: 'No Shifts Found' } })
        })
        .catch(e => {
            return next(e)
        })
}
function studentList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id, type } = dataValues
                //verify it
                return findMultiple('Parent', {
                    school_id: id,
                }).then(parents => {
                    if (size(parents) > 0) {
                        const mappedStudents = map(mappedParent => {
                            const {
                                dataValues: mappedParentValues,
                            } = mappedParent
                            const { parent_id } = mappedParentValues
                            return findMultiple('Student', { parent_id }).then(
                                joinedStudents => {
                                    return map(s => s.dataValues)(
                                        joinedStudents,
                                    )
                                },
                            )
                        })(parents)
                        return Promise.all(mappedStudents).then(students => {
                            if (size(students) > 0) {
                                const flatStudents = flatten(students)
                                const studentMaps = map(student => {
                                    const {
                                        parent_id,
                                        driver_id,
                                        grade: grade_id,
                                        shift_morning,
                                        shift_evening,
                                    } = student
                                    return findOne('Driver', {
                                        driver_id,
                                    }).then(driver => {
                                        return findOne('Parent', {
                                            parent_id,
                                        }).then(parent => {
                                            return findOne('Grade', {
                                                grade_id,
                                            }).then(grade => {
                                                return findOne('Shift', {
                                                    shift_id: shift_morning,
                                                }).then(shift1 => {
                                                    return findOne('Shift', {
                                                        shift_id: shift_evening,
                                                    }).then(shift2 => {
                                                        return {
                                                            ...student,
                                                            grade_name: grade
                                                                ? grade
                                                                      .dataValues
                                                                      .grade_section
                                                                : '',
                                                            shift_morning_name: shift1
                                                                ? shift1
                                                                      .dataValues
                                                                      .shift_name
                                                                : '',
                                                            shift_evening_name: shift2
                                                                ? shift2
                                                                      .dataValues
                                                                      .shift_name
                                                                : '',
                                                            driver_name: driver
                                                                ? driver
                                                                      .dataValues
                                                                      .fullname
                                                                : '',
                                                            parent_name: parent
                                                                ? parent
                                                                      .dataValues
                                                                      .fullname
                                                                : '',
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })(flatStudents)
                                return Promise.all(studentMaps).then(result => {
                                    return res.status(200).json({
                                        status: 200,
                                        data: result,
                                    })
                                })
                            } else {
                                return res.status(200).json({
                                    status: 404,
                                    data: {
                                        message: 'No Students Found',
                                    },
                                })
                            }
                        })
                    } else {
                        return res.status(200).json({
                            status: 404,
                            data: {
                                message: 'No Students Found',
                            },
                        })
                    }
                })
            }
            return res.status(200).json({
                status: 404,
                data: { message: 'No Students Found' },
            })
        })
        .catch(e => {
            return next(e)
        })
}

function driverBusList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Driver', { driver_id: id })
        .then(driver => {
            if (driver) {
                const { dataValues: driverValues } = driver
                return findMultiple('Bus', { driver_id: id }).then(buses => {
                    if (size(buses) > 0) {
                        const busValues = map(bus => {
                            const { dataValues: busValues } = bus
                            return busValues
                        })(buses)
                        const data = { ...driverValues, buses: busValues }
                        return res.status(200).json({ status: 200, data })
                    } else {
                        const data = { ...driverValues, buses: {} }
                        return res.status(200).json({ status: 200, data })
                    }
                })
            } else {
                return res.status(200).json({
                    status: 404,
                    data: { message: 'No Driver Exists' },
                })
            }
        })
        .catch(e => {
            return next(e)
        })
}
function studentNotificationList(req, res, next) {
    const { id } = getOr({}, 'params')(req)

    return findMultiple('Notify', { student_id: id })
        .then(announcements => {
            if (size(announcements) > 0) {
                const mappedAnnouncements = map(ann => {
                    const { dataValues: annValues } = ann
                    const { announcement_id } = annValues
                    return findOne('Announcement', {
                        id: announcement_id,
                    }).then(notif => {
                        return notif
                    })
                })(announcements)
                return Promise.all(mappedAnnouncements).then(response => {
                    return res.status(200).json({
                        status: 200,
                        data: response,
                    })
                })
            } else {
                return res.status(200).json({
                    status: 404,
                    data: { message: 'No Announcements Found' },
                })
            }
        })
        .catch(e => {
            return next(e)
        })
}
function schoolNotificationList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Announcement', { school_id: id, type: 'school' })
        .then(announcements =>
            res.status(200).json({ status: 200, data: announcements }),
        )
        .catch(e => {
            return next(e)
        })
}

function parentStudentNotifications(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Student', { parent_id: id })
        .then(students => {
            if (size(students) > 0) {
                const notifications = map(student => {
                    const { dataValues: studentValues } = student
                    const { id: student_id } = studentValues
                    return findMultiple('Notify', { student_id }).then(
                        announcements => {
                            const finalResponse = map(ann => {
                                const { announcement_id } = ann.dataValues
                                return findOne('Announcement', {
                                    id: announcement_id,
                                }).then(annn => {
                                    return findOne('NotifyStatus', {
                                        announcement_id,
                                    }).then(resStatus => {
                                        const statusData = resStatus
                                            ? resStatus.dataValues
                                            : { status: undefined }
                                        return {
                                            ...annn.dataValues,
                                            status: statusData.status,
                                        }
                                    })
                                })
                            })(announcements)

                            return Promise.all(finalResponse).then(rest => ({
                                student_id,
                                data: rest,
                            }))
                        },
                    )
                })(students)

                return Promise.all(notifications).then(response => {
                    return res.status(200).json({
                        status: 200,
                        data: response,
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

function notificationList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id } = dataValues
                return findMultiple('Announcement', {
                    school_id: id,
                }).then(announcements =>
                    res.status(200).json({ status: 200, data: announcements }),
                )
            }
            return res.status(200).json({
                status: 404,
                data: { message: 'No Announcements Founds' },
            })
        })
        .catch(e => {
            return next(e)
        })
}
function studentLeaveList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Leaves', { student_id: id })
        .then(leave => res.status(200).json({ status: 200, data: leave }))
        .catch(e => {
            return next(e)
        })
}
function leavesList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id } = dataValues

                return listAll('Leaves')
                    .then(leaves => {
                        if (size(leaves) > 0) {
                            const filteredLeaves = map(leave => {
                                const { dataValues: leaveValues } = leave
                                const { student_id, id: leave_id } = leaveValues
                                return findOne('Student', {
                                    id: student_id,
                                }).then(student => {
                                    if (student) {
                                        const {
                                            dataValues: studentValues,
                                        } = student
                                        const { parent_id } = studentValues
                                        return findOne('Parent', {
                                            parent_id,
                                            school_id: id,
                                        }).then(parent => {
                                            if (parent) {
                                                return {
                                                    ...leaveValues,
                                                    ...studentValues,
                                                    id: leave_id,
                                                    found: true,
                                                }
                                            } else {
                                                return {
                                                    ...leaveValues,
                                                    found: false,
                                                }
                                            }
                                        })
                                    } else {
                                        return { ...leaveValues, found: false }
                                    }
                                })
                            })(leaves)

                            return Promise.all(filteredLeaves).then(
                                response => {
                                    const filteredResponse = filter(
                                        ({ found }) => found === true,
                                    )(response)
                                    return res.status(200).json({
                                        status: 200,
                                        data: filteredResponse,
                                    })
                                },
                            )
                        } else {
                            return res
                                .status(200)
                                .json({ status: 200, data: [] })
                        }
                    })
                    .catch(e => {
                        return next(e)
                    })
            } else {
                return res.status(200).json({
                    status: 404,
                    data: { message: 'No Leaves Found' },
                })
            }
        })
        .catch(e => {
            return next(e)
        })
}

function parentStudentList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Student', { parent_id: id }).then(student =>
        res.status(200).json({ status: 200, data: student }),
    )
}
function driverList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id } = dataValues
                return findMultiple('Driver', { school_id: id })
                    .then(driver =>
                        res.status(200).json({
                            status: 200,
                            data: driver,
                        }),
                    )
                    .catch(e => {
                        return next(e)
                    })
            } else {
                return res.status(200).json({
                    status: 404,
                    data: { message: 'No Driver Accounts Found' },
                })
            }
        })
        .catch(e => {
            return next(e)
        })
}

function parentList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token })
        .then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id } = dataValues
                return findMultiple('Parent', { school_id: id })
                    .then(parent =>
                        res.status(200).json({ status: 200, data: parent }),
                    )
                    .catch(e => {
                        return next(e)
                    })
            }
            return res.status(200).json({
                status: 404,
                data: { message: 'No Parents Accounts Founds' },
            })
        })
        .catch(e => {
            return next(e)
        })
}

export default {
    createBus,
    createNotification,
    createLeave,
    createGrade,
    createShift,
    createStudent,
    createDriver,
    createParent,
    deleteBus,
    deleteLeave,
    deleteShift,
    deleteGrade,
    deleteStudent,
    deleteDriver,
    deleteParent,
    updateDriver,
    updateLeave,
    updateAnnouncement,
    updateBus,
    updateShift,
    updateGrade,
    updateStudent,
    updateParent,
    getBus,
    getAnnouncement,
    getLeave,
    getShift,
    getGrade,
    getDriver,
    getParent,
    getStudent,
    busList,
    shiftList,
    gradeList,
    studentList,
    driverBusList,
    parentStudentList,
    studentNotificationList,
    schoolNotificationList,
    notificationList,
    parentStudentNotifications,
    studentLeaveList,
    driverList,
    parentList,
    leavesList,
}
