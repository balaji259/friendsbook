const User = require('../models/users');
const multer = require('multer'); 
const mongoose = require('mongoose');
const formidable=require('formidable');
const cloudinary = require('../cloudinaryConfig');
const { Post, Comment } = require('../models/post');
const SavedPost=require("../models/savedPost");

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


const getMyDetails = async(req,res) =>{
    try {
        console.log("req.user");
        console.log(req.user);
        const user = await User.findById(req.user.id).select('-password').populate({
          path: 'bestFriend',   
          select: 'username',   
        });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
}

const updateProfile = async(req,res) => {
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
    
          // Check if a new profile picture is uploaded
          if (files.profilePic && files.profilePic.length > 0) {
            const filePath = files.profilePic[0].filepath;
    
            // Upload the file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(filePath, {
              folder: 'profile_pics', // Folder in Cloudinary
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Supported formats
            });
    
            profilePicUrl = uploadResult.secure_url; // Cloudinary URL
          } else {
            // Retain existing profilePic or set default
            profilePicUrl = currentUser.profilePic;
          }
    
          // Prepare the updateData object
          const updateData = {
            profilePic: profilePicUrl,
            mobileNumber: fields.mobile?.[0] == "undefined" ? currentUser.mobileNumber : fields.mobile?.[0],
            website: fields.website?.[0] == "undefined" ? currentUser.website: fields.website?.[0],
            fullname: fields.fullname?.[0] == "undefined" ? currentUser.fullname: fields.fullname?.[0],
    
            school: fields.school?.[0] == "undefined" ? currentUser.school : fields.school?.[0],
            status: fields.status?.[0] == "undefined" ? currentUser.status : fields.status?.[0],
            gender: fields.gender?.[0] == "undefined"?  currentUser.gender : fields.gender?.[0],
            residence: fields.residence?.[0] == "undefined" ? currentUser.residence : fields.residence?.[0],
            hometown: fields.hometown?.[0] == "undefined" ? currentUser.hometown : fields.hometown?.[0],
            highschool: fields.highschool?.[0] == "undefined" ? currentUser.highschool:fields.highschool?.[0],
            lookingfor: fields.lookingfor?.[0] == "undefined" ? currentUser.lookingfor :fields.lookingfor?.[0],
            interestedIn: fields.interestedIn?.[0] == "undefined" ? currentUser.interestedIn :fields.interestedIn?.[0],
            relationshipstatus: fields.relationshipstatus?.[0] == "undefined" ? currentUser.relationshipStatus : fields.relationshipstatus?.[0],
          
            // bestFriend:fields.bestfriend?.[0]== "undefined" ? currentUser.bestFriend : fields.bestfriend?.[0],
            bestFriend: fields.bestfriend ? JSON.parse(fields.bestfriend[0]) : currentUser.bestFriend,
    
            collegeName: fields.collegename?.[0] == "undefined" ? currentUser.collegeName :fields.collegename?.[0],
            interests: fields.interests?.[0] == "undefined" ? currentUser.interests : fields.interests?.[0],
    
            favoriteSport: fields.sport?.[0] == "undefined" ? currentUser.favoriteSport : fields.sport?.[0],
            favoriteGame: fields.game?.[0] == "undefined" ?  currentUser.favoriteGame : fields.game?.[0],
    
            favoriteMusic: fields.music?.[0] == "undefined" ? currentUser.favoriteMusic : fields.music?.[0],
            favoriteMovie: fields.movie?.[0] == "undefined" ?  currentUser.favoriteMovie : fields.movie?.[0],
    
            favoriteAnime: fields.anime?.[0] == "undefined" ? currentUser.favoriteAnime : fields.anime?.[0],
            favoriteActor: fields.actor?.[0] == "undefined" ? currentUser.favoriteActor : fields.actor?.[0],
            bio: fields.bio?.[0] == "undefined" ?  currentUser.bio : fields.bio?.[0]
          };
    
          
    
    // Function to validate if a date is valid
    function isValidDate(date) {
      return date instanceof Date && !isNaN(date);
    }
    
    // Check if fields.dateOfBirth is provided and not null or the string "undefined"
    if (fields.dateOfBirth && fields.dateOfBirth !== "undefined") {
      const parsedDate = new Date(fields.dateOfBirth);
      if (isValidDate(parsedDate)) {
        updateData.dateOfBirth = parsedDate;
        console.log("valid one");
      } else {
        console.log("Invalid date provided:", fields.dateOfBirth);
        updateData.dateOfBirth = currentUser.dateOfBirth;
      }
    } else {
      updateData.dateOfBirth = currentUser.dateOfBirth;
    }
    
    
    
    
          // Logging the fields (form data)
          console.log('Fields received:');
          Object.keys(fields).forEach((key) => {
            console.log(`${key}: ${fields[key]}`);
          });
    
          // Logging the files (if any)
          console.log('Files received:');
          Object.keys(files).forEach((key) => {
            console.log(`${key}:`, files[key]);
          });
    
          // Update the user's profile in the database
          const updatedUser = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true });
        console.log("profile updated!");
    
          console.log(updatedUser);
          
    
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
      const users = await User.find({ username: { $regex: username, $options: 'i' } }).limit(5);
      res.json(users.length ? users : []);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserPosts = async(req,res) =>{
    const userId = req.params.userId;
  console.log("entered route");
  console.log(userId);

  try {
      
      const posts = await Post.find({ user: userId })
          .select('postType caption content') 
          .populate('user', 'username profilePic')  
          .exec();

      console.log("posts"); 
      console.log(posts);
      res.status(200).json({ posts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching posts' });
  }
}

const getSavedPosts = async(req,res) =>{
    try {
    console.log("fetchd saved oposts");
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

    console.log(savedPosts);
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
        console.log("enyteree route");
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
      console.log(userId);
      console.log(friendId);
    
      try {
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const isFriend = user.friends.includes(friendId);
    
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
    
        // Fetch both users
        const user1 = await User.findById(userId1).populate('friends', 'id');
        const user2 = await User.findById(userId2).populate('friends', 'id');
    
        if (!user1 || !user2) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Find mutual friends
        const mutualFriends = user1.friends.filter(friend =>
          user2.friends.some(f => f.id === friend.id)
        );
    
        res.json({ mutualFriendsCount: mutualFriends.length });
      } catch (error) {
        console.error('Error fetching mutual friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const isFollowing = async(req,res) =>{
    const { userId } = req.params;
      const { currentUserId } = req.params; // Get current user ID from query param
    
      console.log("inside follow route bro");
      console.log(userId);
      console.log(currentUserId);
    
      try {
    
        // Fetch the current user's data to check the following array
        const currentUser = await User.findById(currentUserId);
    
        if (!currentUser) {
          console.log("inside no current user");
          return res.status(404).json({ message: "Current user not found" });
        }
    
        // Check if userId is in the following array of the current user
        const isFollowing = currentUser.following.includes(userId);
    
    
        console.log(isFollowing);
        res.json({ isFollowing });
      } catch (error) {
        console.error("Error checking follow status:", error);
        res.status(500).json({ message: "Server error" });
      }
}

const follow = async(req,res) =>{
    const { userId } = req.params; // User to be followed
      const { currentUserId } = req.params; // Current user making the request
    
      try {
        // Add `userId` to the current user's `following` array if not already present
        const currentUser = await User.findByIdAndUpdate(
          currentUserId,
          { $addToSet: { following: userId } },
          { new: true }
        );
    
        if (!currentUser) {
          return res.status(404).json({ message: "Current user not found" });
        }
    
        // Add `currentUserId` to the target user's `followers` array if not already present
        const targetUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { followers: currentUserId } },
          { new: true }
        );
    
        if (!targetUser) {
          return res.status(404).json({ message: "User to follow not found" });
        }
    
          // Check mutual following
          if (targetUser.following.includes(currentUserId)) {
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
    const { userId } = req.params; // User to be unfollowed
      const { currentUserId } = req.params; // Current user making the request
    
      console.log("userids");
      console.log(userId);
      console.log(currentUserId);
      // res.json("reached");
      try {
        // Remove `userId` from the current user's `following` array
        const currentUser = await User.findByIdAndUpdate(
          currentUserId,
          { $pull: { following: userId } },
          { new: true }
        );
    
        if (!currentUser) {
          console.log("in no currentuset");
          return res.status(404).json({ message: "Current user not found" });
        }
    
        // Remove `currentUserId` from the target user's `followers` array
        const targetUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { followers: currentUserId } },
          { new: true }
        );
    
        if (!targetUser) {
          console.log("np target user");
          return res.status(404).json({ message: "User to unfollow not found" });
        }
    
        // Remove from friends if not mutual followers anymore
    if (!currentUser.following.includes(userId) || !targetUser.following.includes(currentUserId)) {
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
    
      console.log("query");
      console.log(query);
    
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
    
      try {
  
        const users = await User.find({ username: { $regex: query, $options: "i" } }).select("id username");
    
    
        console.log("users");
        console.log(users);
        res.json({ users });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
      }
}

const getFriends = async(req,res) => {
    try {
    
    const userId=req.params.id;
    console.log("getting friends");
    const user = await User.findById(userId).populate('friends', 'profilePic fullname username _id');

    if (!user) {
      return []; 
    }

    // Get the first 4 friends or fewer if less are available
    console.log(user.friends.slice(0,4));
    console.log('returning');
    res.status(200).json( user.friends.slice(0, 4));

  } catch (error) {
    console.error('Error fetching friends:', error.message);
    return [];
  }
}

module.exports = {getMyDetails, updateProfile, searchUsers, getUserPosts, getSavedPosts, getLikedPosts, deleteSavedPost, checkConnection, getMutualFriends, isFollowing, follow, unfollow, searchBestFriends, getFriends}