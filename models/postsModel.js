const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title id required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description id required!"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
