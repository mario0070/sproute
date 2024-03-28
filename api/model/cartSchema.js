const mongoose = require("mongoose")

const schema = mongoose.Schema

const CartsSchema = new schema({
    carts : {type : String, required : true},
    quantity : {type : String, defualt : "1"},
    user : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumeUser"},
},{timestamps : true})

module.exports = mongoose.model("Carts", CartsSchema)