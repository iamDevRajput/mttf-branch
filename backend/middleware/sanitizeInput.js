const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((safe, [key, nestedValue]) => {
      if (key.startsWith("$") || key.includes(".")) {
        return safe;
      }
      safe[key] = sanitizeValue(nestedValue);
      return safe;
    }, {});
  }

  if (typeof value === "string") {
    return value.replace(/\0/g, "").trim();
  }

  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    const sanitizedQuery = sanitizeValue(req.query);
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, sanitizedQuery);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = sanitizeInput;
