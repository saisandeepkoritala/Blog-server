const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const morgan = require("morgan");
const session = require('express-session');


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173","https://saisandeep-blog.netlify.app"]
    }));

app.use(express.static("public"))

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:"SECRET_HERE_BRO",
    cookie:{
        sameSite:'none',
        secure: true,
    }
}));


app.use("/api/v1/user",userRouter);


module.exports = app;
