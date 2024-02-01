const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator")

const generatejwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//@desc     Signup a new user
//@route    POST/api/signup
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  //Checking if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists with this email...");
  }
  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    username: shortid.generate(),
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: shortid.generate(),
    });
  } else {
    res.status(400)
    throw new Error("Invalid user data");
  }
});
//@desc     Login an user
//@route    POST/api/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password) &&
  user.role === "user") {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role : user.role,
      token : generatejwtToken(user._id, user.role)
    })
  } else {
    res.status(400)
    throw new Error("Mismatched Credentials or Something went wrong")
  }
})

module.exports = {
  registerUser,
  loginUser
};
