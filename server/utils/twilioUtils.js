import twilio from 'twilio'

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const client = twilio(accountSid, authToken)

export function sendSMS(to, body) {
    try {
        client.messages
            .create({ body, from: process.env.TWILIO_NUMBER, to })
            .then(message => console.log(message.sid))
            .catch(err => console.log(err))
            .done()
    } catch (err) {
        console.log('Error: ', err)
    }
}
