const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const profileController = require("../controllers/profileController");


  
router.get('/me', authMiddleware, profileController.getMyDetails);

router.patch('/update', authMiddleware, profileController.updateProfile);



router.get('/bestfriend/search',authMiddleware, profileController.searchUsers);


router.get('/userPosts/:userId', authMiddleware, profileController.getUserPosts);



router.get('/savedPosts/:userId', authMiddleware, profileController.getSavedPosts);


router.get('/likedPosts/:userId', authMiddleware, profileController.getLikedPosts);

router.delete('/deleteSavedPost/:postId', authMiddleware, profileController.deleteSavedPost);

router.get('/check-connection/:userId/:friendId', authMiddleware, profileController.checkConnection);

router.get('/mutual-friends/:userId1/:userId2', authMiddleware, profileController.getMutualFriends);

router.get("/isFollowing/:userId/:currentUserId", authMiddleware, profileController.isFollowing);

router.post("/follow/:userId/:currentUserId", authMiddleware, profileController.follow);


router.post("/unfollow/:userId/:currentUserId", authMiddleware, profileController.unfollow);


router.get("/search-bestfriend", authMiddleware, profileController.searchBestFriends);


router.get('/getfriends/:id',authMiddleware, profileController.getFriends)



module.exports = router;
