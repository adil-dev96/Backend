const postModel = require("../model/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../model/like.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
    folder: "instagram-clone-post",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imageUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  const isValidUser = post.user.toString() == userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "forbidden content",
    });
  }

  return res.status(200).json({
    message: "post fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found ",
    });
  }

  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(200).json({
    message: "post liked successfully",
    like,
  });
}

async function getfeedController(req, res) {
  const user = req.user;
  const posts = await Promise.all(
    (await postModel.find().populate("user").lean()).map(async (post) => {
      
      const isLiked = await likeModel.findOne({user:user.username,post:post._id})
      
      post.isLiked = !!isLiked
      return post

    }),
  );

  res.status(200).json({
    message: "post fetched successfully",
    posts,
  });
}
module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getfeedController,
};
