const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}

/**
 * Factory that creates a role-specific auth middleware.
 * Eliminates the 4x duplicated auth logic.
 */
const createAuthMiddleware = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).populate("userType");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!user.userType || user.userType.role !== role) {
      return res.status(403).json({ message: `${role} access only` });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.authAdmin       = createAuthMiddleware("admin");
exports.authSeller      = createAuthMiddleware("seller");
exports.authUser        = createAuthMiddleware("user");
exports.authDeliveryBot = createAuthMiddleware("delivery");
