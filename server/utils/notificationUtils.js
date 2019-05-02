//src
import fetch from 'node-fetch'
import fcmNode from 'fcm-node'

const notificationUrl = 'https://fcm.googleapis.com/fcm/send'
const token = process.env.FCM_TOKEN || ''

const headers = {
    'Content-Type': 'application/json',
    Authorization: `key=${token}`,
}

export function sendNotification(topic, notification, data) {
    const message = {
        topic: `/topics/${topic}`,
        notification,
        data,
    }
    return fetch(notificationUrl, { method: 'POST', headers: headers })
}

export function sendShiftNotification(id, notification, data) {
    const message = {
        topic: `/topics/parent_${id}`,
        notification,
        data,
    }
    return fetch(notificationUrl, { method: 'POST', headers: headers })
}

export function sendBulkNotifications(id, notification, data) {
    const message = {
        to: id,
        notification,
        data,
    }
    return fetch(notificationUrl, { method: 'POST', headers: headers })
}
