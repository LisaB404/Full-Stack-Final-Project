const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./config");
require("dotenv").config();
const Note = require("./noteModel");

const jwt = require("jsonwebtoken");

const port = 3000;
const app = express();
const SECRET_KEY = process.env.SECRET_KEY;

// CORS to manage frontend requests
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware to parsre JSON and form data
app.use(express.json()); // convert data into json
app.use(express.urlencoded({ extended: false })); // allows access to form data

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Invalid token." });
    }
    req.userId = decoded.id;
    next();
  });
};

// ==========================
// API RESTful Routes
// ==========================

// connect to style.css static path
app.use(express.static("public"));

// SIGNUP ROUTE
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //user if user already exists
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please choose another username.",
      });
    }
    //hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); //10 standard and secure

    //create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    //search user in the database
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    //compare hashed password from database with plain text
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      // Send token and user data
      message: "Login successful",
      token: token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGOUT (Client side: delete token)
app.post("/api/logout", (req, res) => {
  res
    .status(200)
    .json({ message: "Logout successful. Remove token on client side." });
});

// PROTECTED ROUTE (authenticated users)
app.get("/api/protected", authenticateJWT, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

// GET USER DATA
app.get("/api/user", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE TO CHANGE USER DATAS
app.put("/api/user", authenticateJWT, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================
// LIBRARY ROUTES
// ==========================

// ROUTE TO GET THE LIBRARY
app.get("/api/library", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ library: user.library });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE TO ADD BOOKS
app.post("/api/library/add", authenticateJWT, async (req, res) => {
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

// ROUTE TO REMOVE BOOKS
app.post("/api/library/remove", authenticateJWT, async (req, res) => {
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

// ==========================
// NOTES ROUTES
// ==========================
// CREATE NOTE
app.post("/api/notes", authenticateJWT, async (req, res) => {
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
app.get("/api/notes", authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).populate("book");
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Error fetching notes." });
  }
});

// UPDATE NOTE
app.put("/api/notes/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, book } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.userId }, // sicurezza: solo se è la tua nota
      { title, text, book: book || null },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found or not yours." });
    }

    res.json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Error updating note." });
  }
});

// DELETE NOTE
app.delete("/api/notes/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found or not yours." });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Error deleting note." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
