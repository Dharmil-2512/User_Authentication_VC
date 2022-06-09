const dotenv = require('dotenv').config();

// const config = require("../config/auth.config");
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const upload = require('../middleware/multer')
const nodeMailer = require('./nodemailer');
const fs = require('fs');


// const jwt = require("jsonwebtoken");

// exports.upload = async(req, res) => {
//     try {


//         if (req.file == undefined) {
//             return res.status(400).send({ message: "Please upload a file!" });
//         }
//         const image = "http://192.168.20.96:3000/public/upload/" + req.savedFileName;
//         return res.status(200).send({
//             message: "Uploaded the file successfully: ",
//             data: image
//         });
//     } catch (err) {
//         console.log('error--------------');
//         return res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//         });
//     }
// };
exports.signUp = async function signUp(req, res) {
    try {

        // console.log("BODY==================", req.body);
        // console.log("FILEc ===================", req.file);

        // console.log('log1', req.file, req.savedFileName);
        if (req.file == undefined) {
            console.log('hello')
            return res.status(400).send({ message: "Please upload a file!" });
        } else {

            // console.log('i am here')
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let token = '';
            for (let i = 0; i < 25; i++) {
                token += characters[Math.floor(Math.random() * characters.length)];
            }


            const password = bcrypt.hashSync(req.body.password);

            const requestObj = JSON.parse(JSON.stringify(req.body));
            // console.log("🚀 ~ file: user.controller.js ~ line 51 ~ signUp ~ requestObj", req.body)
            // const requestObj = {}
            requestObj.password = password;
            requestObj.emailVerificationToken = token;
            requestObj.image = req.savedFileName;

            // console.log('request object', requestObj)



            const user = new User(
                requestObj
            );
            // console.log("User==========>>>", user);

            const isMatchEmail = await User.findOne({ email: req.body.email });
            if (isMatchEmail) {
                return res.status(409).send({
                    message: "User Already registered",
                    error: []
                });
            }
            await user.save((err) => {
                if (err) {
                    console.log('err', err)
                    res.status(500).send({
                        message: "invalid credentials",
                        error: [err]
                    });
                    return;
                }
            });

            await nodeMailer.sendConfirmationEmail(
                user.name,
                user.email,
                user.emailVerificationToken
            );

            res.status(200).send({
                message: "User was registered successfully! Please check your email",

            });
        }
    } catch (error) {
        console.log('error1', error);

        res.status(400).send({
            message: "bad request",
            error: [error]

        });
    }
}

exports.signUpVerification = async function signUpVerification(req, res, next) {
    try {

        console.log("hello===>>> ", req.params.EmailVerifyToken);

        let updatedUser = await User.findOneAndUpdate({
            emailVerificationToken: req.params.EmailVerifyToken,
        }, {
            $set: {
                isEmailVerified: true
            }
        })




        updatedUser.emailVerificationToken = '';
        await updatedUser.save();




        res.redirect('http://192.168.43.150:4200/auth/login');
    } catch (error) {
        console.log('error3', error);
        res.status().send({
            message: "server error",
            error: [error]
        });
    }


};

exports.login = async function(req, res) {


    try {


        let loginUser = await User.findOne({ email: req.body.email });
        console.log("final data", loginUser);
        if (!loginUser) {
            return res.status(400).json({
                message: "User Not Exist",
                error: []
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, loginUser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect Password!",
                error: []
            });
        }

        if (loginUser.isEmailVerified != true) {
            return res.status(401).json({
                message: "Pending Account. Please Verify Your Email!",
                error: []
            });
        }

        const payload = {
            user: {
                id: loginUser._id,
                name: loginUser.name,
                email: loginUser.email
            }
        };

        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600 * 24 }, (err, token) => {
            if (err) throw err;
            res.status(200).send({
                message: "login successfully",
                token: token
            });
        });
    } catch (error) {
        console.log('error2', error);
        res.status(500).send({
            message: "Server Error",
            error: [error]
        });
    }
}

exports.getProfile = async function getProfile(req, res, next) {
    try {

        const userProfile = await User.findOne({ _id: req.user.id }, { name: 1, email: 1, image: 1 });
        console.log('user profile', userProfile)
        userProfile.image = "http://localhost:3000/public/upload/" + userProfile.image
        res.status(200).send({
            message: "successfully get profile",
            data: [userProfile]

        })

    } catch (err) {
        console.log('error3', err);
        res.status().send({
            message: "Error in Fetching user",
            error: [error]
        })
    }
}

exports.updateProfile = async function updateProfile(req, res, next) {

    console.log('chill');
    try {
        console.log('log1 : ', req.body.name);

        // let update = await User.updateOne({ email: req.body.mailID }, { $set: { username: req.body.name } });
        let userData = await User.findOne({ _id: req.user.id }, { name: 1, email: 1, image: 1 });
        userData.name = req.body.name;
        userData.image = req.body.image;
        await userData.save();

        userData.image = "http://localhost:3000/public/upload/" + userData.image;

        console.log("......", userData);

        return res.status(200).send({
            message: "successfully updated profile",
            data: [userData]

        });


    } catch (err) {
        console.log('error4', err)
        res.status(500).send({ message: "server error" })
    }


}

exports.forgotPassword = async function forgotPassword(req, res, next) {

    try {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let resetToken = '';
        for (let i = 0; i < 25; i++) {
            resetToken += characters[Math.floor(Math.random() * characters.length)];
        }


        let mongoUser = await User.findOne({ email: req.body.email });
        if (!mongoUser) {
            return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }

        mongoUser.resetPasswordToken = resetToken;

        await mongoUser.save();




        res.status(200).send({
            message: "Please check your mail for reset your password",

        });

        nodeMailer.resetPasswordEmail(

            mongoUser.name,
            mongoUser.email,
            mongoUser.resetPasswordToken
        );



    } catch (err) {
        console.log('error4', err)
        res.status(500).send({
            message: "error trying to fetch details",
            error: [err]
        })
    }


}

exports.changePassword = async function(req, res, next) {
    try {

        let user = await User.findOne({ resetPasswordToken: req.params.resetPasswordToken });
        if (!user) {
            return res.status(404).send({
                message: "Please check your mail to change password"
            })
        } else {
            const isMatch = await bcrypt.compare(req.body.newPassword, user.password);

            if (!isMatch) {
                // user.password = req.body.newPassword;
                // await user.save();

                // user.resetPasswordToken = " ";
                // await user.save();
                console.log('user mail', user.email)
                let updatedUser = await User.findOneAndUpdate({ email: user.email }, { password: req.body.newPassword, resetPasswordToken: "" }, { new: true, upsert: true })

                console.log('validate user', updatedUser);

                return res.status(200).send({ message: 'password changed successfully' });

            } else {
                return res.status(400).send({
                    message: "Password Matched with db Password!"
                });
            }
        }

    } catch (err) {
        console.log('err5', err);
        res.status(304).json({ message: "not modified", error: [err] })
    }
}