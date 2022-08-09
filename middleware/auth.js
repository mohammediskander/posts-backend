const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, process.env.JWT_SECRET || "2260507a");
      req.user = await User.findById(verify.id).select("-password");
      next();
      console.log(req.body.isAdmin);
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not aithorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not aithorized and no token");
  }
});

module.exports = { protect };
