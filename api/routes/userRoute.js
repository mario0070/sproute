const express = require("express")
const route = express.Router()
const userController = require("../controllers/userController")

route.get("/", userController.getAllUser)
route.post("/signup", userController.createUser)
route.post("/login", userController.loginUser)
route.post("/get-user", userController.getUserByEmail)

module.exports = route