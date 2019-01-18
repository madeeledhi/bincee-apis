//src
import fetch from 'node-fetch'

const notificationUrl =
    'https://fcm.googleapis.com/v1/projects/bincee-67ec6/messages:send'
const token = process.env.FCM_TOKEN || ''

export function sendNotification(topic, notification) {
    const Authorization = `Bearer ${token}`
    const headers = { 'Content-type': 'application/json', Authorization }
    const body = {
        message: {
            topic,
            notification,
        },
    }
    return fetch(notificationUrl, {
        method: 'post',
        headers,
        body: JSON.stringify(body),
    })
}

export function sendShiftNotification(to, notification) {
    console.log('Notifying', notification, to)
    const Authorization = `Bearer ${token}`
    const headers = { 'Content-type': 'application/json', Authorization }
    const body = {
        message: {
            to,
            notification,
        },
    }
    return fetch(notificationUrl, {
        method: 'post',
        headers,
        body: JSON.stringify(body),
    })
}

export function sendBulkNotifications(to, notification) {
    const Authorization = `Bearer ${token}`
    const headers = { 'Content-type': 'application/json', Authorization }
    const body = { message: { to, notification } }
    return fetch(notificationUrl, {
        method: 'post',
        headers,
        body: JSON.stringify(body),
    })
}
