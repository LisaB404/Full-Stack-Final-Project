const express = require("express");
const noteController = require("../controllers/noteController");

// Middleware for JWT authentication
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// CREATE NOTE
router.post("/notes", authenticateJWT, noteController.createNote);

// GET ALL NOTES FOR CURRENT USER
router.get("/notes", authenticateJWT, noteController.getAllNotes);

// UPDATE NOTE
router.put("/notes/:id", authenticateJWT, noteController.updateNote);

// DELETE NOTE
router.delete("/notes/:id", authenticateJWT, noteController.deleteNote);

module.exports = router;