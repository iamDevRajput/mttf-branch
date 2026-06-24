const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new AppError(401, "Authentication required.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError(401, "Token is not valid.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.isOperational ? error : new AppError(401, "Token is not valid."));
  }
};

module.exports = { requireAuth };
