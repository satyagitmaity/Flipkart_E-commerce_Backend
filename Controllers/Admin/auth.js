const User = require("../../Models/userModel");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const generatejwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//@desc     Register a new Admin
//@route    POST/api/admin/signup
//@access   Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  //Checking if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Admin already exists with this email...");
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
    role: "admin",
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: shortid.generate(),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
//@desc     Login an admin
//@route    POST/api/admin/signin
//@access   Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (
    user &&
    (await bcrypt.compare(password, user.password)) &&
    user.role === "admin"
  ) {
    const token = generatejwtToken(user._id, user.role);
    res.cookie("token", token, {expiresIn : "1d"})
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token:token
    });
  } else {
    res.status(400);
    throw new Error("Mismatched Credentials or you are not an admin");
  }
});
//@desc     Logout an admin
//@route    POST/api/admin/signout
//@access   Admin
const signout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message : "Signout successfully..."
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  registerAdmin,
  loginAdmin,
  signout
};
