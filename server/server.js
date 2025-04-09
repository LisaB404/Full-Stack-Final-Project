const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config"); // connessione al DB

const app = express();
const port = process.env.PORT || 3000;

// Middleware for CORS to manage frontend requests
const allowedOrigins = [
  "https://wonderlandofbooks.netlify.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware to parse JSON and form data
app.use(express.json()); // convert data into json
app.use(express.urlencoded({ extended: false })); // allows access to form data
app.use(express.static("public"));

// Middleware for JWT authentication
const authenticateJWT = require("./middleware/authenticateJWT");

// Import routes
const userRoutes = require("./routes/userRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const notesRoutes = require("./routes/noteRoutes");

// Use routes with /api
app.use("/api", userRoutes);
app.use("/api", libraryRoutes);
app.use("/api", notesRoutes);

// Protected Route
app.get(
  "/api/protected",
  require("./middleware/authenticateJWT"),
  (req, res) => {
    res.json({ message: "Protected data", user: req.userId });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
