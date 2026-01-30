const nodemailer = require('nodemailer');


const sendEmail = async options => {
    //create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'Abdellah EL GHENNAMI <hello@nestquest.net',
        to: options.email,
        subject: options.subject,
        text: options.text
    }
    await transporter.sendMail(mailOptions);

}