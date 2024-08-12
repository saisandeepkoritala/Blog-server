exports.isAlive = async(req,res,next)=>{
    try{
        console.log("is alive")
        res.json({
            status:"Success",
            message:"Server is Up"
        })
    }
    catch(e){
        res.json({
            status:"Fail",
            message:"Server is down"
        })
    }
}

