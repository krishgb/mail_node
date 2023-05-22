const mailer = require('nodemailer')


const user = process.env.USER,
pass = process.env.PASS

const mail = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user,
        pass,
    },
    authMethod: 'PLAIN'
})

module.exports = mail
