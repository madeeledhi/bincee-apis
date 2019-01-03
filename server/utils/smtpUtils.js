import nodemailer from 'nodemailer'

console.log('process', process.env.EMAIL_PASS)
const transporter = nodemailer.createTransport({
    service: 'Godaddy',
    host: 'smtpout.secureserver.net',
    secure: false,
    port: 25,
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error
        } else {
            return info.response
        }
    })
}
