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

  const EmailVarificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "welcome to perplexity",
    html: `<p>Hi ${username}, </p>
    <p>Thank you for registering at <strong>Perplexity</strong>.We are exited to have you on a board</p>
    <p>Please verify the Email by clicking the Link Below!! </p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${EmailVarificationToken}">Verify Email </a>
    <p>Best regards,<br>The Perplexity Team</p>`,
  });

  return res.status(201).json({
    message: "User registered. Verification email sent.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or Password",
      success: false,
      err: "user not found ",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify the email before logging in",
      success: false,
      err: "Email not Verified",
    });
  }

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "invalid password",
      success: false,
      err: "incorrect password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "Login Successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(401).json({
      message: "user not found",
      success: false,
      err: "user not found",
    });
  }

  res.status(200).json({
    message:"user details fetched successfully",
    success:true,
    user
  })
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `

  <h1>Email Verification Successfully </h1>
  <p>YOur emai is verified now you can login to the server </p>
  <a href="http://localhost:3000/login">Go to the login </a>
   `;

    return res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}
