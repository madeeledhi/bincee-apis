// libs
import getOr from 'lodash/fp/getOr'

function startRide(req, res) {
    const { driver_id, student_list, shift, static_location } = getOr(
        {},
        'body',
    )(req)
    return res
        .status(200)
        .json({ id: ride_id, ride_status: 'InRide', message: 'Ride Started' })
}

function updateDriverLocation(req, res) {
    const { ride_status, ride_id, driver_id, lat, lon } = getOr({}, 'body')(req)
    return res
        .status(200)
        .json({ id: ride_id, status: 'Success', message: 'Location Updated' })
}

function endRide(req, res) {
    const { ride_id } = getOr({}, 'body')(req)
    return res
        .status(200)
        .json({ id: ride_id, status: 'EndRide', message: 'Ride Ended' })
}

export default { startRide, updateDriverLocation, endRide }
