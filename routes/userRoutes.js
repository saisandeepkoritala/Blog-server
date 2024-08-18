const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const {isAlive }= require("../controllers/userController");

const {loginUser,signUp,
    profilePic,
    secureRoute,
    verifyCode,
    sendCode,
    forgotPassword,
    updatePassword,
    modifyPassword,
    verifyForgotOtp,
    logOut} = require("../controllers/authController");


const {getAllBlogs,
    createBlog,
    getBlogById} = require("../controllers/blogController");

const Router = express.Router();


Router.route("/allBlogs").get(getAllBlogs);
Router.route("/createBlog").post(createBlog);
Router.route("/blog/:id").get(getBlogById);

Router.route("/profilePic").post(profilePic)

Router.route("/isAlive").get(isAlive);
Router.route("/login").post(loginUser);
Router.route("/signup").post(signUp);
Router.route("/sendCode").post(sendCode);
Router.route("/verifyCode").post(verifyCode);

Router.route("/forgotPassword").post(forgotPassword); //1

Router.route("/updatePassword").post(updatePassword);

Router.route("/modifyPassword").post(modifyPassword);  //3

Router.route("/verifyForgotOtp").post(verifyForgotOtp); //2

Router.route("/logout").post(logOut);

const passport = require('passport'); 
require('../passport');

Router.use(passport.initialize()); 
Router.use(passport.session());

Router.get('/auth/google' , 
passport.authenticate('google', 
{ scope: 
	[ 'email', 'profile' ] 
}
)
); 

const getToken = (email) => {
    return jwt.sign({ email}, "MY-SECRET-KEY-TO-HASH-THE-LOGIN",{expiresIn:'1d'});
};

Router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failure'
    }),
    async(req, res) => {
        const userData = encodeURIComponent(JSON.stringify(req.user));
        const token = getToken(req.user.email);

        console.log(req.user)

        const isAlreadyExistingUser = await User.findOne({ email: req.user.email});
        console.log(isAlreadyExistingUser)

        if(isAlreadyExistingUser){
            // user has normal account or google account
            if(!isAlreadyExistingUser?.accountType?.includes("google")){
                isAlreadyExistingUser.accountType.push("google");
                isAlreadyExistingUser.picture = req.user.picture;
                await isAlreadyExistingUser.save({validateBeforeSave: false});
            }
        }
        else{
            // user has no account or has google account
            if(!isAlreadyExistingUser?.accountType?.includes("normal")){
                const newUser = new User({
                    userName: req.user.displayName,
                    email: req.user.email,
                    accountType: ["google"],
                    picture: req.user.picture,
                    accountCreatedAt: new Date(),
                    passwordLastRestedAt: new Date(),
                    passwordLastUpdatedAt: new Date(),
                });
    
                await newUser.save({validateBeforeSave: false});
            }
        }


            res.cookie("Access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain:"https://saisandeep-blog.netlify.app",

            });
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Origin", "https://saisandeep-blog.netlify.app");

            //res.redirect(`http://localhost:5173?userData=${userData}`)
            res.redirect(`https://saisandeep-blog.netlify.app?userData=${userData}`)
}
);

module.exports = Router;