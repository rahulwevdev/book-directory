const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    addProduct,
    loadById,
    loadBySlug,
    loadProducts
} = require("../controller/product");
const {auth} = require("../middleware/auth")

router.post("/add-product",auth("admin"),addProduct);

router.get("/load-product-by-id/:id",auth("admin"),loadById);

router.get("/load-product-by-slug/:slug",loadBySlug);

router.get("/load-products",loadProducts);


module.exports = router;