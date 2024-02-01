const express = require("express");
const { upload, requireSignin, adminMiddleware } = require("../commom-middlewares");
const { createPage, getPage } = require("../Controllers/page");
const router = express.Router();

router.post("/page/create", requireSignin, adminMiddleware, upload.fields([
    { name: "banners", maxCount: 5 },
    { name: "products", maxCount: 5 }
]), createPage);
router.get("/page/getPage/:category/:type", getPage)
module.exports = router;