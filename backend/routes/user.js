const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const userController = require("../controllers/userController");



router.get('/getdetails', authMiddleware, userController.getUserDetails);
router.get('/suggestions',authMiddleware,userController.getUserSuggestions);
router.get('/search/suggestions',authMiddleware, userController.getSearchSuggestions);
router.post('/search/follow',authMiddleware, userController.searchFollowUser);
router.post('/search/unfollow',authMiddleware, userController.searchUnfollowUser);
router.get('/viewProfile/:userId', authMiddleware, userController.getUserProfile);
router.get('/getuser',authMiddleware, userController.getUserDetails);
router.post('/getUsersByIds', authMiddleware, userController.getUsersByIds);
router.get('/:userId/friends', authMiddleware, userController.getFriends);
router.post('/follow/:userId', authMiddleware, userController.follow);

module.exports = router;

