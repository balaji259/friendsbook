const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Academic Club", "Sports Team", "Student Organization"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String, // Store the file path or URL
    },
    coverPhoto: {
      type: String, // Store the file path or URL
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPosts",
      },
    ],
    postCount: {
      type: Number,
      default: 0,
    },    
    privacy: {
      type: String,
      enum: ["public", "college", "members"],
      default: "public",
    },
    joinMethod: {
      type: String,
      enum: ["anyone", "approval", "invitation"],
      default: "anyone",
    },
    permissions: {
      allowPosts: { type: Boolean, default: true },
      allowComments: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, 
  }
);

const Community = mongoose.model("Community", CommunitySchema);
module.exports = Community;
