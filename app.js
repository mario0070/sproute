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

app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cors())


const CLIENT_ID = '1089248889378-hib3g0kdhtnc04u3osqh0inrj49h8ga5.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://127.0.0.1:6000/auth/google/callback';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.get('/test1', (req, res) => {
    var count = 0
    setInterval(() => {
        count++
        console.log("interval")   
        console.log(count) 
    }, 3000);
});

app.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.status(200).json({url})
//   res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
  
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });
    
        const { access_token, id_token } = data;
    
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
  
        const ref_code = generateString(15);
        
        earnUserSchema.find({email : profile.email})
        .then(result => {
           if(result.length >= 1){
                res.status(200).json({
                    message : "user already exist",
                    data : result,
                    code
                })
           }else{
            bcrypt.hash(profile.name, 10, (err, hash) => {
            if(hash){
                const user = new earnUserSchema({
                    fullname : profile.name,
                    password : hash,
                    email : profile.email,
                    phone : null,
                    ref_code : ref_code,
                })
            
                user.save()
                .then(data => {
                    const token = jwt.sign({ 
                        fullname : profile.name,
                        email : profile.email,}, "secret", {expiresIn : "12h"}
                    )
                    UserRef(req, res)

                    res.status(200).json({
                        message : "user created successfully",
                        data,
                        "access-token" : token
                    })
                    

                })
                .catch( err => {
                    res.status(500).json({
                        message: err
                    })
                })
            }else{
                res.status(500).json({
                    message: "Something went wrong"
                })
            }
                })
            }
        })

    } 
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({error})
    }
});

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
        message : "welcome to food delivery web app api",
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