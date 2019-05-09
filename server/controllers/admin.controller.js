// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    destroy,
    update,
    sendEmail,
} from '../utils'
import config from '../../config/config'

function createSchool(req, res, next) {
    const {
        username,
        password,
        name,
        address,
        phone_no,
        email,
        licenses,
        fleetLicenses,
        trial,
        trialDays = null,
        trialDate = null,
        lat = null,
        lng = null,
    } = getOr({}, 'body')(req)
    return findOne('User', { username, password })
        .then(resUser => {
            if (!resUser) {
                const token = jwt.sign({ username }, config.jwtSecret)
                const user = { username, password, type: 2, token }
                const school = {
                    address,
                    name,
                    email,
                    phone_no,
                    licenses,
                    fleetLicenses,
                    trial,
                    trialDays,
                    trialDate,
                    lat,
                    lng,
                }
                return createOne('User', user)
                    .then(savedUser => {
                        const { dataValues } = savedUser
                        const { id, username } = dataValues
                        return createOne('School', {
                            school_id: id,
                            ...school,
                        }).then(savedSchool => {
                            const { dataValues: schoolValues } = savedSchool
                            sendEmail(
                                email,
                                'Bincee Login Credentials',
                                { username, password },
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
                                        ...schoolValues,
                                    },
                                })
                                .catch(err => {
                                    destroy('User', { id })
                                    return next(e)
                                })
                        })
                    })
                    .catch(e => next(e))
            }

            return res.status(200).json({
                status: 302,
                data: { message: 'School Already Exists' },
            })
        })
        .catch(e => {
            return next(e)
        })
}

function deleteSchool(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return destroy('School', { school_id: id })
        .then(() => {
            return destroy('User', {
                id,
            }).then(() =>
                res.status(200).json({
                    status: 200,
                    data: { message: 'School Deleted' },
                }),
            )
        })
        .catch(e => next(e))
}

function updateSchoolDetails(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update('School', { school_id: id }, newData)
        .then(school => res.status(200).json({ status: 200, data: school }))
        .catch(e => {
            return next(e)
        })
}

function getSchool(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    return findOne('School', { school_id: id })
        .then(school => res.status(200).json({ status: 200, data: school }))
        .catch(e => {
            return next(e)
        })
}

function schoolList(req, res, next) {
    return listAll('School')
        .then(school => res.status(200).json({ status: 200, data: school }))
        .catch(e => {
            return next(e)
        })
}

export default {
    getSchool,
    schoolList,
    createSchool,
    updateSchoolDetails,
    deleteSchool,
}
