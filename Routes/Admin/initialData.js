const express = require("express");
const { initialData } = require("../../Controllers/Admin/initialdata");
const { requireSignin, adminMiddleware } = require("../../commom-middlewares");
const router = express.Router();

router.get("/initialdata", requireSignin, adminMiddleware, initialData);
module.exports = router;
