const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  imgUrl: {
    type: String,
    required: [true, "imgUrl is required to create Post"],
  },

  users: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "usersId is required to create post"],
  },
});

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
