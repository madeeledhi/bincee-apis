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

function createBus(req, res, next) {
    const { registration_no, description } = getOr({}, 'body')(req)
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)
    return findOne('Bus', { registration_no }).then(resBus => {
        if (!resBus) {
            return findOne('User', { token }).then(resUser => {
                const { dataValues } = resUser
                const { id, type } = dataValues
                if (type === 2) {
                    return createOne('Bus', {
                        registration_no,
                        description,
                        school_id: id,
                    }).then(bus => {
                        return res.status(200).json(bus)
                    })
                }
                return res.school(200).json({
                    message:
                        'User type Not Authorized to create this Entity Type',
                })
            })
        }
    })
}

function createDriver(req, res, next) {
    const { username, password, fullname, phone_no, bus_id, status } = getOr(
        {},
        'body',
    )(req)

    return findOne('User', { username, password }).then(resUser => {
        if (!resUser) {
            const token = jwt.sign({ username }, config.jwtSecret)
            const user = { username, password, type: 3, token }
            const driver = { fullname, phone_no, bus_id, status }
            return createOne('User', user)
                .then(savedUser => {
                    const { dataValues } = savedUser
                    const { id, username } = dataValues
                    return createOne('Driver', {
                        driver_id: id,
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
                                destroy('User', { id })
                                return next(e)
                            })
                    })
                })
                .catch(e => next(e))
        }

        return res.status(302).json({ message: 'Driver Already Exists' })
    })
}

function deleteBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { id }).then(() =>
        res.status(200).json('Bus Deleted'),
    )
}

function deleteDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Driver', { driver_id: id }).then(() => {
        return destroy('User', { id }).then(() =>
            res.status(200).json('Driver Deleted'),
        )
    })
}

function updateBus(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Bus', { id }, newData).then(bus => res.status(200).json(bus))
}

function updateDriver(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Driver', { driver_id: id }, newData).then(driver =>
        res.status(200).json(driver),
    )
}

function getBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Bus', { id }).then(bus => res.status(200).json(bus))
}

function busList(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)

    console.log('auth: ', token, authorization)

    return findOne('User', { token }).then(resUser => {
        console.log('User', resUser)
        const { dataValues } = resUser
        const { id, type } = dataValues
        return findMultiple('Bus', {
            school_id: id,
        }).then(bus => res.status(200).json(bus))
    })
}

function getDriver(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Driver', {
        driver_id: id,
    }).then(driver => res.status(200).json(driver))
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
        return findAcross(
            'Driver',
            {
                school_id: id,
            },
            'Bus',
        ).then(driver => res.status(200).json(driver))
    })
}

export default {
    createBus,
    createDriver,
    deleteBus,
    deleteDriver,
    updateDriver,
    updateBus,
    getBus,
    getDriver,
    busList,
    driverList,
}
