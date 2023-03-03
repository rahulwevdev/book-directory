const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const {
    addCategory,
    deleteCategory,
    loadCategory,
    updateCategory
} = require("../controller/category");
const {auth} = require("../middleware/auth");

router.post("/add-category",auth("admin"),addCategory);

router.get("/load-category",loadCategory);

router.patch("/update-category",auth("admin"),updateCategory);

router.delete("/delete-category",auth("admin"),deleteCategory);


module.exports = router;