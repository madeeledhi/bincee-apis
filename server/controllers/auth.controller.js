// libs
import getOr from 'lodash/fp/getOr'

// src
import { findOne } from '../utils'

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res) {
    // Ideally you'll fetch this from the db
    // Idea here was to show how jwt works with simplicity
    const { username, password } = getOr({}, 'body')(req)
    return findOne('User', { username, password }).then(resUser => {
        if (!resUser) {
            return res.status(200).json({
                status: 400,
                data: { message: 'Invalid Username/Password' },
            })
        }
        const { dataValues } = resUser
        const { id, username, type, token } = dataValues
        return res
            .status(200)
            .json({ status: 200, data: { id, username, type, token } })
    })
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.status(200).json({
        status: 200,
        data: {
            user: req.user,
            num: Math.random() * 100,
        },
    })
}

export default { login, getRandomNumber }
