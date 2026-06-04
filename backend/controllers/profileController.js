const User = require('../models/users');
const multer = require('multer'); 
const mongoose = require('mongoose');
const formidable=require('formidable');
const cloudinary = require('../cloudinaryConfig');
const { Post, Comment } = require('../models/post');
const SavedPost=require("../models/savedPost");
const { evaluateStreak } = require('../utils/streakUtils');

const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage });

// Helper: escape special regex characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getMyDetails = async(req,res) =>{
    try {
        let user = await User.findById(req.user.id).select('-password').populate({
          path: 'bestFriend',   
          select: 'username',   
        });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Lazy evaluation of streak
        user = await evaluateStreak(user);

        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
}

const updateProfile = async(req,res) => {
    // BUG FIX #1: was req.user.userId — auth middleware sets req.user.id
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ error: "No user found!" });
    }
  
    const form = new formidable.IncomingForm();
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(400).json({ error: 'Failed to parse form data' });
      }
  
      try {
        let profilePicUrl;
  
        if (files.profilePic && files.profilePic.length > 0) {
          const filePath = files.profilePic[0].filepath;
          const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'profile_pics',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          });
          profilePicUrl = uploadResult.secure_url;
        } else {
          profilePicUrl = currentUser.profilePic;
        }
  
        const updateData = {
          profilePic: profilePicUrl,
          mobileNumber: fields.mobile?.[0] == "undefined" ? currentUser.mobileNumber : fields.mobile?.[0],
          website: fields.website?.[0] == "undefined" ? currentUser.website : fields.website?.[0],
          fullname: fields.fullname?.[0] == "undefined" ? currentUser.fullname : fields.fullname?.[0],
          school: fields.school?.[0] == "undefined" ? currentUser.school : fields.school?.[0],
          status: fields.status?.[0] == "undefined" ? currentUser.status : fields.status?.[0],
          gender: fields.gender?.[0] == "undefined" ? currentUser.gender : fields.gender?.[0],
          residence: fields.residence?.[0] == "undefined" ? currentUser.residence : fields.residence?.[0],
          hometown: fields.hometown?.[0] == "undefined" ? currentUser.hometown : fields.hometown?.[0],
          highschool: fields.highschool?.[0] == "undefined" ? currentUser.highschool : fields.highschool?.[0],
          lookingfor: fields.lookingfor?.[0] == "undefined" ? currentUser.lookingfor : fields.lookingfor?.[0],
          interestedIn: fields.interestedIn?.[0] == "undefined" ? currentUser.interestedIn : fields.interestedIn?.[0],
          // FIX: key must match the schema field name exactly (camelCase) — Mongoose strict mode
          // silently ignores keys that don't match the schema, so "relationshipstatus" was dropped
          relationshipStatus: fields.relationshipstatus?.[0] == "undefined" ? currentUser.relationshipStatus : fields.relationshipstatus?.[0],
          bestFriend: fields.bestfriend ? JSON.parse(fields.bestfriend[0]) : currentUser.bestFriend,
          collegeName: fields.collegename?.[0] == "undefined" ? currentUser.collegeName : fields.collegename?.[0],
          interests: fields.interests?.[0] == "undefined" ? currentUser.interests : fields.interests?.[0],
          favoriteSport: fields.sport?.[0] == "undefined" ? currentUser.favoriteSport : fields.sport?.[0],
          favoriteGame: fields.game?.[0] == "undefined" ? currentUser.favoriteGame : fields.game?.[0],
          favoriteMusic: fields.music?.[0] == "undefined" ? currentUser.favoriteMusic : fields.music?.[0],
          favoriteMovie: fields.movie?.[0] == "undefined" ? currentUser.favoriteMovie : fields.movie?.[0],
          favoriteAnime: fields.anime?.[0] == "undefined" ? currentUser.favoriteAnime : fields.anime?.[0],
          favoriteActor: fields.actor?.[0] == "undefined" ? currentUser.favoriteActor : fields.actor?.[0],
          bio: fields.bio?.[0] == "undefined" ? currentUser.bio : fields.bio?.[0],
        };

        function isValidDate(date) {
          return date instanceof Date && !isNaN(date);
        }

        // FIX: fields.dateOfBirth is an array from formidable — use [0] to get the string
        const dobRaw = fields.dateOfBirth?.[0];
        if (dobRaw && dobRaw !== "undefined") {
          const parsedDate = new Date(dobRaw);
          updateData.dateOfBirth = isValidDate(parsedDate) ? parsedDate : currentUser.dateOfBirth;
        } else {
          updateData.dateOfBirth = currentUser.dateOfBirth;
        }
  
        // BUG FIX #1: was req.user.userId — auth middleware sets req.user.id
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        res.json({ message: 'Profile updated successfully', updatedUser });

      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
      }
    });
}

