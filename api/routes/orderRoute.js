const express = require("express")
const route = express.Router()
const orderController = require("../controllers/orderController")

route.post("/create", orderController.createOrder)
route.get("/", orderController.getAllOrder)
route.post("/orderby", orderController.getOrderByOrderBy)
route.post("/cancel", orderController.cancelOrder)
route.post("/vendor", orderController.getOrderByVendor)

module.exports = route