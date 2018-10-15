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
    createStudent: {
        body: {
            username: Joi.string().required(),
            grade: Joi.string().required(),
            shift: Joi.string().required(),
            parent_id: Joi.number().required(),
            driver_id: Joi.number().required(),
            status: Joi.string().required(),
        },
    },

    createGrade: {
        body: {
            grade_name: Joi.string().required(),
            section: Joi.string().required(),
        },
    },
    createShift: {
        body: {
            shift_name: Joi.string().required(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required(),
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

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
}
