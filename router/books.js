const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {
    addBook,
    loadBooks,
    deleteBook,
    updateBook,
    loadAuthors,
    loadGenres

} = require("../controller/books");

router.post("/add",auth(),addBook);
router.get("/loadBooks",loadBooks);
router.put("/update",auth(),updateBook);
router.delete("/delete/:id",auth(),deleteBook);

router.get("/loadAuthors",loadAuthors);
router.get("/loadGenres",loadGenres);

module.exports = router