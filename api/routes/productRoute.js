const express = require("express")
const route = express.Router()
const productController = require("../controllers/productController")
const multer = require("multer")
const path = require('path')


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

route.get("/", productController.getAllProduct)
route.post("/create", productController.createproduct)
route.post("/show", productController.show)
route.post("/delete", productController.deleteProduct)
route.get("/search-product", productController.searchProduct)
route.post("/vendor-product", productController.getProductByOwner)

module.exports = route