const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please add a description"],
      max: 200,
    },
    postImage: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
