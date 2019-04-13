import Joi from 'joi'

export default {
    // POST /api/users
    createUser: {
        body: {},
    },

    passwordreset: {
        body: {
            selected_option: Joi.string().required(),
            username: Joi.string().required(),
            type: Joi.number().required(),
        },
    },

    // POST /api/admin
    createSchool: {
        body: {},
    },
    createLeave: {
        body: {},
    },
    createNotification: {
        body: {},
    },

    // POST /api/school
    createDriver: {
        body: {},
    },

    // POST /api/school
    createParent: {
        body: {},
    },

    // POST /api/school
    createStudent: {
        body: {},
    },

    createGrade: {
        body: {},
    },
    createShift: {
        body: {},
    },

    // POST /api/school
    createBus: {
        body: {},
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
}
