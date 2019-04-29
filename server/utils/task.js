// libs
import getOr from 'lodash/fp/getOr'
import split from 'lodash/fp/split'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import size from 'lodash/fp/size'
import reduce from 'lodash/fp/reduce'
import keys from 'lodash/fp/keys'
import moment from 'moment-timezone'

// src
import {
    update,
    listAll,
    findMultiple,
    sendShiftNotification,
    destroy,
    getFBData,
} from '../utils'

export function task() {
    const date = moment()
    update('Student', { status: 'Leave' }, { status: 'Active' }).then(() => {
        listAll('Leaves').then(leaves => {
            map(leave => {
                const { dataValues: leaveValue } = leave
                const { id, student_id, from_date, to_date } = leaveValue
                const from = moment(from_date)
                const to = moment(to_date)
                if (date >= from && date <= to) {
                    update('Student', { id: student_id }, { status: 'Leave' })
                }
                if (to < date) {
                    destroy('Leaves', { id })
                }
            })(leaves)
        })
    })
}

export function morningTask() {
    const date = moment().tz('Asia/Baghdad')
    const currentTime = date
        .set({ second: 0, millisecond: 0 })
        .format('HH:mm:ss')

    console.log('Morning Task', currentTime)
    findMultiple('Shift', { type: 'Pickup' }).then(shifts => {
        map(shift => {
            const { dataValues: shiftValue } = shift
            const {
                shift_id,
                shift_name,
                start_time,
                end_time,
                type,
                school_id,
            } = shiftValue

            console.log('Shift', shift_id, currentTime, start_time)
            if (start_time === currentTime) {
                findMultiple('Student', {
                    shift_morning: shift_id,
                    status: 'Active',
                }).then(students => {
                    map(student => {
                        const { dataValues: studentValues } = student
                        const {
                            parent_id,
                            id: student_id,
                            fullname,
                        } = studentValues
                        const notification = {
                            title: `${shift_name} has Started`,
                            body: `It's Time to Drop ${fullname} for School`,
                            data: { studentId: student_id },
                            type: 'Morning1',
                        }
                        sendShiftNotification(parent_id, notification)
                    })(students)
                })
            }
        })(shifts)
    })
}

export function eveningTask() {
    const date = moment().tz('Asia/Baghdad')
    const currentTime = date
        .set({ second: 0, millisecond: 0 })
        .format('HH:mm:ss')

    console.log('Evening Task', currentTime)
    findMultiple('Shift', { type: 'Dropoff' }).then(shifts => {
        map(shift => {
            const { dataValues: shiftValue } = shift
            const {
                shift_id,
                shift_name,
                start_time,
                end_time,
                type,
                school_id,
            } = shiftValue

            console.log('Shift', shift_id, currentTime, start_time)
            if (start_time === currentTime) {
                findMultiple('Student', {
                    shift_evening: shift_id,
                    status: 'Active',
                }).then(students => {
                    map(student => {
                        const { dataValues: studentValues } = student
                        const {
                            parent_id,
                            id: student_id,
                            fullname,
                        } = studentValues
                        const notification = {
                            title: `${shift_name} has Started`,
                            body: `School is Over, It's Time for ${fullname} to be Picked up`,
                            data: { studentId: student_id },
                            type: 'Evening1',
                        }

                        sendShiftNotification(parent_id, notification)
                    })(students)
                })
            }
        })(shifts)
    })
}

export function halfDayTask() {
    const date = moment().tz('Asia/Baghdad')
    const currentTime = date
        .set({
            second: 0,
            millisecond: 0,
        })
        .format('HH:mm:ss')

    console.log('half Day Task', currentTime)
    findMultiple('Shift', {
        type: 'Dropoff',
    }).then(shifts => {
        map(shift => {
            const { dataValues: shiftValue } = shift
            const {
                shift_id,
                shift_name,
                start_time,
                end_time,
                type,
                school_id,
            } = shiftValue

            console.log('Shift', shift_id, currentTime, start_time)
            if (currentTime === '12:00:00') {
                findMultiple('Student', {
                    shift_evening: shift_id,
                    status: 'Active',
                }).then(students => {
                    map(student => {
                        const { dataValues: studentValues } = student
                        const {
                            parent_id,
                            id: student_id,
                            fullname,
                        } = studentValues
                        const notification = {
                            title: `${shift_name} has Started`,
                            body: `School is Over, It's Time for ${fullname} to be Picked up`,
                            data: { studentId: student_id },
                            type: 'Evening1',
                        }

                        sendShiftNotification(parent_id, notification)
                    })(students)
                })
            }
        })(shifts)
    })
}
