// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import flow from 'lodash/fp/flow'
import toNumber from 'lodash/fp/toNumber'
import split from 'lodash/fp/split'

// src
import { createOne, update, findMultiple, findOne } from '../utils'

import config from '../../config/config'

function updateNotificationStatus(req, res, next) {
    const { parent_id, status } = getOr({}, 'body')(req)
    const { id: announcement_id } = getOr({}, 'params')(req)
    if (status && (toNumber(status) === 1 || toNumber(status) === 0)) {
        return update(
            'NotifyStatus',
            { parent_id, announcement_id },
            { status },
        ).then(updated => res.status(200).json({ status: 200, data: updated }))
    } else {
        return res.status(200).json({
            status: 302,
            message: 'Invalid Status',
        })
    }
}

function createNotificationStatus(req, res, next) {
    const { announcement_id, parent_id } = getOr({}, 'body')(req)
    return findOne('NotifyStatus', { announcement_id, parent_id }).then(
        resStatus => {
            if (!resStatus) {
                return createOne('NotifyStatus', {
                    announcement_id,
                    parent_id,
                    status: 0,
                })
                    .then(savedStatus =>
                        res.status(200).json({
                            status: 200,
                            data: savedStatus,
                        }),
                    )
                    .catch(e => next(e))
            }

            return res.status(200).json({
                status: 302,
                data: { message: 'Notification Already Exists' },
            })
        },
    )
}

function listAll(req, res, next) {
    const { id: parent_id } = getOr({}, 'params')(req)
    return findMultiple('NotifyStatus', { parent_id })
        .then(resStatus => {
            return res.status(200).json({
                status: 200,
                data: savedStatus,
            })
        })
        .catch(e => next(e))
}

export default { updateNotificationStatus, createNotificationStatus, listAll }
