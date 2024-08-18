const User = require("../Models/userModel");
const TempUser = require("../Models/tempUser");
const jwt = require("jsonwebtoken");
const send = require("../Utils/email");

const getToken = (email) => {
    return jwt.sign({ email}, "MY-SECRET-KEY-TO-HASH-THE-LOGIN",{expiresIn:'1d'});
};


exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email:email,accountType:"normal"}).select("+password");
        const encoded = await user.correctPassword(password, user.password);


        const token = getToken(user.email);

        user.password = undefined;
        if (encoded) {
            res.cookie("Access_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite:"none",
                    domain:"https://saisandeep-blog.netlify.app",
                })
                .status(200)
                .json({
                    status: "success",
                    token,
                    data: {
                        user,
                    },
                });
                res.header("Access-Control-Allow-Credentials", "true");
                res.header("Access-Control-Allow-Origin", "https://saisandeep-blog.netlify.app");
        } else {
            res.status(400).json({
                status: "Fail",
                error: "error",
                message: "Password not matched",
            });
        }
    } catch (e) {
        res.status(401).json({
            status: "Fail",
            error: "error",
        });
    }
};

exports.signUp = async (req, res, next) => {
    try {
        // Validate password confirmation
        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
                status: 'Fail',
                error: 'Passwords do not match'
            });
        }

        // Check for existing user
        const isAlreadyUser = await User.findOne({ email: req.body.email });
        let newUser;

        // Handle different account types
        if (isAlreadyUser?.accountType?.includes("google")) {
            // User has a Google account and needs to add a normal account

            isAlreadyUser.accountType.push("normal");
            isAlreadyUser.password = req.body.password;
            isAlreadyUser.passwordConfirm = req.body.passwordConfirm;

            await isAlreadyUser.save({ validateBeforeSave: false });
            newUser = isAlreadyUser;
        } else {
            // User does not have a Google account and needs to add a normal account
            newUser = new User({
                userName: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                accountType: ["normal"],
                accountCreatedAt: new Date(),
                passwordLastRestedAt: new Date(),
                passwordLastUpdatedAt: new Date(),
            });
            await newUser.save();
        }


        // Generate and send token
        const token = getToken(newUser.email);
        await TempUser.deleteOne({ email: newUser.email });

        res.cookie("Access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain:"https://saisandeep-blog.netlify.app",
        })
        .status(200)
        .json({
            status: "success",
            token,
            data: {
                user: newUser,
            },
        });
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Origin", "https://saisandeep-blog.netlify.app");

    } catch (e) {
        console.error("Error during sign up:", e);
        res.status(500).json({
            status: "Fail",
            error: e.message || "Internal Server Error",
        });
    }
};


exports.sendCode=async(req,res,next)=>{
    try{
        console.log(req.body)
        const {name,email}=req.body;

        const duplicate = await User.findOne({
            email: email,
            accountType: { $in: ["normal"] }
        });

        console.log(duplicate)
        if(duplicate){
            res.status(401).json({
                status:"Fail",
                message:"Email already existed"
            })
        }
        else{

            const alreadyTempUser = await TempUser.findOne({email:email}) 
            if(!alreadyTempUser){
                const message=Math.floor(Math.random()*1000000);
                send({
                    email:`${email}`,
                    subject: "USE THE OTP BELOW",
                    message:`${message}`
                }).then(resp => {
                    res.status(200).json({
                        status:"success",
                        message:"code sent",
                        resp
                    })
                }).catch(error => {
                    res.status(400).json({
                        status:"Fail",
                        message:"Try Again",
                        error
                    })
                });
                const currentDate = new Date();
                const futureDate = new Date(currentDate.getTime() + 10 *60* 1000); 
                const resp = await TempUser.create({
                    userName:name,email,code:message,expiresIn:futureDate
                })

                }
                else{
                    const message= Math.floor(Math.random()*1000000);
                    const currentDate = new Date();
                    alreadyTempUser.expiresIn = new Date(currentDate.getTime() + 10 *60* 1000); 
                    alreadyTempUser.code = message;
                    await alreadyTempUser.save();

                    send({
                        email:`${email}`,
                        subject: "RESENDING OTP",
                        message:`${message}`
                    }).then(resp => {
                        res.status(200).json({
                            status:"success resending",
                            message:"code sent again",
                            resp
                        })
                    }).catch(error => {
                        res.status(400).json({
                            status:"Fail Resending",
                            message:"For some Reason Failed",
                            error
                        })
                    });

                }
        }
    }
    catch(e){
        console.log("hello",e)
    }
}

