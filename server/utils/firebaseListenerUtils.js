// libs

// src
import { attachFBListener } from './firebaseUtils'

export const firebaseResponseHandler = snapshot => {
    console.log('snapShot: ', snapshot.val())
    return snapshot.val()
}

export const firebaseErrorHandler = errorObject => {
    console.log('The read failed: ' + errorObject.code)
    return errorObject
}

// TODO: Register Listeners in this function to handle changes in Firebase DB
export function registerListeners() {
    attachFBListener(
        '/test',
        '/',
        'value',
        firebaseResponseHandler,
        firebaseErrorHandler,
    )
}
