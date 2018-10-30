// libs
import getOr from 'lodash/fp/getOr'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniqueId from 'lodash/fp/uniqueId'

// src
import {
    createFBData,
    updateFBData,
    findOne,
    listAll,
    findById,
    findMultiple,
    createOne,
    createMutiple,
    destroy,
    update,
    findAcross,
} from '../utils'

async function rideCreation(
    ride_id,
    driver_id,
    student_list,
    shift,
    school_lat,
    school_lng,
    school_id,
) {
    console.log('student List: ', student_list)
    const reducedStudents = await reduce(async (final, { id, parent_id }) => {
        const { lat = '', lng = '' } =
            (await findOne('Parent', { parent_id })) || {}
        return {
            [id]: {
                id,
                parent_id,
                student_location: { lat, lng },
                status: 'waiting',
            },
        }
    }, {})(student_list)
    createFBData('/ride', `/${ride_id}`, {
        ride_id,
        driver_id,
        shift,
        status: 'inProgress',
        school_location: { lat: school_lat, lng: school_lng },
        students: reducedStudents,
    })
}

function createRide(req, res) {
    const { driver_id, shift } = getOr({}, 'body')(req)
    //  Return students for current driver and return pickup or dropoff for current shift
    return findMultiple('Student', { driver_id, shift }).then(students => {
        if (!students) {
            const filteredStudents = filter(({ status }) => status !== 'leave')(
                students,
            )
            return res.status(200).json(filteredStudents)
        }
        return res.status(404).json({ message: 'No students Registered' })
    })
}

function startRide(req, res) {
    const {
        driver_id,
        student_list,
        shift,
        school_lat,
        school_lng,
        school_id,
    } = getOr({}, 'body')(req)

    const ride_id = parseInt(uniqueId(''), 10)
    rideCreation(
        ride_id,
        driver_id,
        student_list,
        shift,
        school_lat,
        school_lng,
        school_id,
    )
    return res.status(200).json({
        id: ride_id,
        ride_status: 'inProgress',
        message: 'Ride Started',
    })
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
    const { ride_id } = getOr({}, 'body')(req)
    updateFBData('/ride', `/${ride_id}`, { status: 'completed' })
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
