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
                            return createOne('Driver', {
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

function deleteBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('Bus', { id }).then(() =>
        res.status(200).json({ message: 'Bus Deleted' }),
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

function updateParent(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('Parent', { parent_id: id }, newData).then(parent =>
        res.status(200).json(parent),
    )
}

function getBus(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('Bus', { id }).then(bus => res.status(200).json(bus))
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

function driverBusList(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findMultiple('Bus', { driver_id: id }).then(bus =>
        res.status(200).json(bus),
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
    createDriver,
    createParent,
    deleteBus,
    deleteDriver,
    deleteParent,
    updateDriver,
    updateBus,
    updateParent,
    getBus,
    getDriver,
    getParent,
    busList,
    driverBusList,
    driverList,
    parentList,
}
