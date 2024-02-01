const express = require("express");
const { requireSignin, userMiddleware } = require("../commom-middlewares");
const { addAddress, getAddress } = require("../Controllers/address");
const router = express.Router();

router.post("/user/address/create", requireSignin, userMiddleware, addAddress);
router.get("/user/address/getAddress", requireSignin, userMiddleware, getAddress)

module.exports = router;