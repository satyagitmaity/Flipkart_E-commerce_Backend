const express = require("express");
const shortid = require("shortid");
const multer = require("multer");
const path = require("path");
const { addCategory, getCategories, updateCategories, deleteCategory } = require("../Controllers/category");
const { requireSignin, adminMiddleware } = require("../commom-middlewares");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, (path.join(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({storage : storage})

router.post("/category/create", requireSignin, adminMiddleware, upload.single("categoryImage"), addCategory);
router.get("/category/getcategory", getCategories);
router.post("/category/update", requireSignin, adminMiddleware, upload.array("categoryImage"), updateCategories)
router.post("/category/delete", deleteCategory)
module.exports = router;
