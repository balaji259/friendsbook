const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { evaluateStreak } = require('../utils/streakUtils');

// Function to get the top 10 users by streak count
const getTopStreakUsers = async (req, res) => {
  try {
    const topUsers = await User.find({ "streak.count": { $gt: 0 } })
      .select('profilePic username streak')
      .sort({ "streak.count": -1 })
      .limit(10);
    
    // Evaluate streaks only for the top 10
    const evaluatedUsers = await Promise.all(topUsers.map(u => evaluateStreak(u)));
    
    const topStreakUsers = evaluatedUsers.map(u => ({
      _id: u._id,
      profilePic: u.profilePic,
      username: u.username,
      streak: { count: u.streak.count }
    }));

    res.status(200).json(topStreakUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching top streak users' });
  }
};

// Define route to get top streak users
router.get('/top-streaks', getTopStreakUsers);

module.exports = router;