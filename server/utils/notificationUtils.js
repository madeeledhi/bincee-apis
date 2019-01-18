//src
import fetch from 'node-fetch'
import fcmNode from 'fcm-node'

const notificationUrl =
    'https://fcm.googleapis.com/v1/projects/bincee-67ec6/messages:send'
const token = process.env.FCM_TOKEN || ''

export function sendNotification(topic, notification, data) {
    const message = {
        to: topic,
        notification,
        data,
    }
    const fcm = new fcmNode(token)

    return new Promise((resolve, reject) => {
        fcm.send(message, function(err, response) {
            if (err) {
                console.log('Something has gone wrong!')
                reject(err)
            } else {
                console.log('Successfully sent with response: ', response)
                resolve(response)
            }
        })
    })
}

export function sendShiftNotification(to, notification, data) {
    const message = {
        to,
        notification,
        data,
    }
    const fcm = new fcmNode(token)

    return new Promise((resolve, reject) => {
        fcm.send(message, function(err, response) {
            if (err) {
                console.log('Something has gone wrong!')
                reject(err)
            } else {
                console.log('Successfully sent with response: ', response)
                resolve(response)
            }
        })
    })
}

export function sendBulkNotifications(to, notification, data) {
    const message = {
        to,
        notification,
        data,
    }
    const fcm = new fcmNode(token)

    return new Promise((resolve, reject) => {
        fcm.send(message, function(err, response) {
            if (err) {
                console.log('Something has gone wrong!')
                reject(err)
            } else {
                console.log('Successfully sent with response: ', response)
                resolve(response)
            }
        })
    })
}
