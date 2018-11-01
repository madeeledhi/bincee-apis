// libs

// src
import { attachFBListener } from './'
import { get } from 'https'

export const firebaseResponseHandler = snapshot => {
    console.log('snapShot: ', snapshot.val())
    return snapshot.val()
    // TODO: Logic for route creation
}

export const firebaseErrorHandler = errorObject => {
    console.log('The read failed: ' + errorObject.code)
    return errorObject
}

// TODO:  Register Listeners in this function to handle changes in Firebase DB
export function registerListeners() {
    attachFBListener(
        '/ride',
        '/',
        'value',
        firebaseResponseHandler,
        firebaseErrorHandler,
    )
}
