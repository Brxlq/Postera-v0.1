module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) return res.status(409).json({ error: "duplicate key" });

  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "validation error", details: err.message });
  }

  res.status(500).json({ error: "server error" });
};
