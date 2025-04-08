const express = require("express");
const User = require("../models/userModel");

// Middleware for JWT authentication
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// GET LIBRARY
router.get("/library", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ library: user.library });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ADD BOOK TO LIBRARY
router.post("/library/add", authenticateJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const { book } = req.body;
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Check if book is already in the library
    if (user.library.find((b) => b.id === book.id)) {
      return res.status(400).json({ message: "Book already in library" });
    }
    // Add book to library
    user.library.push(book);
    await user.save();
    res
      .status(200)
      .json({ message: "Book added successfully", library: user.library });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// REMOVE BOOK FROM LIBRARY
router.post("/library/remove", authenticateJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookTitle } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out book to remove
    user.library = user.library.filter((book) => book.id !== bookTitle);
    await user.save();

    res
      .status(200)
      .json({ message: "Book removed successfully", library: user.library });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
