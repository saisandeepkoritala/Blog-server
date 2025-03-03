const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth2').Strategy; 
const dotenv = require("dotenv");
dotenv.config({path:`${__dirname}/config.env`});

passport.serializeUser((user , done) => { 
	done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
	done(null, user); 
}); 

passport.use(new GoogleStrategy({ 
	clientID:process.env.CLIENT_ID,
	clientSecret:process.env.CLIENT_SECRET,
	callbackURL:"https://blog-server-5rxh.onrender.com/api/v1/user/auth/google/callback", 
	// callbackURL:"http://localhost:5000/api/v1/user/auth/google/callback",
	passReqToCallback:true
}, 
function(request, accessToken, refreshToken, profile, done) { 
	return done(null, profile); 
} 
));


