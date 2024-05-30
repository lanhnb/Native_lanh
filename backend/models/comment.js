const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(

  {
    namec: { type: String, required:false },
    emailorPhone: { type: String, required: false },
    comment:{type: String, required: false },
    isCall: { type: Boolean, default: false },
    rate:{type:Number, default:false},

    },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
