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
            phone_no: Joi.string().required(),
        },
    },

    // POST /api/school
    createDriver: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            fullname: Joi.string().required(),
            status: Joi.string().required(),
            phone_no: Joi.string().required(),
        },
    },

    // POST /api/school
    createParent: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            fullname: Joi.string().required(),
            email: Joi.string().required(),
            status: Joi.string().required(),
            address: Joi.string().required(),
            phone_no: Joi.string().required(),
        },
    },

    // POST /api/school
    createBus: {
        body: {
            registration_no: Joi.string().required(),
            description: Joi.string().required(),
            driver_id: Joi.number().required(),
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
