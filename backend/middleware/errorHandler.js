const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (statusCode >= 500) {
    console.error("Server error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.isOperational || statusCode < 500 ? err.message : "Internal server error.",
    ...(!isProduction && err.details ? { details: err.details } : {}),
  });
};

module.exports = { notFound, errorHandler };
