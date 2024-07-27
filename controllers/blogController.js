exports.getAllBlogs = async (req, res, next) => {
    try{
        console.log("hi raaaa",req.user.email)
        res.status(200).json({
            status:"success",
            message:"okay"
        })
    }
    catch(e){
        res.status(400).json({
            status:"fail",
            message:"error"
        })
    }
}