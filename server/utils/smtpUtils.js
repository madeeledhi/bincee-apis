import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Godaddy',
    host: 'smtpout.secureserver.net',
    secureConnection: false,
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
})

export function initMail() {
    return transporter
}

export function sendEmail(
    to = '',
    subject = '',
    text = '',
    html = '<div></div>',
) {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html,
    }

    console.log('I am here: ', mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        console.log('I am here: ', info, error)
        if (error) {
            return error
        } else {
            return info.response
        }
    })
}
