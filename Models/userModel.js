const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:[true,"Last Name is needed for user"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        validate:[validator.isEmail,"Email is not valid"],
        required:[true,"Email is Needed"],
    },
    password:{
        type:String,
        required:[true,"Password is needed for user"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Password is needed for user"],
        minlength:8,
        validate:{
            validator:function(value){
                return this.password === value;
            },
            message:"Password Not Matched"
        }
    },

    accountType:{
        type:Array,
        required:[true,"Account Type is needed for user"]
    },
    picture:{
        type:String
    },
    accountCreatedAt:{
        type:Date
    },

    passwordLastRestedAt:{
        type:Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpires:{
        type:Date
    },

    passwordLastUpdatedAt:{
        type:Date
    }

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(password,userPassword){
    return await bcrypt.compare(password,userPassword);
}

const User = mongoose.model("user",userSchema);

module.exports = User;