const User = require('../models/users');

/**
 * Lazily evaluates a user's streak based on their lastPostTime.
 * If the streak is broken (more than 1 day since last post), it updates the DB.
 * Returns the modified user object so the frontend always gets accurate data.
 */
const evaluateStreak = async (user) => {
  if (!user || !user.streak) return user;

  const currentCount = user.streak.count || 0;
  const lastPostTime = user.streak.lastPostTime;

  // If count is already 0, nothing to break
  if (currentCount === 0 || !lastPostTime) return user;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const lastPostDate = new Date(lastPostTime);
  lastPostDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(currentDate - lastPostDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If it's been more than 1 full day since the last post, the streak is broken
  if (diffDays > 1) {
    user.streak.count = 0;
    
    // Asynchronously update the DB to reflect the broken streak
    // We don't await this so it doesn't block the profile load
    User.updateOne(
      { _id: user._id },
      { $set: { "streak.count": 0 } }
    ).catch(err => console.error("Error breaking streak lazy eval:", err));
  }

  return user;
};

module.exports = { evaluateStreak };
