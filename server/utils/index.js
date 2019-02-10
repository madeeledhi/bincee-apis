export * from './tableConfigUtils'
export * from './dbUtils'
export * from './fireBaseUtils'
export * from './firebaseListenerUtils'
export * from './notificationUtils'
export * from './smtpUtils'
export * from './task'
export * from './twilioUtils'

export const makeUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
