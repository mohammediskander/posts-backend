const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

// get all users
// Public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Can't find users");
  }
});

// Create / Rigester new user
// Public
const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  // required fields !!
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }
  // Check if user already exists !!
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("username already exists");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const newUser = await User.create({
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token: generateToken(newUser._id),
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error("Invalid user data!!");
  }

  // Hash password
});

// Login user
// Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  const validPassword = await bcrypt.compare(password, user.password);

  if (user && validPassword) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials!!");
  }
});

// Get single user
// Public
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(500);
      throw new Error("User not found with this ID!!");
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500);
    throw new Error("User not found with this ID!!");
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const usernameExists = await User.findOne({
    username:
      username ||
      username.capitalize() ||
      username.toLowerCase() ||
      username.toUpperCase(),
  });
  if (usernameExists) {
    res.status(400);
    throw new Error(`Username ${username} already exists`);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: username,
      },
      { new: true }
    );
    if (user) {
      res.status(200).json({
        _id: user._id,
        username: username,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error("somthing is wrong");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    await Post.deleteMany({ userID: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted seccesfully" });
  } catch (err) {
    res.status(400);
    throw new Error("somthing is wrong");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
};
