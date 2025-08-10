const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const formidable=require('formidable');
const cloudinary = require('../cloudinaryConfig');
// const Post = require('../models/post');
const { Post, Comment } = require('../models/post');
const Report = require('../models/report');
const authMiddleware = require('../middleware/auth');  // Ensure correct import
const authenticateUser = require('./authenticate_user');
const SavedPost = require('../models/savedPost');
const User = require("../models/users");
const multiparty = require("multiparty");
const { checkStreakOnLoad, updateStreakOnPost } = require("./streak");

const postController = require("../controllers/postController");


// Multer configuration for file uploads
// Helper function to sanitize filenames

const getISTDate = () => {
    const options = { timeZone: 'Asia/Kolkata' };
    return new Date(new Date().toLocaleString('en-US', options));
};




router.post('/create', authMiddleware, postController.createPost);

router.get('/get', authMiddleware, postController.getPosts);



router.post('/like/:userId/:postId', authMiddleware, postController.likePost);


router.post('/comment/:postId', authMiddleware, postController.commentPost);


router.post('/comment/reply/:commentId',authMiddleware, postController.replyComment);


router.get('/post/:postId', authMiddleware, postController.getSinglePost);


router.post("/report", authMiddleware, postController.reportPost);



router.post('/save', authMiddleware, postController.savePost);


router.get('/getsaved/:userId', authMiddleware, postController.getSavedPosts);


router.delete('/:id',authenticateUser, authMiddleware, postController.deletePost);
  


router.get('/render-single/:postId', authMiddleware, postController.renderSinglePost);


router.patch('/:id/unlike', authMiddleware, postController.unlikePost);

router.delete('/comment/delete/:commentId', authMiddleware, postController.deleteComment);

router.put('/comment/edit/:commentId', authMiddleware, postController.editComment);

router.delete('/reply/delete/:replyId', authMiddleware, postController.deleteReply);

router.put('/reply/edit/:replyId', authMiddleware, postController.editReply);



module.exports = router;
