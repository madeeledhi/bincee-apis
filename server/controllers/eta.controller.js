// libs
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import getOr from 'lodash/fp/getOr'
import flow from 'lodash/fp/flow'
import split from 'lodash/fp/split'

//src
import { getDistanceMatrix, getDirection } from '../utils/etaUtils'

function getEta(req, res) {
    const { from, to, waypoints } = getOr({}, 'body')(req)

    return getDistanceMatrix(JSON.parse(from), JSON.parse(to)).then(resETA => {
        if (resETA) {
            return res.status(200).json(resETA)
        }
        res.status(404).json({ message: 'ETA Not Found' })
    })

    // return getDirection(
    //     JSON.parse(from),
    //     JSON.parse(to),
    //     JSON.parse(waypoints),
    // ).then(resETA => {
    //     if (resETA) {
    //         return res.status(200).json(resETA)
    //     }
    //     res.status(404).json({ message: 'ETA Not Found' })
    // })
}
export default {
    getEta,
}
