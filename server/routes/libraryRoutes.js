const express = require("express");
const libraryController = require("../controllers/libraryController");

// Middleware for JWT authentication
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// GET LIBRARY
router.get("/library", authenticateJWT, libraryController.getLibrary);

// ADD BOOK TO LIBRARY
router.post("/library/add", authenticateJWT, libraryController.addBookToLibrary);

// REMOVE BOOK FROM LIBRARY
router.post("/library/remove", authenticateJWT, libraryController.removeBookFromLibrary);

module.exports = router;
