const express = require("express")
const app = express()
const morgan = require("morgan")
const userRoutes = require("./api/routes/userRoute")
const productRoute = require("./api/routes/productRoute")
const orderRoute = require("./api/routes/orderRoute")
const cors = require("cors")
const bodyParser = require('body-parser');
require('dotenv').config()  
const { default: axios } = require("axios")
require("dotenv").config();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const session = require("express-session")

app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use(session({
    secret: 'secret', // Change this to a random string
    resave: false,
    saveUninitialized: true
}));


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    }
    next()
})

app.get("/", (req, res) => {
    res.status(200).json({
        message : "welcome to perfume delivery web app api",
        version : "1.0",
        author : "muhammadjamiu"
    })
})

app.use("/user", userRoutes)
app.use("/product", productRoute)
app.use("/order", orderRoute)

app.use((req, res) => {
    res.status(404).json({
        message : "Endpoint not found"
    })
})

module.exports = app