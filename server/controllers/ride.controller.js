// libs
import getOr from 'lodash/fp/getOr'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniqueId from 'lodash/fp/uniqueId'
import size from 'lodash/fp/size'
import toLower from 'lodash/fp/toLower'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'

import Sequelize from 'sequelize'

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

const Op = Sequelize.Op

async function rideCreation(
    ride_id,
    driver_id,
    driver_lat,
    driver_lng,
    student_list,
    shift,
    school_lat,
    school_lng,
    school_id,
) {
    const reducedStudents = await reduce(async (final, { id, parent_id }) => {
        const { lat = '', lng = '' } =
            (await findOne('Parent', { parent_id })) || {}
        createFBData('/students', `/${id}`, {
            id,
            ride_id,
            driver_id,
            shift,
            route: [],
            eta: '',
            distance: '',
        })
        return {
            [id]: {
                id,
                parent_id,
                student_location: { lat, lng },
                status: 'waiting',
            },
        }
    }, {})(student_list)

    createFBData('/drivers', `/${driver_id}`, {
        driver_id,
        ride_id,
        shift,
        route: [],
        eta: '',
        distance: '',
        nextLocation: { lat, lng },
    })
    createFBData('/ride', `/${ride_id}`, {
        ride_id,
        driver_id,
        shift,
        driver_location: { lat: driver_lat, lng: driver_lng },
        status: 'inProgress',
        school_location: { lat: school_lat, lng: school_lng },
        students: reducedStudents,
    })
}

function createRide(req, res) {
    const { driver_id, shifts } = getOr({}, 'body')(req)
    //  Return students for current driver and return pickup or dropoff for current shift
    return findMultiple('Student', {
        driver_id,
        shift: {
            [Op.or]: shifts,
        },
    })
        .then(students => {
            if (size(students) > 0) {
                const filteredStudents = flow(
                    filter(student => {
                        const { dataValues: studentValues } = student
                        const { status } = studentValues
                        return toLower(status) === 'active'
                    }),
                    map(filteredStudent => {
                        const {
                            id,
                            fullname,
                            grade,
                            photo,
                            shift,
                            parent_id,
                        } = filteredStudent
                        return findOne('Parent', {
                            parent_id,
                        }).then(parent => {
                            const { dataValues: parentValues } = parent
                            const {
                                fullname: parentname,
                                phone_no,
                                address,
                                lat,
                                lng,
                                email,
                            } = parentValues
                            return {
                                id,
                                parent_id,
                                fullname,
                                grade,
                                photo,
                                shift,
                                parentname,
                                phone_no,
                                address,
                                lat,
                                lng,
                                email,
                            }
                        })
                    }),
                )(students)
                return Promise.all(filteredStudents).then(response =>
                    res.status(200).json({ status: 200, data: response }),
                )
            }
            return res.status(200).json({
                status: 404,
                data: { message: 'No students Registered' },
            })
        })
        .catch(e => {
            return next(e)
        })
}

function startRide(req, res) {
    const {
        driver_id,
        driver_lat,
        driver_lng,
        student_list,
        shift,
        school_lat,
        school_lng,
        school_id,
    } = getOr({}, 'body')(req)

    const ride_id = parseInt(uniqueId(''), 10)
    // rideCreation(
    //     ride_id,
    //     driver_id,
    //     driver_lat,
    //     driver_lng,
    //     student_list,
    //     shift,
    //     school_lat,
    //     school_lng,
    //     school_id,
    // )
    return res.status(200).json({
        status: 200,
        data: {
            id: ride_id,
            ride_status: 'inProgress',
            message: 'Ride Started',
        },
    })
}

function updateDriverLocation(req, res) {
    // TODO: Insert Logic for update driver
    const { ride_status, ride_id, driver_id, lat, lon } = getOr({}, 'body')(req)

    // updateFBData('/ride', `/${ride_id}`, { driver_location: { lat, lng } })
    return res.status(200).json({
        status: 200,
        data: {
            id: ride_id,
            status: 'Success',
            message: 'Location Updated',
        },
    })
}

function endRide(req, res) {
    const { ride_id } = getOr({}, 'body')(req)
    // updateFBData('/ride', `/${ride_id}`, { status: 'completed' })
    return res.status(200).json({
        status: 200,
        data: {
            id: ride_id,
            status: 'EndRide',
            message: 'Ride Ended',
        },
    })
}

function arrivedAtLocation(req, res) {
    // TODO: Insert Logic for when driver arrived at kid location
    // TODO: Send notification to parent to pickup or drop child
    const { ride_id, student_id, parent_id, shift } = getOr({}, 'body')(req)

    // updateFBData('/ride', `/${ride_id}/students/${student_id}`, {
    //     status: 'ready',
    // })
    return res.status(200).json({
        status: 200,
        data: {
            id: ride_id,
            student_status: shift === 'morning' ? 'pickup' : 'drop',
            message: shift === 'morning' ? 'Driver Is Here' : 'Kid is Home',
        },
    })
}

function confirmDropOrPickup(req, res) {
    // TODO: Insert Logic for parent when driver arrived at kid location
    // TODO: Send notification to driver about confirmation
    const { ride_id, student_id, parent_id, shift } = getOr({}, 'body')(req)
    // updateFBData('/ride', `/${ride_id}/students/${student_id}`, {
    //     status: 'picked',
    // })
    return res.status(200).json({
        status: 200,
        data: {
            id: ride_id,
            student_status: shift === 'morning' ? 'dropped' : 'recieved',
            message:
                shift === 'morning'
                    ? 'Kid Dropped for School'
                    : 'Kid Returned From Home',
        },
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
