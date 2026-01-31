const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("_id email role");

    if (!user) return res.status(401).json({ error: "user not found" });

    req.user = user; // { _id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
};
