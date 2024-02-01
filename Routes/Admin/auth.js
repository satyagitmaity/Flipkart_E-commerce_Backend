const express = require("express");
const { registerAdmin, loginAdmin, signout } = require("../../Controllers/Admin/auth");
const { validateSignupRequest, isResultValidated, validateSigninRequest } = require("../../Validators/auth");
const { requireSignin } = require("../../commom-middlewares");


const router = express.Router();
router.post("/admin/signup", validateSignupRequest, isResultValidated, registerAdmin);
router.post("/admin/signin", validateSigninRequest, isResultValidated, loginAdmin);
router.post("/admin/signout", requireSignin, signout);

module.exports = router