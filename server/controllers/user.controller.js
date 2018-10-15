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
            return res.status(200).json(resUser)
        }
        res.status(404).json({ message: 'User Not Found' })
    })
}

function getUserByUsername(req, res) {
    const { username } = getOr({}, 'query')(req)
    return findOne('User', { username }).then(resUser => {
        if (resUser) {
            return res.status(200).json(resUser)
        }
        return res.status(404).json({ message: 'User Not Found' })
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
    const { username, password } = getOr({}, 'body')(req)
    const { id } = getOr({}, 'params')(req)
    return update(
        'User',
        { id },
        username && password ? { username, password } : {},
    ).then(user => res.status(200).json(user))
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
                    .then(users => res.json(users))
                    .catch(e => next(e))
            }
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        return res.status(404).send({ message: 'No User Found' })
    })
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
