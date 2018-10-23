import * as admin from 'firebase-admin'

function intializeFirebase() {
    const serviceAccount = require('../../config/firebaseConfig/bincee-67ec6-firebase-adminsdk-k1zs9-3b3e1e9c89.json')
    admin.initializeApp({
        credential: admin.credential.cert({
            type: 'service_account',
            project_id: process.env.PROJECT_ID,
            private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: process.env.CLIENT_CERT_URL,
        }),
        databaseURL: process.env.DATABASE_URL,
    })
}

function create(path, child, data) {
    const db = admin.database()
    const ref = db
        .ref(path)
        .child(child)
        .set(data, function(error) {
            if (error) {
                console.log('Data could not be saved.' + error)
            } else {
                console.log('Data saved successfully.')
            }
        })
}
function update(path, child, data) {
    const db = admin.database()
    const ref = db
        .ref(path)
        .child(child)
        .update(data, function(error) {
            if (error) {
                console.log('Data could not be updated.' + error)
            } else {
                console.log('Data updated successfully.')
            }
        })
}
function get(path, child) {
    const db = admin.database()
    const ref = db
        .ref(path)
        .child(child)
        .once('value', function(data) {
            return data
        })
}
function getAsync(path, child, event) {
    const db = admin.database()
    const ref = db.ref(path).child(child)
    on(
        event,
        function(snapshot) {
            return snapshot.val()
        },
        function(errorObject) {
            console.log('The read failed: ' + errorObject.code)
        },
    )
}
