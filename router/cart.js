const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    addCart,
    removeFromCart,
    updateCart,
    loadCart
} = require("../controller/cart");
const {auth} = require("../middleware/auth")

router.post("/add-cart",auth("customer"),addCart);

router.get("/load-cart",auth("customer"),loadCart)

router.patch("/update-cart",auth("customer"),updateCart);

router.patch("/remove-cart",auth("customer"),removeFromCart);


module.exports = router;