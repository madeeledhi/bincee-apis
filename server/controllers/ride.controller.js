// libs
import getOr from 'lodash/fp/getOr'

// src
import { updateFBData } from '../utils'

function createRide(req, res) {
    // TODO: Insert Logic for Creating a ride
    const { driver_id, shift } = getOr({}, 'body')(req)
    //  Return students for current driver and return pickup or dropoff for current shift
    return res.status(200).json({
        message: 'Ride Created',
    })
}

function startRide(req, res) {
    // TODO: Insert Logic for beginning a ride
    const { driver_id, student_list, shift, static_location } = getOr(
        {},
        'body',
    )(req)
    return res
        .status(200)
        .json({ id: ride_id, ride_status: 'InRide', message: 'Ride Started' })
}

function updateDriverLocation(req, res) {
    // TODO: Insert Logic for update driver
    const { ride_status, ride_id, driver_id, lat, lon } = getOr({}, 'body')(req)
    return res.status(200).json({
        id: ride_id,
        status: 'Success',
        message: 'Location Updated',
    })
}

function endRide(req, res) {
    // TODO: Insert Logic for ending a ride
    const { ride_id } = getOr({}, 'body')(req)
    updateFBData('/test', '/', { id: 'test id', value: ride_id })
    return res.status(200).json({
        id: ride_id,
        status: 'EndRide',
        message: 'Ride Ended',
    })
}

function arrivedAtLocation(req, res) {
    // TODO: Insert Logic for when driver arrived at kid location
    // TODO: Send notification to parent to pickup or drop child
    const { ride_id, student_id, parent_id } = getOr({}, 'body')(req)
    return res.status(200).json({
        id: ride_id,
        student_status: 'ready to pick / ready to drop',
        message: 'Arrived',
    })
}

function confirmDropOrPickup(req, res) {
    // TODO: Insert Logic for parent when driver arrived at kid location
    // TODO: Send notification to driver about confirmation
    const { ride_id, student_id, parent_id, status } = getOr({}, 'body')(req)
    return res.status(200).json({
        id: ride_id,
        student_status: 'Picked from home / dropped at the home',
        message: 'Confirmed Pickup/Dropoff',
    })
}

export default {
    createRide,
    startRide,
    updateDriverLocation,
    endRide,
    arrivedAtLocation,
    confirmDropOrPickup,
}
