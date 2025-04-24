const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/userModel");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// SIGNUP ROUTE
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // check for valid email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    // check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please choose another username.",
      });
    }
    //hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN ROUTE
const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    //search user in the database
    const user = await User.findOne({ name });
    if (!user) return res.status(404).send("User does not exist");
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
      //send token and user data
      message: "Login successful",
      token: token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGOUT
const logout = (req, res) => {
  res
    .status(200)
    .json({ message: "Logout successful. Remove token on client side." });
};

// GET USER DATA
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE USER DATA
const updateUser = async (req, res) => {
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
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({
      message: "User updated successfully",
      user: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, getUser, updateUser };
