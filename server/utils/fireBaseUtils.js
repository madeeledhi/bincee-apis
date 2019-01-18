import * as admin from 'firebase-admin'
import size from 'lodash/fp/size'

console.log('Apps: ', admin.apps)
const { apps } = admin
const fireBaseAdmin =
    size(apps) < 1
        ? admin.initializeApp({
              credential: admin.credential.cert({
                  type: 'service_account',
                  project_id: process.env.PROJECT_ID,
                  private_key_id: process.env.PRIVATE_KEY_ID,
                  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                  client_email: process.env.CLIENT_EMAIL,
                  client_id: process.env.CLIENT_ID,
                  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                  token_uri: 'https://oauth2.googleapis.com/token',
                  auth_provider_x509_cert_url:
                      'https://www.googleapis.com/oauth2/v1/certs',
                  client_x509_cert_url:
                      'https=//www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k1zs9%40bincee-67ec6.iam.gserviceaccount.com',
              }),
              databaseURL: 'https://bincee-67ec6.firebaseio.com',
          })
        : apps[0]

export function intializeFirebase() {
    return fireBaseAdmin
}

export function getFireBaseAdmin() {
    return fireBaseAdmin
}

export function createFBData(path, child, data) {
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

export function updateFBData(path, child, data) {
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

export function updateMutipleFBChilds(pathArray) {
    const db = fireBaseAdmin.database()
    return db.ref().update({ pathArray }, error => {
        if (error) {
            console.log('Data could not be updated.' + error)
            return error
        } else {
            console.log('Data updated successfully.')
            return data
        }
    })
}

export function getFBData(collection, document) {
    const db = fireBaseAdmin.firestore()
    return new Promise((resolve, reject) => {
        db.collection(collection)
            .doc(document)
            .get()
            .then(response => {
                if (!response.exists) {
                    reject(new Error('Document Doesnot Exist'))
                } else {
                    resolve(response.data())
                }
            })
            .catch(error => {
                reject(error)
            })
    })
}

// TODO: Attach all listeners to app for realtime database events
export function attachFBListener(
    path,
    child,
    event,
    responseCallback,
    errorCallback,
) {
    const db = fireBaseAdmin.database()
    return db
        .ref(path)
        .child(child)
        .on(event, responseCallback, errorCallback)
}
