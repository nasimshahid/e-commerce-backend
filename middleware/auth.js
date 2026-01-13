const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UserType = require("../models/userType");

exports.authAdmin = async (req, res, next) => {
  try {
       const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });


//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Token required" });
//     }

//     const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "arbab");

    const user = await User.findById(decoded.userId)
      .populate("userType"); // ⭐ KEY LINE
console.log(user,"/////////////////")
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

 

    // ✅ NOW THIS WORKS
    if (!user.userType || user.userType.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};





exports.authSeller= async (req, res, next) => {
  try {
       const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });


//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Token required" });
//     }

//     const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "arbab");

    const user = await User.findById(decoded.userId)
      .populate("userType"); // ⭐ KEY LINE
console.log(user,"/////////////////")
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

 

    // ✅ NOW THIS WORKS
    if (!user.userType || user.userType.role !== "seller") {
      return res.status(403).json({ message: "Seller access only" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
