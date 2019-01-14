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
import { update, listAll } from '../utils'

export default function task() {
    const date = moment().tz('Asia/Baghdad')
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
