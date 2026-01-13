const mongoose = require('mongoose');


const user = new mongoose.Schema({
    name: {
        type: String,
        default:null,
    },
    email: {
        type: String,
        default:null,
        unique: true
    },
    password: {
        type: String,
        default:null,
    },
    address: {
        type: String
    },
    mobile: {
        type: String
    },
    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType',
        default:null,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpires:{
        type:Date,
      default:null,
    },
    isDeleted: {
        type: Date,
        default: null
    }
}, { timestamps: true });


const User = mongoose.model('User', user);
module.exports = User;