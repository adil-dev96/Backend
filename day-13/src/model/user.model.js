const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already exist"],
    required: [true, "username is required"],
  },
  email: {
    type: String,
    unique: [true, "email already exist"],
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  bio: {
    type: String,
  },
  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/lg0khbxcq/default.avif",
  },
});




const userModel = mongoose.model ('users', userSchema)

module.exports = userModel