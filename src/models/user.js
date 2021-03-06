const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { string } = require('joi');

const GENDERS = ["Male", "Female"];

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    emailVerificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },

    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: GENDERS
    },

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;