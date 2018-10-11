import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import db from '../../config/sequelize'
import config from '../../config/config'

const User = db.User

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
function get(req, res) {
    return res.json(req.user)
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
    const { username, password, type } = req.body
    const { accesstoken } = req.headers
    if (!accesstoken) {
        return res.status(401).json({ message: 'No token provided.' })
    }
    return jwt.verify(accesstoken, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(500)
        }
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
    })
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.user
    user.username = req.body.username

    user.save()
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
function remove(req, res, next) {
    const user = req.user
    const username = req.user.username
    user.destroy()
        .then(() => res.json(username))
        .catch(e => next(e))
}

export default { load, get, create, update, list, remove }
