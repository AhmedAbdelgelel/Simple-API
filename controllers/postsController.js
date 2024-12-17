const { createPostSchema } = require("../middlewares/validator");
const Post = require("../models/postsModel");
exports.getAllPosts = async (req, res) => {
  const { page } = req.query;
  const postsPerPage = 10;
  try {
    let pageNum = 0;
    if (page <= 1) {
      pageNum = 0;
    } else {
      pageNum = page - 1;
    }
    const result = await Post.find()
      .sort({ createdAt: -1 })
      .skip(pageNum * postsPerPage)
      .limit(postsPerPage)
      .populate({ path: "userId", select: "email" });
    res.status(200).json({
      success: true,
      message: "Posts",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user;
  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const result = await Post.create({
      title,
      description,
      userId,
    });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await Post.findById(id).populate({
      path: "userId",
      select: "email",
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      existingPost,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const { userId } = req.user;
  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });
    if (error) {
      return res.status(404).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingPost = await Post.findByIdAndUpdate(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post unavailable" });
    }
    res.status(201).json({
      success: true,
      message: "Post updated successfully",
      data: existingPost,
    });
  } catch (error) {
    console.error(error);
  }
};
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const existingPost = await Post.findByIdAndDelete(id);
  if (!existingPost) {
    return res.status(404).json({
      success: false,
      message: "Post is not existing",
    });
  }
  if (existingPost.userId.toString() !== userId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
  res.status(200).json({
    success: true,
  });
};
