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
        to: `/topics/${topic}`,
        notification,
        data,
        priority: 'high',
    }
    return fetch(notificationUrl, {
        method: 'post',
        body: JSON.stringify(message),
        headers,
    })
}

export function sendShiftNotification(id, notification, data) {
    const message = {
        to: `/topics/parent_${id}`,
        notification,
        data,
        priority: 'high',
    }

    return fetch(notificationUrl, {
        method: 'post',
        body: JSON.stringify(message),
        headers: headers,
    })
}

export function sendBulkNotifications(id, notification, data) {
    const message = {
        to: id,
        notification,
        data,
        priority: 'high',
    }
    return fetch(notificationUrl, {
        method: 'post',
        body: JSON.stringify(message),
        headers: headers,
    })
}
