const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    createOrder,
    loadById,
    updateOrder,
    loadOrders
    
} = require("../controller/order");
const {auth} = require("../middleware/auth")

router.post("/create-order",auth("customer"),createOrder);

router.get("/load-order-by-id/:id",auth("customer","admin"),loadById)

router.patch("/update-order",auth("admin"),updateOrder);

router.post("/load-orders",auth("customer","admin"),loadOrders);


module.exports = router;