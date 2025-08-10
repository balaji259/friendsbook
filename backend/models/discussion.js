const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  communityId: {
    type: String,
    required: true,
  },
  userId: String,
  userName: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Discussion", discussionSchema);
