const userSchema = require("../model/userSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const createUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(result => {
       if(result.length >= 1){
            res.status(200).json({
                message : "user already exist"
            })
       }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(hash){
                    const user = new userSchema({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        password : hash,
                        email : req.body.email,
                        phone : req.body.phone,
                    })
                
                    user.save()
                    .then(data => {
                        res.status(200).json({
                            message : "user created successfully",
                            data,
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
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })

   
}

const loginUser = (req, res) => {
    userSchema.find({email : req.body.email})
    .then(user => {
       if(user.length >= 1){
            bcrypt.compare(req.body.password, user[0].password, (err , bol) => {
                if(bol){
                    res.status(200).json({
                        message : "user logged  in",
                        user: user[0]
                    })
                }else{
                    res.status(403).json({
                        message : "incorrect credentials"
                    })
                }
            })
       }
       else{
        res.status(404).json({
            message : "User does not exist"
        })
       }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })

}

const getAllUser = (req, res) => {
   userSchema.find()
   .sort({"createdAt" : "desc"})
   .then(data => {
        res.status(200).json({
            message : "users fetched successfully",
            users : data
        })
   })
   .catch(err => {
    res.status(500).json({
        error : err
    })
   })
}

const getUserByEmail = (req, res) => {
    if(req.body.email){
        userSchema.find({"email" : req.body.email})
        .then(data => {
            res.status(200).json({
                message : "users fetched successfully",
                users : data
            })
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })  
    }else{
        res.status(404).json({
            message : "user not found"
        })
    }
}

module.exports = {
    createUser, 
    getAllUser,
    loginUser,
    getUserByEmail,
}