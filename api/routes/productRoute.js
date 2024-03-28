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
route.post("/search-product", productController.searchProduct)
route.post("/vendor-product", productController.getProductByOwner)
route.post("/category", productController.productByCateory)
route.post("/carts", productController.storeSession)
route.post("/getcarts", productController.getSession)
route.post("/delete-carts", productController.deleteSingleCart)

module.exports = route