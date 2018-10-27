export const firebaseResponseHandler = snapshot => {
    return snapshot.val()
}

export const firebaseErrorHandler = errorObject => {
    console.log('The read failed: ' + errorObject.code)
    return errorObject
}
