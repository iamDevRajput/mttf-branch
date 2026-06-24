const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const requireAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new AppError(401, "Admin access required.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      throw new AppError(403, "Not authorized.");
    }

    req.admin = decoded;
    next();
  } catch (error) {
    next(error.isOperational ? error : new AppError(401, "Invalid admin token."));
  }
};

module.exports = { requireAdmin };
