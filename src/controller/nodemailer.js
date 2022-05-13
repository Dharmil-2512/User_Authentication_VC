const config = require("../config/auth.config");
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require("path");
const { getMaxListeners } = require("process");

const userMail = config.user;
const passMail = config.pass;







exports.sendConfirmationEmail = function sendConfirmationEmail(name, email, emailVerificationToken) {
    console.log("Check");
    try {

        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: userMail,
                pass: passMail,
            },
        });
        console.log("(((", __dirname)
        const data = ejs.renderFile(path.join(__dirname, '../views/mail.ejs'), { name: name, EmailVerifyToken: emailVerificationToken }, function(err, data) {
            console.log('------', typeof data)
            transport.sendMail({
                from: userMail,
                to: email,
                subject: "Please confirm your account",
                html: data
            })
        });



    } catch (error) {
        console.log('error', error);

    }
};


exports.resetPasswordEmail = function resetPasswordEmail(name, email, resetPasswordToken) {
    try {

        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: userMail,
                pass: passMail,
            },
        });
        const data1 = ejs.renderFile(path.join(__dirname, '../views/recover.ejs'), { name: name, resetPasswordToken: resetPasswordToken }, function(err, data) {
            transport.sendMail({
                from: userMail,
                to: email,
                subject: "Please Reset Your Password",
                html: data
            })
        });




    } catch (error) {
        console.log('error', error);

    }
}

exports.purchasedInvoice = (email) => {
    try {

        console.log('hello i am entered in mail');

        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: userMail,
                pass: passMail,
            },
        });

        const mailOptions = {
            from: userMail,
            to: email,
            subject: "Purchased Product Invoice",
            text: 'Check out this attached pdf file',
            attachments: [{
                filename: 'purchase_Invoice.pdf',
                path: path.join(__dirname, '../PurchasedItems/purchased.pdf'),
                contentType: 'application/pdf'
            }],
        }

        transport.sendMail(mailOptions,
            function(err, info) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(info);
                }
            });






    } catch (error) {
        console.log('error', error);

    }

}