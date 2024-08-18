const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Configure CORS
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://saisandeep-blog.netlify.app"],
    credentials: true, // Allow cookies to be sent in cross-site requests
}));

// Static files middleware
app.use(express.static("public"));

// Session middleware
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET_HERE_BRO",
    cookie: {
        sameSite: 'none',  // Allow cross-site cookies
        secure: true,      // Cookies sent over HTTPS
    }
}));

// User routes
app.use("/api/v1/user", userRouter);

module.exports = app;
