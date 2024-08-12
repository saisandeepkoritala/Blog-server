const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Title not Provided"],
        unique:[true,"Title already exists"]
    },
    body:{
        type:mongoose.Schema.Types.Mixed,
        required:[true,"Body not Provided"],
    },
    tags:{
        type:Array,
        required:[true,"Need tags"]
    },

    name:{
        type:String,
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
module.exports = Blog;