const searchUsers = async (req, res) => {
  try {
      const { username } = req.query;
      if (!username) return res.json([]);
      // BUG FIX #8: sanitize regex to prevent ReDoS
      const safeUsername = escapeRegex(username.trim());
      const users = await User.find({ username: { $regex: safeUsername, $options: 'i' } })
        .select('username profilePic fullname')
        .limit(5);
      res.json(users.length ? users : []);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserPosts = async(req,res) =>{
    const userId = req.params.userId;

  try {
      const posts = await Post.find({ user: userId })
          .select('postType caption content') 
          .populate('user', 'username profilePic')  
          .exec();

      res.status(200).json({ posts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching posts' });
  }
}

const getSavedPosts = async(req,res) =>{
    try {
    const { userId } = req.params;

    const savedPosts = await SavedPost.find({ userId })
      .populate({
        path: 'postId', 
        model: Post,
        select: 'postType caption content', 
        populate: {
          path: 'user', 
          model: User,
          select: 'username profilePic', 
        },
      })
      .exec();

    res.json(savedPosts);
  } catch (error) {
    console.error('Error fetching saved posts with details:', error);
    res.status(500).json({ error: 'Failed to fetch saved posts with details' });
  }
}

const getLikedPosts = async(req,res) =>{
    try {
          const { userId } = req.params;
          const likedPosts = await Post.find({ likes: userId })
              .select('user mediaType caption content mediaUrl postType')
              .populate('user', 'username profilePic'); 
          res.json(likedPosts);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
      }
}

const deleteSavedPost = async(req,res) =>{
    try {
        const { postId } = req.params;
        const deletedPost = await SavedPost.findByIdAndDelete(postId);
        if (!deletedPost) {
          return res.status(404).json({ error: "Post not found" });
        }
        res.json({ message: "Post deleted successfully" });
      } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ error: "Failed to delete post" });
      }
}

const checkConnection = async(req,res) =>{
    const { userId, friendId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isFriend = user.friends.some(id => id.toString() === friendId);
      if (isFriend) {
        return res.status(200).json({ connection: true, message: 'You have a connection with this user' });
      } else {
        return res.status(200).json({ connection: false, message: 'You do not have a connection with this user' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
}

const getMutualFriends = async(req,res) =>{
    try {
        const { userId1, userId2 } = req.params;
    
        const user1 = await User.findById(userId1).populate('friends', '_id');
        const user2 = await User.findById(userId2).populate('friends', '_id');
    
        if (!user1 || !user2) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // BUG FIX #10: convert ObjectIds to strings before comparing
        const user2FriendIds = new Set(user2.friends.map(f => f._id.toString()));
        const mutualFriends = user1.friends.filter(friend =>
          user2FriendIds.has(friend._id.toString())
        );
    
        res.json({ mutualFriendsCount: mutualFriends.length });
      } catch (error) {
        console.error('Error fetching mutual friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const isFollowing = async(req,res) =>{
    const { userId } = req.params;
    const { currentUserId } = req.params;
  
    try {
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found" });
      }
      const followingStatus = currentUser.following.some(id => id.toString() === userId);
      res.json({ isFollowing: followingStatus });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ message: "Server error" });
    }
}

const follow = async(req,res) =>{
    const { userId } = req.params;
    const { currentUserId } = req.params;
  
    try {
      const currentUser = await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { following: userId } },
        { new: true }
      );
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found" });
      }
      const targetUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { followers: currentUserId } },
        { new: true }
      );
      if (!targetUser) {
        return res.status(404).json({ message: "User to follow not found" });
      }
      if (targetUser.following.some(id => id.toString() === currentUserId)) {
        await User.findByIdAndUpdate(currentUserId, { $addToSet: { friends: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { friends: currentUserId } });
      }
      res.json({ message: "Followed successfully" });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Server error" });
    }
}

const unfollow = async(req,res)=>{
    const { userId } = req.params;
    const { currentUserId } = req.params;
  
    try {
      const currentUser = await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: userId } },
        { new: true }
      );
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found" });
      }
      const targetUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: currentUserId } },
        { new: true }
      );
      if (!targetUser) {
        return res.status(404).json({ message: "User to unfollow not found" });
      }
      // Remove from friends if no longer mutual followers
      if (!currentUser.following.some(id => id.toString() === userId) || 
          !targetUser.following.some(id => id.toString() === currentUserId)) {
        await User.findByIdAndUpdate(currentUserId, { $pull: { friends: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { friends: currentUserId } });
      }
      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Server error" });
    }
}

const searchBestFriends = async(req,res) =>{
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    try {
      // BUG FIX #8: sanitize regex input
      const safeQuery = escapeRegex(query.trim());
      const users = await User.find({ username: { $regex: safeQuery, $options: "i" } }).select("id username");
      res.json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}

const getFriends = async(req,res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('friends', 'profilePic fullname username _id');

      if (!user) {
        // BUG FIX #3: was returning [] (JS value), not sending an HTTP response
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user.friends.slice(0, 4));
    } catch (error) {
      console.error('Error fetching friends:', error.message);
      // BUG FIX #3: was returning [] instead of a proper HTTP error response
      res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
}

module.exports = {getMyDetails, updateProfile, searchUsers, getUserPosts, getSavedPosts, getLikedPosts, deleteSavedPost, checkConnection, getMutualFriends, isFollowing, follow, unfollow, searchBestFriends, getFriends}