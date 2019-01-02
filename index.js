import config from './config/config'
import app from './config/express'
/* eslint-disable no-unused-vars */
import db from './config/sequelize'
import cron from 'node-cron'
import { task, initMail, sendEmail } from './server/utils'

const debug = require('debug')('bincee-api:index')
/* eslint-enable no-unused-vars */
const transport = initMail()
const response = sendEmail('sadain.abbasi@gmail.com', 'Check', '', '')

console.log('transport: ', transport, response)
// make bluebird default Promise
Promise = require('bluebird') // eslint-disable-line no-global-assign

cron.schedule('00 00 12 * * 0-6', task, {
    scheduled: true,
    timezone: 'Asia/Karachi',
})
// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        console.info(`server started on port ${config.port} (${config.env})`) // eslint-disable-line no-console
    })
}

export default app
