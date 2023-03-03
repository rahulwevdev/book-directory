const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    loadUsers
} = require("../controller/admin");
const {auth} = require("../middleware/auth")

router.get("/load-users",loadUsers)


module.exports = router;