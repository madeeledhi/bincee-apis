// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'

// src
import {
    findOne,
    listAll,
    findById,
    createOne,
    destroy,
    update,
    findMultiple,
} from '../utils'
import config from '../../config/config'

function getUserData(req, res, next) {
    const { id: parent_id } = getOr({}, 'params')(req)
    return findOne('Parent', { parent_id }).then(parent => {
        if (parent) {
            const { dataValues: parentValues } = parent
            const { school_id } = parentValues

            return findOne('School', { school_id }).then(school => {
                const schoolData = school ? school.schoolValues : {}
                return findMultiple('Student', { parent_id }).then(students => {
                    if (students) {
                        const { dataValues: studentValues } = students

                        return res.status(200).json({
                            status: 200,
                            data: {
                                ...parentValues,
                                school: schoolData,
                                kids: studentValues,
                            },
                        })
                    }
                    return res.status(200).json({
                        status: 200,
                        data: { ...parentValues, kids: [] },
                    })
                })
            })
        }

        return res
            .status(200)
            .json({ status: 404, data: { message: 'No Students Found' } })
    })
}

export default {
    getUserData,
}
