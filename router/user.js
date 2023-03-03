
const express = require("express");
const { request, response } = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {loadProfile,updateProfile,addAddress} = require("../controller/user");

router.get("/load-profile",auth("customer"), loadProfile);

router.post("/update-profile",auth("customer"),updateProfile);

router.post("/add-address",auth("customer"),addAddress);



module.exports = router;