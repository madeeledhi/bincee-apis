import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import extend from 'lodash/extend'
import config from './config'

const db = {}

const user = {
    username: 'admin',
    password: 'bincee',
    type: 1,
}

// connect to postgres testDb
const sequelizeOptions = {
    dialect: 'postgres',
    port: config.postgres.port,
    host: config.postgres.host,
    // NOTE: https://github.com/sequelize/sequelize/issues/8417
    // Codebase shouldn't be using string-based operators, but we still disable them
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
    ...(config.postgres.ssl && {
        ssl: config.postgres.ssl,
    }),
    ...(config.postgres.ssl &&
        config.postgres.ssl_ca_cert && {
            dialectOptions: {
                ssl: {
                    ca: config.postgres.ssl_ca_cert,
                },
            },
        }),
}
const sequelize = new Sequelize(
    config.postgres.db,
    config.postgres.user,
    config.postgres.passwd,
    sequelizeOptions,
)

const modelsDir = path.normalize(`${__dirname}/../server/models`)

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(file => file.indexOf('.') !== 0 && file.indexOf('.map') === -1)
    // import model files and save model names
    .forEach(file => {
        console.log(`Loading model file ${file}`) // eslint-disable-line no-console
        const model = sequelize.import(path.join(modelsDir, file))
        db[model.name] = model
    })

// Synchronizing any model changes with database.

// TODO: Replace sync with migrations
// TODO: Create a mechanism for DB migrations using sequalize
sequelize
    .sync({ force: true })
    .then(() => {
        const { username, password, type } = user
        console.log('Database synchronized') // eslint-disable-line no-console
        return db.User.findOne({
            where: {
                username,
                password,
            },
        }).then(resUser => {
            if (!resUser) {
                const token = jwt.sign({ username }, config.jwtSecret)
                const admin = db.User.build({ username, password, type, token })
                return admin
                    .save()
                    .then(savedUser => {
                        console.log('Admin Created')
                        return
                    })
                    .catch(e => next(e))
            }

            console.log('User Found')
            return
        })
    })
    .catch(error => {
        if (error) console.log('An error occured %j', error) // eslint-disable-line no-console
    })

// assign the sequelize variables to the db object and returning the db.
module.exports = extend(
    {
        sequelize,
        Sequelize,
    },
    db,
)
