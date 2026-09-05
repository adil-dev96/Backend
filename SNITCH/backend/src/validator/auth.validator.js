import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

export const validateRegisterUser = [
  body("email").isEmail().withMessage("invalid email address"),
  body("contact")
    .notEmpty()
    .withMessage("contact is required")
    .matches(/^\d{10}$/)
    .withMessage("contact must be 10-digit number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 character long"),
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 character long"),
  body("isSeller").isBoolean().withMessage("isSeller must bea boolean value"),

  validateRequest,
];


export const validateLoginUser = [
        body("email").isEmail().withMessage("invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
        validateRequest
]