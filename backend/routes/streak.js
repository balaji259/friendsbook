const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { evaluateStreak } = require('../utils/streakUtils');

// Function to get the top 10 users by streak count
const getTopStreakUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select('profilePic username streak');
    
    // Evaluate streaks for everyone so broken ones drop to 0
    const evaluatedUsers = await Promise.all(allUsers.map(u => evaluateStreak(u)));
    
    // Sort descending and grab top 10
    const topStreakUsers = evaluatedUsers
      .sort((a, b) => (b.streak?.count || 0) - (a.streak?.count || 0))
      .slice(0, 10)
      .map(u => ({
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