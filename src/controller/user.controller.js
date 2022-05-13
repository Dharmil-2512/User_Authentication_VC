const dotenv = require('dotenv').config();

// const config = require("../config/auth.config");
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const upload = require('../middleware/multer')
const nodeMailer = require('./nodemailer');
const fs = require('fs');


const jwt = require("jsonwebtoken");

exports.upload = async(req, res) => {
    try {
        console.log('log1', req.file);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        res.status(200).send({
            message: "Uploaded the file successfully: ",
            savedFileName: req.savedFileName
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};
exports.signUp = async function signUp(req, res) {
    try {
        console.log("req - - - - -  - ", req.body, req)
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 0; i < 25; i++) {
            token += characters[Math.floor(Math.random() * characters.length)];
        }
        console.log("token", token);




        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            image: req.body.image,
            emailVerificationToken: token
        });
        console.log("User==========>>>", user);

        const isMatchEmail = await User.findOne({ email: req.body.email });
        if (isMatchEmail) {
            return res.status(409).send({
                message: "User Already registered",
                error: []
            });
        }
        await user.save((err) => {
            if (err) {
                res.status(500).send({
                    message: "invalid credentials",
                    error: [err]

                });
                return;
            }

            res.status(200).send({
                message: "User was registered successfully! Please check your email",

            });



            nodeMailer.sendConfirmationEmail(
                user.name,
                user.email,
                user.emailVerificationToken
            );
        });
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

        console.log("hello===>>> ");

        let updatedUser = await User.findOneAndUpdate({
            emailVerificationToken: req.params.EmailVerifyToken,
        }, {
            $set: {
                isEmailVerified: true
            }
        })




        updatedUser.emailVerificationToken = '';
        await updatedUser.save();




        res.send('User Registered successfully')
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