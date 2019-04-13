import nodemailer from 'nodemailer'
import Email from 'email-templates'
import path from 'path'

const assets = {
    header: 'http://static.bincee.com/images/header.png',
    footer: 'http://static.bincee.com/images/footer.png',
    logo: 'http://static.bincee.com/images/logo.png',
    appleIcon: 'http://static.bincee.com/images/appleStore.png',
    androidIcon: 'http://static.bincee.com/images/googleStore.png',
    fbIcon: 'http://static.bincee.com/images/facebook.png',
    igIcon: 'http://static.bincee.com/images/instagram.png',
    twIcon: 'http://static.bincee.com/images/twitter.png',
    fonts: 'https://fonts.googleapis.com/css?family=Montserrat',
}

const transport = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP,
    secure: false,
    port: 587,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
})

export function initMail() {
    return transport
}

export function sendEmail(to = '', subject = '', data, welcome = true) {
    const template = welcome ? 'welcome' : 'creds'
    console.log(path.join(__dirname, '..', `emails/${template}`))
    const email = new Email({
        message: {
            from: process.env.EMAIL,
        },
        send: true,
        transport,
        htmlToText: false,
        views: {
            root: path.join(__dirname, '..', `emails`),
            options: {
                extension: 'ejs',
            },
        },
    })
    return email
        .send({
            template,
            message: {
                to,
                subject,
            },
            locals: { ...data, assets },
        })
        .then(console.log)
        .catch(console.error)
}
