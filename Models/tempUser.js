const mongoose = require("mongoose");
const validator = require("validator");

const tempUser = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"Name not Provided"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"Email not Provided"],
        validate:[validator.isEmail,"Email is not valid"]
    },
    code:{
        type:String,
        required:[true,"Need an Code"]
    },
    expiresIn:{
        type:Date
    }
})

const TempUser = mongoose.model("tempUser",tempUser)

module.exports = TempUser;