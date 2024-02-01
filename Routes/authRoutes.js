const express = require("express");
const { registerUser, loginUser } = require("../Controllers/authController");

const { validateSignupRequest, isResultValidated, validateSigninRequest } = require("../Validators/auth");
const { requireSignin } = require("../commom-middlewares");

const router = express.Router();
router.post("/signup", validateSignupRequest, isResultValidated, registerUser);
router.post("/signin", validateSigninRequest, isResultValidated, loginUser);


module.exports = router;
