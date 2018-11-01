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
            return findMultiple('Student', { parent_id }).then(students => {
                if (students) {
                    const { dataValues: studentValues } = students

                    return res.status(200).json({
                        ...parentValues,
                        kids: studentValues,
                    })
                }
                return res.status(200).json({ ...parentValues, kids: [] })
            })
        }

        return res.status(404).json({ message: 'No Students Found' })
    })
}

export default {
    getUserData,
}
