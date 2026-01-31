module.exports = function admin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "admin only" });
  next();
};
