const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sfiteamten@gmail.com',
        pass: 'cs3305team10',
    },
});
module.exports = function sendEmail(to, subject, message) {
    const mailOptions = {
        from: 'sfiteamten@gmail.com',
        to,
        subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};