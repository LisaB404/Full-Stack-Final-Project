const express = require("express");
const Note = require("../models/noteModel");
// Middleware for JWT authentication
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// CREATE NOTE
router.post("/notes", authenticateJWT, async (req, res) => {
  try {
    const { title, text, book } = req.body;

    const note = new Note({
      title,
      text,
      book: book || null,
      user: req.userId,
    });

    await note.save();
    res.status(201).json({ message: "Note created", note });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Error while saving the note." });
  }
});

// GET ALL NOTES FOR CURRENT USER
router.get("/notes", authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).populate("book");
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Error fetching notes." });
  }
});

// UPDATE NOTE
router.put("/notes/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, book } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, text, book: book || null },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Error updating note." });
  }
});

// DELETE NOTE
router.delete("/notes/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Error deleting note." });
  }
});

module.exports = router;
