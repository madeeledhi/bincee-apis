import express from 'express'
import logger from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import httpStatus from 'http-status'
import expressWinston from 'express-winston'
import expressValidation from 'express-validation'
import helmet from 'helmet'
import winstonInstance from './winston'
import routes from '../server/routes/index.route'
import config from './config'
import APIError from '../server/helpers/APIError'
import jwt from '../server/helpers/jwt'
import errorHandler from '../server/helpers/errorHandler'
import fs from 'fs'
import request from 'request'
import { intializeFirebase } from '../server/utils'

const app = express()

const staticPath = path.join(__dirname, '../../images')
console.log('static path: ', staticPath)

if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(path.join(__dirname, '../../images'))
}

app.use('/images', express.static(staticPath))

app.get('/images/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../user.png'))
})

if (config.env === 'development') {
    app.use(logger('dev'))
}

intializeFirebase()

// registerListeners()

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.options('*', cors())
app.use(cors())

// enable detailed API logging in dev env
if (config.env === 'development') {
    expressWinston.requestWhitelist.push('body')
    expressWinston.responseWhitelist.push('body')
    app.use(
        expressWinston.logger({
            winstonInstance,
            meta: true, // optional: log meta data about request (defaults to true)
            msg:
                'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
            colorStatus: true,
            // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
        }),
    )
}

// Get API Version from .env (or else assume 1.0)
// const baseUrl = `/api/v${config.apiVersion}`;
const baseUrl = '/'

// use JWT auth to secure the api
// app.use(jwt()
// mount all routes on /api path
app.use(`${baseUrl}`, routes)

// catch 404 and forward to error handler

app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND)
    return next(err)
})

// global error handler
app.use(errorHandler)
// log error in winston transports except when executing test suite
if (config.env !== 'test') {
    app.use(
        expressWinston.errorLogger({
            winstonInstance,
        }),
    )
}

export default app
