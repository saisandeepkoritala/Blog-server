const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title not Provided"]
    },
    message:{
        type:String,
        required:[true,"Message not Provided"],
    },
    skills:{
        type:mongoose.Schema.Types.Mixed,
        required:[true,"Need Tags"]
    },
    image:{
        type:String,
        required:[true,"Need image"]
    },
    name:{
        type:String,
        required:[true,"Need name"]
    },
    email:{
        type:String,
        required:[true,"Need email"]
    },
    createdAt:{
        type:Date
    },
    likes:{
        type:Number
    },
    likedBy:{
        type:Array
    }
})

const Blog = mongoose.model("blogs",BlogSchema);

module.exports = Image;