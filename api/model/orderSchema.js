const mongoose = require("mongoose")

const schema = mongoose.Schema

const orderSchema = new schema({
    orderBy : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumeUser"},
    status : {type : String , default : "active"},
    owner : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumeUser"},
    product : {type : mongoose.SchemaTypes.ObjectId, required : true, ref : "PerfumesProduct"},
},{timestamps : true})

module.exports = mongoose.model("PerfumesOrder", orderSchema)