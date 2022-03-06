const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  }
},{
  timestamps: true
}
);

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      max: 500,
    },
    description: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
      default:"img.png"
    },
    likes: {
      type: Array,
      default: [],
    },
    comments:[CommentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
