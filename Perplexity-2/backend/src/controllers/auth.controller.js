import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "user with this email or username is already exist",
      success: false,
      err: "user already exist",
    });
  }

  const user = await userModel.create({ username, email, password });

  await sendEmail({
    to: email,
    subject: "welcome to perplexity",
    html: `<p>Hi ${username}, </p>
    <p>Thank you for registering at <strong>Perplexity</strong>.We are exited to have you on a board</p>
    <p>Best regards,<br>The Perplexity Team</p>`,
  });
}
