const express = require("express");
const {
  getAllPosts,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.get("/all-posts", getAllPosts);
router.get("/single-post/:id", getSinglePost);
router.post("/create-post", identifier, createPost);
router.put("/update-post/:id", identifier, updatePost);
router.delete("/delete-post/:id", identifier, deletePost);
module.exports = router;
