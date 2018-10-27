import * as admin from 'firebase-admin'

const fireBaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
        type: 'service_account',
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
            'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.CLIENT_CERT_URL,
    }),
    databaseURL: process.env.DATABASE_URL,
})

export function intializeFirebase() {
    return fireBaseAdmin
}

export function getFireBaseAdmin() {
    return fireBaseAdmin
}

export function create(path, child, data) {
    const db = fireBaseAdmin.database()
    return db
        .ref(path)
        .child(child)
        .set(data, error => {
            if (error) {
                console.log('Data could not be saved.' + error)
                return false
            } else {
                console.log('Data saved successfully.')
                return true
            }
        })
}

export function update(path, child, data) {
    const db = fireBaseAdmin.database()
    return db
        .ref(path)
        .child(child)
        .update(data, error => {
            if (error) {
                console.log('Data could not be updated.' + error)
                return error
            } else {
                console.log('Data updated successfully.')
                return data
            }
        })
}

export function get(path, child) {
    const db = fireBaseAdmin.database()
    return db
        .ref(path)
        .child(child)
        .once('value', data => {
            return data
        })
}

export function getAsync(path, child, event, responseCallback, errorCallback) {
    const db = fireBaseAdmin.database()
    return db
        .ref(path)
        .child(child)
        .on(event, responseCallback, errorCallback)
}