exports.secureRoute=async(req,res,next)=>{
    // console.log(req.cookies)
    const token = req.cookies.Access_token;
    console.log("token",token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'MY-SECRET-KEY-TO-HASH-THE-LOGIN', (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = decoded;

        next();
    });
}


exports.updatePassword = async(req,res,next)=>{
    console.log(req.body)
    try{

        const isUser = await User.findOne({email:req.body.email}).select("+password")
        if(!isUser){
            res.json({
                status:"fail",
                message:"invalid details"
            })
        }

        const isPasswordCorrect = await isUser.correctPassword(req.body.password, isUser.password);

        // console.log(isPasswordCorrect)

        if(!isPasswordCorrect){
            return res.json({
                status:"failll",
                message:"password diff"
            })
        }

        isUser.password = req.body.password;
        isUser.passwordConfirm = req.body.passwordConfirm;

        isUser.passwordLastUpdatedAt = new Date();

        isUser.passwordLastRestedAt = new Date();

        await isUser.save({validateBeforeSave: false});

        res.status(200).json({
            status:"success",
            message:"hi"
        })

    }

    catch(e){
        res.json({
            status:"failll"
        })

    }
}
exports.modifyPassword = async (req, res, next) => {
    try {
        console.log(req.body);

        const user = await User.findOne({ email: req.body.email}).select("+password");

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        // Check if password has at least 8 characters after trimming
        if (req.body.password.trim().length < 8) {
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 8 characters long"
            });
        }

        user.userPassword = req.body.password;
        user.password = req.body.password;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while updating password"
        });
    }
};


exports.forgotPassword = async(req,res,next)=>{
    try{
        console.log("ungaaaa",req.body)

        const isEmailValid = await User.findOne({email:req.body.email,accountType:{$in:["normal"]}});

        if(!isEmailValid){
            return res.status(400).json({
                status: "error",
                message: "No account present "
            });
        }

        const message= Math.floor(Math.random()*1000000);
        isEmailValid.passwordResetToken = message;
        isEmailValid.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
        await isEmailValid.save({validateBeforeSave:false}); 

        send({
            email:`${req.body.email}`,
            subject: "Forgot Password",
            message:`${message}`
        }).then(resp => {
            res.status(200).json({
                status:"success",
                message:"code sent,sending reset token to email",
                resp
            })
        }).catch(error => {
            res.status(400).json({
                status:"Fail",
                message:"For some Reason email Failed",
                error
            })
        });

    }
    catch(e){
            res.status(400).json({
            status:"Fail catch",
            message:"For some Reason email Failed,again",
        })
    }
}


exports.verifyForgotOtp = async (req, res, next) => {
    try {
        // console.log(req.body);
        const user = await User.findOne({ email: req.body.email, passwordToken: req.body.otp, });
        
        // console.log("user is ", user);
        if (!user) {
            return res.status(422).json({
                status: "OTP Incorrect",
                message: "Wrong OTP"
            });
        } else {
            return res.json({
                status: "success",
                message: "OTP verification successful"
            });
        }
    } catch (error) {
        console.error("Error in verifyForgotOtp:", error);
        return res.status(500).json({
            status: "Failed to verify OTP",
            message: "Failed to verify OTP. Please try again.",
            error: error.message
        });
    }
};

exports.logOut = async(req,res,next)=>{
    try{
        console.log("bro",req.token)
        res.clearCookie('Access_token').status(200).json({
            status:"ok"
        });
    }
    catch(e){
        return res.status(500).json({
            status: "error",
            message: "Please try again.",
            error: e.message
        });
        
    }
}

exports.verifyCode=async(req,res,next)=>{
    try{
        const {email,code} = req.body;

        const tempuser = await TempUser.findOne({email:email,
            code:code,expiresIn: { $gt: new Date() }})
        if(tempuser){
            res.status(200).json({
                status:"success",
                message:"verified"
            })
        }
        else{
            res.status(401).json({
                status:"Fail",
                message:"OTP expired"
            })
        }
    }
    catch(e){

    }
}


exports.profilePic=async(req,res,next)=>{
    try{

        console.log(req.body)
        const user = await User.findOne({email:req.body.email});
        console.log(user)

        if(!user.picture){
            return res.status(404).json({
                status:"fail",
                message:"user pic not found"
            })
        }
        else{
            return res.status(200).json({
                status:"success",
                pic:user.picture
            })
        }
    }
    catch(e){
        console.log(e)
    }
}