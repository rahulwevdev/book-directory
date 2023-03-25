const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {register,verifyEmail,forgotPassword,login,logout,resetPassword} = require("../controller/authentication")
const {auth} = require("../middleware/auth")


router.post("/register",register);


router.post("/login",login);

router.get("/logout",auth(),logout);



module.exports = router