import expressJwt from 'express-jwt'
import config from '../../config/config'

function jwt() {
    const { jwtSecret: secret } = config
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/api/auth/login',
        ],
    })
}

export default jwt
