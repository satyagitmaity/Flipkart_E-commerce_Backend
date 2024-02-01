const express = require("express");
const { addItemToCart, getCartItems, removeCartItems } = require("../Controllers/cart");
const { requireSignin, userMiddleware } = require("../commom-middlewares");
const router = express.Router();

router.post("/user/cart/addtocart", requireSignin, userMiddleware, addItemToCart);
router.get("/user/cart/getCart", requireSignin,userMiddleware, getCartItems);
router.post("/user/cart/removeItem", requireSignin, userMiddleware, removeCartItems)
module.exports = router