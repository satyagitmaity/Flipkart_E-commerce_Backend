const { check, validationResult } = require("express-validator");
const validateSignupRequest = [
  check("firstName").notEmpty().withMessage("First name is required."),
  check("lastName").notEmpty().withMessage("Last name is required."),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must be atleast 4 characters long"),
];

const validateSigninRequest = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must be atleast 4 characters long"),
];

//Validation middleware
const isResultValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  validateSignupRequest,
  isResultValidated,
  validateSigninRequest,
};
