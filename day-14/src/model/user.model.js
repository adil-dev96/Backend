const mongoose = require("mongoose");
const { type } = require("node:os");

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
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/lg0khbxcq/default.avif?updatedAt=1771483603375",
  },
});


const userModel = mongoose.model('users' , userSchema)

module.exports = userModel 