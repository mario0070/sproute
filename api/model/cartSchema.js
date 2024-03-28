const mongoose = require("mongoose")

const schema = mongoose.Schema

const CartsSchema = new schema({
    carts : {type : Array, required : true},
    user : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumeUser"},
},{timestamps : true})

module.exports = mongoose.model("Carts", CartsSchema)