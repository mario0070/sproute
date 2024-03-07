const mongoose = require("mongoose")

const schema = mongoose.Schema

const productSchema = new schema({
    name : {type : String, required : true},
    price : {type : String, required : true},
    image : {type : String, default : null},
    description : {type : String, required : true},
    category : {type : String, required : true},
    capacity : {type : String, required : true},
    isAvaialble : {type : Boolean, default : true},
    owner : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumeUser"},
},{timestamps : true})

module.exports = mongoose.model("PerfumesProduct", productSchema)