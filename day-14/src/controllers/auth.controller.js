const bcrypt = require("bcryptjs");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { email, password, username, bio, profileImage } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message:
        "user already exist" +
        (isUserAlreadyExist.email == email
          ? "email already exist"
          : "username already exist "),
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.jwt_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user registerd successfully",
    user: {
      email: user.email,
      bio: user.bio,
      username: user.username,
      profileImage: user.profileImage,
    },
  });
}

async function loginController(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return res.status(404).json({
      message: "user does not exist",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "password is incorrect",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.jwt_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user loggedIn successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

module.exports = {
  registerController,
  loginController,
};
