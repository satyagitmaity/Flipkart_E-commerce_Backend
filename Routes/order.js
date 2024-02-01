const express = require("express");
const { requireSignin, userMiddleware } = require("../commom-middlewares");
const { addOrder, getOrders, getOrder } = require("../Controllers/order");
const router = express.Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder)

module.exports = router;