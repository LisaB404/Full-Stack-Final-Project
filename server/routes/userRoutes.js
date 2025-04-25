const express = require("express");
const userController = require("../controllers/userController");

// Middleware for JWT authentication
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// SIGNUP ROUTE
router.post("/signup", userController.signup);

// LOGIN ROUTE
router.post("/login", userController.login);

// LOGOUT
router.post("/logout", userController.logout);

// GET USER DATA
router.get("/user", authenticateJWT, userController.getUser);

// UPDATE USER DATA
router.put("/user", authenticateJWT, userController.updateUser);

module.exports = router;
