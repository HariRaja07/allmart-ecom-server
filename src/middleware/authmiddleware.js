const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  //Read the jwt fromm the cookie

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "fail",
        message: "Not authorized,token failed",
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      message: "Not authorized, no token",
    });
  }
};

// Admin middleware

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(400).json({
      status: "fail",
      message: "Not authorized as admin",
    });
  }
};
