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

    passwordreset: {
        body: {
            selected_option: Joi.string().required(),
            username: Joi.string().required(),
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
    createLeave: {
        body: {
            from_date: Joi.string().required(),
            to_date: Joi.string().required(),
            comment: Joi.string().required(),
            student_id: Joi.number().required(),
            school_id: Joi.number().required(),
        },
    },
    createNotification: {
        body: {
            description: Joi.string().required(),
            type: Joi.string().required(),
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
            fullname: Joi.string().required(),
            grade: Joi.number().required(),
            shift: Joi.number().required(),
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
        body: {},
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
