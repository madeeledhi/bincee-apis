// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'

// src
import { User } from '../../config/sequelize'
import config from '../../config/config'

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.findById(id)
        .then(user => {
            if (!user) {
                const e = new Error('User does not exist')
                e.status = httpStatus.NOT_FOUND
                return next(e)
            }
            req.user = user // eslint-disable-line no-param-reassign
            return next()
        })
        .catch(e => next(e))
}

/**
 * Get user
 * @returns {User}
 */
function getUserById(req, res) {
    return res.status(200).json(req.user)
}

function getUserByUsername(req, res) {
    const { username } = getOr({}, 'query')(req)

    return User.findOne({ where: { username } }).then(resUser => {
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

    const token = jwt.sign({ username }, config.jwtSecret)
    return User.findOne({
        where: {
            username,
            password,
        },
    }).then(resUser => {
        if (!resUser) {
            const user = User.build({ username, password, type, token })

            return user
                .save()
                .then(savedUser => res.status(200).json(savedUser))
                .catch(e => next(e))
        }

        return res.status(302).json({ message: 'User Already Exists' })
    })
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function updateUserById(req, res, next) {
    const user = req.user
    user.username = req.body.username

    return user
        .save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e))
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50 } = req.query
    User.findAll({ limit })
        .then(users => res.json(users))
        .catch(e => next(e))
}

/**
 * Delete user.
 * @returns {User}
 */
function removeUserById(req, res, next) {
    const user = req.user
    const username = req.user.username
    user.destroy()
        .then(() => res.json(username))
        .catch(e => next(e))
}

export default {
    load,
    getUserById,
    getUserByUsername,
    create,
    updateUserById,
    list,
    removeUserById,
}
