import * as admin from 'firebase-admin'

function intializeFirebase() {
    const serviceAccount = require('../../config/firebaseConfig/bincee-67ec6-firebase-adminsdk-k1zs9-3b3e1e9c89.json')
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://bincee-67ec6.firebaseio.com',
    })
}
