const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: null,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,       // allows null without unique-conflict
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType',
        default: null,
    },
    deliveryInfo: {
        vehicleNumber: { type: String, trim: true },
        isAvailable: { type: Boolean, default: true }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', user);
module.exports = User;