const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    addBrand,
    deleteBrand,
    loadBrand,
    updateBrand
} = require("../controller/brand");
const {auth} = require("../middleware/auth");

router.post("/add-brand",auth("admin"),addBrand);

router.get("/load-brand",loadBrand);

router.patch("/update-brand",auth("admin"),updateBrand);

router.delete("/delete-brand",auth("admin"),deleteBrand);


module.exports = router;