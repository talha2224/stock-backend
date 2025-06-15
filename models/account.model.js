const mongoose = require("mongoose")



const AccountSchema = mongoose.Schema({
    first_name:{type:String,default:null},
    last_name:{type:String,default:null},
    phone:{type:String,default:null},
    email:{type:String,default:null},
    password:{type:String,default:null},
    otp:{type:Number,default:null},
    otpVerified:{type:Boolean,default:false},
    accountBlocked:{type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now }
})



const AccountModel = mongoose.model("Account",AccountSchema,"Account")


module.exports ={ AccountModel }
