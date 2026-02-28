const userModel = require("../model/user.model");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");




async function registerController (req, res)  {
  const { username, profileImage, bio, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message:
        "user already exist " +
        (isUserAlreadyExist.email == email
          ? "email already exist"
          : "username already exist"),
    });
  }

  const hash =await bcrypt.hash(password,10)

  const user = await userModel.create({
    username,
    email,
    password: hash,
    bio,
    profileImage,
  });

  const token = jwt.sign(
    {
      user: user._id,
      username:user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user Registered successfully",
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}


async function loginController (req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  }).select('+password')

  if(!user){
    return res.status(404).json({
        message:'user not found'
    })
  }



  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(401).json({
        message:"invalid password"
    })
  }

  const token = jwt.sign({
    id:user._id,
    username:user.username
  },process.env.JWT_SECRET,{expiresIn:'1d'})

  res.cookie('token', token)

  res.status(200).json({
    message:"user loggedin successfully",
    user:{
        username:user.username,
        bio:user.bio,
        profileImage:user.profileImage,
        email:user.email
    }
})

}

async function getMeController(req,res) {
  const userId = req.user.id
  const user = await userModel.findById(userId)

  res.status(200).json({
    user:{
      username:user.username,
      email:user.email,
      bio:user.bio,
      profileImage:user.profileImage
    }
  })
}

module.exports={
    registerController,
    loginController,
    getMeController
}