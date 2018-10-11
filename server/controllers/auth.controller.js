// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'

// src
import APIError from '../helpers/APIError'
import config from '../../config/config'
import { User } from '../../config/sequelize'

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    // Ideally you'll fetch this from the db
    // Idea here was to show how jwt works with simplicity
    const { username, password } = getOr({}, 'body')(req)
    User.findOne({
        where: {
            username,
            password,
        },
    })
        .then(resUser => {
            if (!resUser) {
                return res.status(404).json({})
            }
            return res.status(200).json(resUser)
        })
        .catch(err => {
            return res.status(500).json(err)
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
        user: req.user,
        num: Math.random() * 100,
    })
}

export default { login, getRandomNumber }
