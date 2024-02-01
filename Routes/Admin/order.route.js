const express = require("express");
const { requireSignin, adminMiddleware } = require("../../commom-middlewares");
const { updateOrder, getCustomersOrders } = require("../../Controllers/Admin/order");


const router = express.Router();
router.post("/order/update", requireSignin, adminMiddleware, updateOrder);
router.get("/order/getCustomersOrders", requireSignin, adminMiddleware, getCustomersOrders)

module.exports = router;