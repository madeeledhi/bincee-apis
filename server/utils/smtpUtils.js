import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP,
    secure: true,
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

    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ', error)
            return error
        } else {
            console.log('Info: ', info.response)
            return info.response
        }
    })
}
