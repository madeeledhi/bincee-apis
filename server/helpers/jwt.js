import expressJwt from 'express-jwt'
import config from '../../config/config'

function jwt() {
    const { jwtSecret: secret } = config
    return expressJwt({
        secret,
    }).unless({
        path: [
            // public routes that don't require authentication
            '/auth/login',
            '/health-check',
            '/users/random-number',
            '/users/passwordreset',
        ],
    })
}

export default jwt
