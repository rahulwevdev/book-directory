const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    addProduct,
    loadById,
    loadBySlug,
    loadProducts,
    uploadImages
} = require("../controller/product");
const {auth} = require("../middleware/auth")
const multer = require("multer");
const path = require("path")

const fileStorage = multer.diskStorage({
    destination:"public/images",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now())+
        path.extname(file.originalname)
    }
})

const uploadImage = multer({
    storage:fileStorage
})

router.post("/add-product",auth("admin"),addProduct);

router.post("/upload-product-images",uploadImage.array('image',4),auth("customer"),uploadImages);

router.get("/load-product-by-id/:id",auth("admin"),loadById);

router.get("/load-product-by-slug/:slug",loadBySlug);

router.get("/load-products",loadProducts);


module.exports = router;