import expressJwt from 'express-jwt'
import config from '../../config/config'

function jwt() {
    const { jwtSecret: secret } = config
    return expressJwt({
        secret,
    }).unless({
        path: [
            // public routes that don't require authentication
            '/api/auth/login',
            '/api/health-check',
            '/api/users/random-number',
            '/api/users/passwordreset',
        ],
    })
}

export default jwt
