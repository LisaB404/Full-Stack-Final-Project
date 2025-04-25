const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blackListToken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  try {
    // 1) Check blacklist
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token invalidated (logout)." });
    }

    // 2) Check token and expiration
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authenticateJWT;
