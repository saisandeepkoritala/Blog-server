const express = require("express");
const jwt = require("jsonwebtoken");

const {
    successGoogleLogin,
    failureGoogleLogin,
    isAlive }= require("../controllers/userController");

const {loginUser,signUp,
    secureRoute,
    verifyCode,
    sendCode,
    forgotPassword,
    updatePassword,
    modifyPassword,
    verifyForgotOtp,logOut} = require("../controllers/authController");


const {getAllBlogs} = require("../controllers/blogController");

const Router = express.Router();


Router.route("/allBlogs").get(secureRoute,getAllBlogs);
Router.route("/isAlive").get(isAlive);
Router.route("/login").post(loginUser);
Router.route("/signup").post(signUp);
Router.route("/sendCode").post(sendCode);
Router.route("/verifyCode").post(verifyCode);
Router.route("/forgotPassword").post(forgotPassword);
Router.route("/updatePassword").post(updatePassword);
Router.route("/modifyPassword").post(modifyPassword);
Router.route("/verifyForgotOtp").post(verifyForgotOtp);
Router.route("/logout").post(secureRoute,logOut);

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
    (req, res) => {
        const userData = encodeURIComponent(JSON.stringify(req.user));
        const token = getToken(req.user.email);

            res.cookie("Access_token", token, {
                httpOnly: true,
                secure: true,
            });
            res.redirect(`http://localhost:5173?userData=${userData}`)
    }
);


// Success 
Router.get('/success' , successGoogleLogin); 

// failure 
Router.get('/failure' , failureGoogleLogin);

module.exports = Router;