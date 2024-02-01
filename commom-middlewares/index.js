const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

//Multer middleware
// const upload = multer({ dest: "uploads/" })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    res.status(400).json({ message: "Authorization required" });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    throw new Error("User access denied...");
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new Error("Admin access denied...");
  }
  next();
};

module.exports = {
  requireSignin,
  adminMiddleware,
  userMiddleware,
  upload,
};
