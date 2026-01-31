const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Security note: for real apps you wouldn't allow role setting from public input.
    // For coursework, this makes creating an admin easy.
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      role: role === "admin" ? "admin" : "user"
    });

    const token = signToken(user);

    res.status(201).json({
      message: "registered",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = signToken(user);

    res.json({
      message: "logged in",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};
