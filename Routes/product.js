const express = require("express");

const {
  requireSignin,
  adminMiddleware,
  upload,
} = require("../commom-middlewares");
const {
  createProduct,
  getProductsBySlug,
  getProducDetailsById,
  deleteProductById,
  getProducts,
} = require("../Controllers/product");
const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);
router.get("/product/getProducts", requireSignin, adminMiddleware, getProducts)
router.get("/product/:slug", getProductsBySlug);
router.get("/product/:id", getProducDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);

module.exports = router;
