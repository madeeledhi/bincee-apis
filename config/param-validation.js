import Joi from 'joi'

export default {
    // POST /api/users
    createUser: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            type: Joi.number().required(),
        },
    },

    // POST /api/admin
    createSchool: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            address: Joi.string().required(),
            phone_no: Joi.number().required(),
        },
    },

    // POST /api/school
    createDriver: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            fullname: Joi.string().required(),
            bus_id: Joi.number().required(),
            phone_no: Joi.number().required(),
        },
    },

    // POST /api/school
    createBus: {
        body: {
            registration_no: Joi.string().required(),
            description: Joi.string().required(),
        },
    },

    updateUser: {
        body: {
            password: Joi.string().required(),
        },
        params: {
            id: Joi.string()
                .hex()
                .required(),
        },
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
}
