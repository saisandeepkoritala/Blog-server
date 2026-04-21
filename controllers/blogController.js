const Blog = require("../Models/blogModel");

exports.getAllBlogs = async (req, res, next) => {
    try{
        console.log("hi raaaa")
        console.log(req.headers.cookie)
        const allBlogs = await Blog.find();
        res.status(200).json({
            status:"success",
            message:"okay",
            allBlogs
        })
    }
    catch(e){
        res.status(400).json({
            status:"fail",
            message:"error"
        })
    }
}

exports.createBlog = async (req, res, next) => {
    try {
        console.log("hi raaaa", req.body.email);

        // Ensure email is a string
        const email = typeof req.body.email === "object" ? req.body.email.email : req.body.email;

        const savedBlog = await Blog.create({
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags,
            email: email, // Use extracted email
            createdAt: Date.now(),
        });

        res.status(200).json({
            status: "success",
            message: "okay",
            data: savedBlog,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: "fail",
            message: "error",
        });
    }
};

exports.getBlogById = async (req, res, next) => {
    try{
        // console.log("hi raaaa",req.body)
        console.log("hi raaaa",req.params)
        const blog = await Blog.findById(req.params.id);
        res.status(200).json({
            status:"success",
            message:"okay",
            blog
        })
    }
    catch(e){
        console.log(e)
        res.status(400).json({
            status:"fail",
            message:"error"
        })
    }
}