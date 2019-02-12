// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import flow from 'lodash/fp/flow'
import split from 'lodash/fp/split'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    update,
    destroy,
    sendEmail,
    sendSMS,
    makePID,
} from '../utils'
import config from '../../config/config'

/**
 * Get user
 * @returns {User}
 */
function getUserById(req, res) {
    const { id } = getOr({}, 'params')(req)
    return findOne('User', { id }).then(resUser => {
        if (resUser) {
            return res.status(200).json({ status: 200, data: resUser })
        }
        res.status(200).json({
            status: 400,
            data: { message: 'User Not Found' },
        })
    })
}

function getUserByUsername(req, res) {
    const { username } = getOr({}, 'query')(req)
    return findOne('User', { username }).then(resUser => {
        if (resUser) {
            return res.status(200).json({ status: 200, data: resUser })
        }
        return res
            .status(200)
            .json({ status: 404, data: { message: 'User Not Found' } })
    })
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
    const { username, password, type } = getOr({}, 'body')(req)

    return findOne('User', { username, password }).then(resUser => {
        if (!resUser) {
            const token = jwt.sign({ username }, config.jwtSecret)
            const user = { username, password, type, token }

            return createOne('User', user)
                .then(savedUser =>
                    res.status(200).json({ status: 200, data: savedUser }),
                )
                .catch(e => next(e))
        }

        return res
            .status(200)
            .json({ status: 302, data: { message: 'User Already Exists' } })
    })
}

function updateUser(req, res, next) {
    const { username, password, new_password } = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    if (username && password && new_password) {
        return findOne('User', { username, password }).then(user => {
            if (user) {
                return update(
                    'User',
                    { id },
                    { username, password: new_password },
                ).then(user =>
                    res.status(200).json({ status: 200, data: user }),
                )
            } else {
                return res
                    .status(200)
                    .json({ status: 404, message: 'Invalid Username/Password' })
            }
        })
    } else {
        return res.status(200).json({
            status: 404,
            message: 'Invalid Username/Password',
        })
    }
}

function resetPassword(req, res, next) {
    const { username, selected_option, email, phone_no, type } = getOr(
        {},
        'body',
    )(req)
    const password = makePID()
    return findOne('User', { username }).then(user => {
        if (user) {
            const { dataValues } = user
            const { id } = dataValues

            if (selected_option === 'email') {
                return findOne(type, { email }).then(details => {
                    if (details) {
                        const html = `<div><b>username</b> : ${username} </br><b>password</b> : ${password} </div>`
                        sendEmail(
                            email,
                            'Password Reset Successfully',
                            'Sign in to bincee using credentials',
                            html,
                        )
                        return update('User', { id }, { password }).then(user =>
                            res.status(200).json({
                                status: 200,
                                data: {
                                    message:
                                        'Credentials have been reset and send to your email',
                                },
                            }),
                        )
                    } else {
                        return res.status(200).json({
                            status: 404,
                            message: 'Invalid Email',
                        })
                    }
                })
            } else {
                return findOne(type, { phone_no }).then(details => {
                    if (details) {
                        sendSMS(
                            phone_no,
                            `Password Reset, Your new Password is ${password}`,
                        )
                        return update('User', { id }, { password }).then(user =>
                            res.status(200).json({
                                status: 200,
                                data: {
                                    message:
                                        'Credentials have been reset and send to your Phone Number',
                                },
                            }),
                        )
                    } else {
                        return res.status(200).json({
                            status: 404,
                            message: 'Invalid Phone Number',
                        })
                    }
                })
            }
        } else {
            return res
                .status(200)
                .json({ status: 404, message: 'Invalid Username' })
        }
    })
}

function sendCredentials(req, res, next) {
    const { username, password, email, phone_no, type } = getOr({}, 'body')(req)
    if (type === 'Parent') {
        const html = `<div><b>username</b> : ${username} </br><b>password</b> : ${password} </div>`
        sendEmail(
            email,
            'Bincee Login Credentials',
            'Sign in to bincee using credentials',
            html,
        )
        return res.status(200).json({
            status: 200,
            data: {
                message: 'Credentials have been sent to User`s email',
            },
        })
    } else {
        sendSMS(
            phone_no,
            `User Username: ${username} with Password: ${password} to Login`,
        )
        return res.status(200).json({
            status: 200,
            data: {
                message: 'Credentials have been sent to User`s Phone Number',
            },
        })
    }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { authorization } = getOr({}, 'headers')(req)
    const token = flow(
        split(' '),
        splitted => splitted[1],
    )(authorization)
    return findOne('User', { token }).then(resUser => {
        if (resUser) {
            const { type } = getOr(0, 'dataValues')(resUser)
            if (type === 1) {
                return listAll('User')
                    .then(users =>
                        res.status(200).json({ status: 200, data, users }),
                    )
                    .catch(e => next(e))
            }
            return res
                .status(200)
                .send({ status: 401, data: { message: 'Unauthorized Access' } })
        }
        return res
            .status(200)
            .send({ status: 404, data: { message: 'No User Found' } })
    })
}

/**
 * Delete user.
 * @returns {User}
 */
function removeUserById(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    destroy('User', { id })
        .then(() =>
            res
                .status(200)
                .json({ status: 200, data: { message: 'User Deleted' } }),
        )
        .catch(e => next(e))
}

export default {
    resetPassword,
    getUserById,
    getUserByUsername,
    create,
    updateUser,
    list,
    removeUserById,
    sendCredentials,
}
