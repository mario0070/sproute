const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema({
    firstname : {type : String, default : null},
    lastname : {type : String, default : null},
    email : {type : String, required : true},
    password : {type : String, required : true},
    phone : {type : Number, default : null}
},{timestamps : true})

module.exports = mongoose.model("PerfumeUser", userSchema)