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
    update,
    destroy,
} from '../utils'
import config from '../../config/config'

/**
 * Get user
 * @returns {User}
 */
function getUserById(req, res) {
    const { id } = getOr({}, 'params')(req)
    return findOne('User', { id }).then(resUser => {
        return res.status(200).json(resUser)
    })
}

function getUserByUsername(req, res) {
    const { username } = getOr({}, 'query')(req)
    return findOne('User', { username }).then(resUser => {
        return res.status(200).json(resUser)
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
                .then(savedUser => res.status(200).json(savedUser))
                .catch(e => next(e))
        }

        return res.status(302).json({ message: 'User Already Exists' })
    })
}

function updateUser(req, res, next) {
    const newData = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    console.log('new Data: ', id, newData)
    return update('User', { id }, newData).then(user =>
        res.status(200).json(user),
    )
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    return listAll('User')
        .then(users => res.json(users))
        .catch(e => next(e))
}

/**
 * Delete user.
 * @returns {User}
 */
function removeUserById(req, res, next) {
    const { id } = getOr({}, 'params')(req)
    destroy('User', { id })
        .then(() => res.status(200).json('User Deleted'))
        .catch(e => next(e))
}

export default {
    getUserById,
    getUserByUsername,
    create,
    updateUser,
    list,
    removeUserById,
}
