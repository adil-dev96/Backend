import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
}

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is requrired")
    .isLength({ min: 3, max: 30 })
    .withMessage("username must be betwee 3 to 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("usernames can only conatains letters,numbers and underscore"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters"),

  validate,
];
