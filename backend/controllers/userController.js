const jwt = require('jsonwebtoken');
const User = require('../models/users');
const authMiddleware = require("../middleware/auth");
const { checkStreakOnLoad, updateStreakOnPost } =require("../routes/streak");


const getUserDetails = async (req,res) =>{
      try {  
        
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        return res.json({
          username: user.username,
          fullname: user.fullname,
          profilePic: user.profilePic,
          email: user.email
        });

      } catch (err) {

        console.log(err.message);
        return res.status(500).json({ message: 'Server error', error: err.message });
      }
}

const searchFollowUser = async(req,res) =>{
    const { userId, targetId: followId } = req.body;

    
      try {
        const user = await User.findById(userId);
        const followUser = await User.findById(followId);
    
        if (!user || !followUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if already followed
        if (user.following.includes(followId)) {
            console.log("already follwing");
          return res.status(200).json({ message: 'Already following' });
        }
    
        // Update the follower and following lists
        user.following.push(followId);
        followUser.followers.push(userId);
    
        // Check if mutual following exists
        if (followUser.following.includes(userId)) {
          // Add to each other's friends list
          if (!user.friends.includes(followId)) {
            user.friends.push(followId);
          }
          if (!followUser.friends.includes(userId)) {
            followUser.friends.push(userId);
          }
        }
    
        console.log("implemented friends feature !");
        await user.save();
        await followUser.save();
    
        res.status(200).json({ message: 'Followed successfully and friends list updated if mutual' });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}

const searchUnfollowUser = async(req,res) =>{
      const { userId } = req.body;
  const unfollowId=req.body.targetId;

  try {
  
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is currently following the unfollowed user
    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ message: 'Not following the user' });
    }

    // Remove the unfollowed user from the current user's following list
    user.following = user.following.filter((id) => id.toString() !== unfollowId);

    // Remove the current user from the unfollowed user's followers list
    unfollowUser.followers = unfollowUser.followers.filter((id) => id.toString() !== userId);

    // If they were friends (mutual followers), remove each other from friends lists
    if (user.friends.includes(unfollowId)) {
      user.friends = user.friends.filter((id) => id.toString() !== unfollowId);
    }
    if (unfollowUser.friends.includes(userId)) {
      unfollowUser.friends = unfollowUser.friends.filter((id) => id.toString() !== userId);
    }

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: 'Unfollowed successfully and friends list updated if necessary' });
  } catch (error) {
    console.error('Error during unfollow:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

const searchFollow = async(req,res)=>{
    const { userId, followId } = req.body;
    
  
    
      try {
        const user = await User.findById(userId);
        const followUser = await User.findById(followId);
    
        if (!user || !followUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if already followed
        if (user.following.includes(followId)) {
          return res.status(400).json({ message: 'Already following' });
        }
    
        // Update the follower and following lists
        user.following.push(followId);
        followUser.followers.push(userId);
    
        // Check if mutual following exists
        if (followUser.following.includes(userId)) {
          // Add to each other's friends list
          if (!user.friends.includes(followId)) {
            user.friends.push(followId);
          }
          if (!followUser.friends.includes(userId)) {
            followUser.friends.push(userId);
          }
        }

        await user.save();
        await followUser.save();
    
        res.status(200).json({ message: 'Followed successfully and friends list updated if mutual' });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}

const getUserProfile = async(req,res) => {
    try {
    const { userId } = req.params;


    const userProfile = await User.findById(userId)
      .select('-password') 
      .populate({
        path: 'bestFriend',
        select: 'username',   
      });

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userProfile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error!' });
  }
}

const getUserSuggestions = async(req,res) => {
    try {
            const loggedInUserId = req.user.id;
    
            if (!loggedInUserId) {
                return res.status(400).json({ message: 'User not authenticated' });
            }
    
            // Fetch the logged-in user's following list
            const loggedInUser = await User.findById(loggedInUserId).populate('following');
            if (!loggedInUser) {
                return res.status(404).json({ message: 'Logged-in user not found' });
            }
    
            // Create an exclusion list with the logged-in user's ID and their following list
            const excludeIds = loggedInUser.following.map(user => user._id);
            excludeIds.push(loggedInUser._id);
    
            // Fetch all users excluding those in the excludeIds array
            const allSuggestions = await User.aggregate([
                { $match: { _id: { $nin: excludeIds } } }, // Exclude followed users and self
                { $project: { password: 0 } } // Exclude sensitive information
            ]);
    
            res.status(200).json({ users: allSuggestions });
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
            res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
}

const getSearchSuggestions = async(req,res) => {
    try {
        const loggedInUserId = req.user.id;
        if (!loggedInUserId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Logged-in user not found' });
        }

        const { query = '' } = req.query;
        let matchQuery = { _id: { $ne: loggedInUserId } }; // Exclude logged-in user

        if (query.trim()) {
            matchQuery.username = { $regex: query.trim(), $options: 'i' };
        }

        const users = await User.find(matchQuery)
            .select('_id username fullname profilePic bio')
            .lean();

        const usersWithFollowStatus = users.map(user => ({
            ...user,
            followStatus: loggedInUser.following.includes(user._id) ? 'unfollow' : 'follow'
        }));

        res.status(200).json({ users: usersWithFollowStatus });
    } catch (error) {
        console.error('Error fetching user suggestions:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

const getUsersByIds = async(req,res) =>{
      const { userIds } = req.body;
  try {
      const users = await User.find({ _id: { $in: userIds } }).select('username'); 
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
  }
}


const getFriends = async(req,res) =>{
    const { userId } = req.params;

    
      try {

        const user = await User.findById(userId).populate('friends', 'username fullname profilePic bio');
        
        if (!user) {
         
          return res.status(404).json({ message: 'User not found' });
        }

 
        res.status(200).json({ friends: user.friends });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}

const follow = async(req,res) =>{
    try {
      const currentUserId = req.user.id; // Current user ID from token
      const targetUserId = req.params.userId; // User ID of the person to follow

      if (currentUserId === targetUserId) {
          return res.status(400).json({ message: 'You cannot follow yourself' });
      }

      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (!currentUser || !targetUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if already following
      if (!currentUser.following.includes(targetUserId)) {
          currentUser.following.push(targetUserId);
          targetUser.followers.push(currentUserId);

          await currentUser.save();
          await targetUser.save();

          return res.status(200).json({ message: 'Successfully followed user' });
      } else {
          return res.status(400).json({ message: 'Already following user' });
      }
  } catch (error) {
      console.error('Follow error:', error);
      res.status(500).json({ message: 'Failed to follow user' });
  }
}

module.exports = {getUserDetails, searchFollowUser, searchUnfollowUser, searchFollow , getUserProfile, getUserSuggestions, getSearchSuggestions, getUsersByIds, getFriends, follow}


