// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import split from 'lodash/fp/split'
import flow from 'lodash/fp/flow'

// src
import {
    findOne,
    listAll,
    findById,
    findMultiple,
    createOne,
    destroy,
    update,
    findAcross,
} from '../utils'
import config from '../../config/config'

//Create funtions
function createBus(req, res, next) {
    const { registration_no, description, driver_id } = getOr({}, 'body')(req)
    return findOne('Bus', { registration_no }).then(resBus => {
        if (!resBus) {
            return createOne('Bus', {
                registration_no,
                description,
                driver_id,
            }).then(bus => {
                return res.status(200).json(bus)
            })
        }

        return res.status(302).json({ message: 'Bus Already Exists' })
    })
}
function createStudent(req, res, next) {
    const { username, grade, shift, parent_id, driver_id, status } = getOr(
        {},
        'body',
    )(req)
    return findOne('Student', { username, parent_id }).then(resStu => {
        if (!resStu) {
            return createOne('Student', {
                username,
                grade,
                shift,
                parent_id,
                driver_id,
                status,
            }).then(student => {
                return res.status(200).json(student)
            })
        }

        return res.status(302).json({ message: 'Student Already Exists' })
    })
}
function createDriver(req, res, next) {
    const { username, password, fullname, phone_no, status } = getOr(
        {},
        'body',
    )(req)
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
                        bus_id,
                        status,
                        school_id: id,
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
                                return res
                                    .status(200)
                                    .json({
                                        username,
                                        ...driverValues,
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
                    .status(302)
                    .json({ message: 'Driver Already Exists' })
            })
        }
        return res.status(302).json({ message: 'Cannot Create Driver' })
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
                                return res
                                    .status(200)
                                    .json({
                                        username,
                                        ...parentValues,
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

                return res
                    .status(302)
                    .json({ message: 'Parent Already Exists' })
            })
        }
        return res.status(302).json({ message: 'Cannot Create Parent' })
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
            return findOne('Grade', { grade_name, section }).then(resGrade => {
                if (!resGrade) {
                    return createOne('Grade', {
                        grade_name,
                        section,
                        grade_section,
                        school_id: id,
                    }).then(grade => {
                        return res.status(200).json(grade)
                    })
                }

                return res.status(302).json({ message: 'Grade Already Exists' })
            })
        }
        return res.status(302).json({ message: 'Cannot Create Grade' })
    })
}
function createShift(req, res, next) {
    const { shift_name, start_time, end_time } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)
    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues
            return findOne('Shift', {
                shift_name,
                start_time,
                grade_name,
                school_id: id,
            }).then(resShift => {
                if (!resShift) {
                    return createOne('Shift', {
                        shift_name,
                        start_time,
                        grade_name,
                    }).then(shift => {
                        return res.status(200).json(shift)
                    })
                }

                return res.status(302).json({ message: 'Shift Already Exists' })
            })
        }
        return res.status(302).json({ message: 'Cannot Create Shift' })
    })
}

//Delete funtions
function deleteBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { id }).then(() =>
        res.status(200).json({ message: 'Bus Deleted' }),
    )
}
function deleteShift(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Shift', { id }).then(() =>
        res.status(200).json({ message: 'Shift Deleted' }),
    )
}
function deleteGrade(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Grade', { id }).then(() =>
        res.status(200).json({ message: 'Grade Deleted' }),
    )
}
function deleteStudent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Student', { id }).then(() =>
        res.status(200).json({ message: 'Student Deleted' }),
    )
}
function deleteDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { driver_id: id }).then(() => {
        return destroy('Driver', { driver_id: id }).then(() => {
            return destroy('User', {
                id,
            }).then(() => res.status(200).json({ message: 'Driver Deleted' }))
        })
    })
}
function deleteParent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Parent', { parent_id: id }).then(() => {
        return destroy('User', { id }).then(() =>
            res.status(200).json({ message: 'Parent Deleted' }),
        )
    })
}

//Update funtions
function updateBus(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Bus', { id }, newData).then(bus => res.status(200).json(bus))
}
function updateGrade(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Grade', { id }, newData).then(grade =>
        res.status(200).json(grade),
    )
}
function updateShift(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Shift', { id }, newData).then(shift =>
        res.status(200).json(shift),
    )
}
function updateStudent(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Student', { id }, newData).then(student =>
        res.status(200).json(student),
    )
}
function updateDriver(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Driver', { driver_id: id }, newData).then(driver =>
        res.status(200).json(driver),
    )
}
function updateParent(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Parent', { parent_id: id }, newData).then(parent =>
        res.status(200).json(parent),
    )
}

//Get funtions
function getBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Bus', { id }).then(bus => res.status(200).json(bus))
}
function getShift(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Shift', { id }).then(shift => res.status(200).json(shift))
}
function getGrade(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Grade', { id }).then(grade => res.status(200).json(grade))
}
function getStudent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Student', { id }).then(student =>
        res.status(200).json(student),
    )
}
function getDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Driver', {
        driver_id: id,
    }).then(driver => res.status(200).json(driver))
}
function getParent(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Parent', {
        parent_id: id,
    }).then(parent => res.status(200).json(parent))
}
//getList funtions
function busList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues

            return findAcross('Bus', { school_id: id }, 'Driver').then(bus =>
                res.status(200).json(bus),
            )
        }
        return res.status(500).json({ message: 'No Buses Found' })
    })
}
function gradeList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues

            return findAcross('Grade', { school_id: id }).then(grade =>
                res.status(200).json(grade),
            )
        }
        return res.status(500).json({ message: 'No Grades Found' })
    })
}
function shiftList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues

            return findAcross('Shift', { school_id: id }).then(shift =>
                res.status(200).json(shift),
            )
        }
        return res.status(500).json({ message: 'No Shifts Found' })
    })
}
function studentList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id, type } = dataValues
            //verify it
            return findAcross('Student', { school_id: id }, 'Parent').then(
                student => res.status(200).json(student),
            )
        }
        return res.status(500).json({ message: 'No Students Found' })
    })
}
function driverBusList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Bus', { driver_id: id }).then(bus =>
        res.status(200).json(bus),
    )
}
function parentStudentList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Student', { parent_id: id }).then(student =>
        res.status(200).json(student),
    )
}
function driverList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        const { dataValues } = resUser
        const { id } = dataValues
        return findOne('User', { token }).then(resUser => {
            if (resUser) {
                const { dataValues } = resUser
                const { id } = dataValues
                return findMultiple('Driver', {
                    school_id: id,
                }).then(driver => res.status(200).json(driver))
            }
            return res
                .status(400)
                .json({ message: 'No Driver Accounts Founds' })
        })
    })
}
function parentList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { dataValues } = resUser
            const { id } = dataValues
            return findMultiple('Parent', {
                school_id: id,
            }).then(parent => res.status(200).json(parent))
        }
        return res.status(400).json({ message: 'No Parents Accounts Founds' })
    })
}

export default {
    createBus,
    createGrade,
    createShift,
    createStudent,
    createDriver,
    createParent,
    deleteBus,
    deleteShift,
    deleteGrade,
    deleteStudent,
    deleteDriver,
    deleteParent,
    updateDriver,
    updateBus,
    updateShift,
    updateGrade,
    updateStudent,
    updateParent,
    getBus,
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
    driverList,
    parentList,
}
