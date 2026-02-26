const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "post id is required to create a like "],
    },
    user: {
      type: String,
      required: [true, "username is required to create a like"],
    },
  },
  {
    timeseries: true,
  },
);

likeSchema.index({post:1, user:1}, {uniqure:true})

const likeModel = mongoose.model('likes', likeSchema)

module.exports = likeModel