import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmails } from "../services/mail.service.js";

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

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmails({
    to: email,
    subject: "Welcome to Perplexity",
    html: `
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We are excited to have you on a board!</p>
        <p>please varify your email address by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email </a>
        <p>If you didnt create an account,please ignore this email</p>
        <p>Best Regards,<br>The Perplexity Team</p>

       
        `,
  });

  res.status(201).json({
    message: "user registered successfully",
    sucess: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user =await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "invalid username and password",
      success: false,
      err: "user not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "invalid email and password",
      success: false,
      err: "incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "please verify your email before logging in",
      success: false,
      err: "email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "loggedIn successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


export async function getMe(req,res) {
    const userId = req.user.id
    
    const user = await userModel.findById(userId).select('-password')

    if(!user){
        return res.status(404).json({
            message:'user not found',
            success:false,
            err:"user not found"
        })
    }

    res.status(200).json({
        message:"user details fetched successfully",
        success:true,
        user
    })
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "invalid token",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `
  <h1>Email Verified Successfully</h1>
  <p>Your email has been verified.You can now login in your account</p>
  <a href="http://localhost:3000/login">Go to Login </a>
  `;

    return res.send(html);
  } catch (error) {
    return res.status(400).json({
      message: "invalid or expired token",
      success: false,
      err: error.message,
    });
  }
}
