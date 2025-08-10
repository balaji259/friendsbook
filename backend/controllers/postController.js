const path = require('path');
const multer = require('multer');
const formidable=require('formidable');
const cloudinary = require('../cloudinaryConfig');
const { Post, Comment } = require('../models/post');
const Report = require('../models/report');
const authMiddleware = require('../middleware/auth');
const SavedPost = require('../models/savedPost');
const User = require("../models/users");
const multiparty = require("multiparty");
const { checkStreakOnLoad, updateStreakOnPost } = require("../routes/streak");


const getISTDate = () => {
    const options = { timeZone: 'Asia/Kolkata' };
    return new Date(new Date().toLocaleString('en-US', options));
};

const formatComment = (comment) => {
    return {
        commentId: comment._id, // Include comment ID
        user: comment.user ? {
            userId: comment.user._id, // Include user ID
            profilePic: comment.user.profilePic || 'default-pic-url',
            username: comment.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: comment.text,
        createdAt: comment.createdAt,
        replies: (comment.replies || []).map(reply => formatReply(reply)) // Map replies using helper
    };
}


const formatReply = (reply) => {
    return {
        replyId: reply._id, // Include reply ID
        user: reply.user ? {
            userId: reply.user._id, // Include user ID
            profilePic: reply.user.profilePic || 'default-pic-url',
            username: reply.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: reply.text,
        createdAt: reply.createdAt,
        replies: (reply.replies || []).map(nestedReply => formatNestedReply(nestedReply)) // Recursively map nested replies
    };
}


const formatNestedReply = (nestedReply) => {
    return {
        nestedReplyId: nestedReply._id, // Include nested reply ID
        user: nestedReply.user ? {
            userId: nestedReply.user._id, // Include user ID
            profilePic: nestedReply.user.profilePic || 'default-pic-url',
            username: nestedReply.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: nestedReply.text,
        createdAt: nestedReply.createdAt,
    };
}


const createPost = async(req,res) => {
    try {
            const form = new multiparty.Form();
            
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Form parse error:', err);
                    return res.status(500).json({ error: 'Failed to parse form data' });
                }
    
                const { captionOrText, userId, mediaContent } = fields;
                if (!userId) return res.status(400).json({ error: "User ID is required" });
    
                const caption = captionOrText?.[0] || null;
                const mediaUrl = mediaContent?.[0] || null;
                const postType = mediaUrl ? (/\.(mp4|webm|avi|mkv|mov|flv|wmv)$/i.test(mediaUrl) ? "video" : "image") : "text";
    
                // Create post
                const post = new Post({ user: userId, postType, caption, content: { mediaUrl } });
                await post.save();
    
                // Update user's post count & streak in a single query
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
    
                const updateUser = await User.findByIdAndUpdate(
        userId,
        [
            {
                $set: {
                    "streak.lastPostTime": currentDate,
                    "streak.count": {
                        $cond: {
                            if: { $eq: ["$streak.lastPostTime", currentDate] },
                            then: "$streak.count",
                            else: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            { $dateDiff: { startDate: "$streak.lastPostTime", endDate: currentDate, unit: "day" } },
                                            1,
                                        ],
                                    },
                                    then: { $add: ["$streak.count", 1] },
                                    else: 1,
                                },
                            },
                        },
                    },
                    postsCount: { $add: ["$postsCount", 1] } // <-- replaces $inc
                },
            }
        ],
        { new: true }
    );
    
    
                if (!updateUser) return res.status(404).json({ error: 'User not found' });
    
                res.status(201).json({ message: 'Post created successfully', post });
            });
    
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Failed to create post' });
        }
}

const getPosts = async(req,res) =>{
    const userId = req.user ? req.user._id : null; // Optional authentication check

    try {
        const posts = await Post.find({})
            .populate('user', 'username profilePic bio') // Populate user info for the post
            .populate({
                path: 'comments',
                populate: [
                    { path: 'user', select: 'username profilePic' }, // Populate user for comments
                    {
                        path: 'replies',
                        populate: {
                            path: 'user', select: 'username profilePic'  // Populate user for replies
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });

        const formattedPosts = posts.map(post => ({
            postId: post._id,
            
            user: {
            
                profilePic: post.user?.profilePic || 'default-pic-url',
                username: post.user?.username || 'Unknown User',
            },
            //added
            userId:post.user,
            postType: post.postType,
            caption: post.caption,
            content: {
                mediaUrl: post.content.mediaUrl,
            },
            likesCount: post.likes.length,
            likedByUser: userId ? post.likes.includes(userId) : false,
            comments: post.comments.map(comment => formatComment(comment)),
            shares: post.shares,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}

const likePost = async (req,res) =>{
    const { postId, userId } = req.params;
    
        console.log(`postId: ${postId}`);
        console.log(`userId: ${userId}`);
    
        try {
            // Convert userId to ObjectId
            // const userObjectId = mongoose.Types.ObjectId(userId);
    
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
    
            // Check if the user has already liked the post
            const userIndex = post.likes.indexOf(userId);
    
            if (userIndex === -1) {
                // User has not liked the post, so add like
                post.likes.push(userId);
            } else {
                // User already liked the post, so remove the like
                post.likes.splice(userIndex, 1);
            }
    
            // Save the updated post
            await post.save();
    
            // Send response with updated likes count
            res.status(200).json({
                message: 'Like status updated',
                likesCount: post.likes.length,
                liked: userIndex === -1  // Send the new liked status
            });
        } catch (error) {
            console.error('Error updating like status:', error);
            res.status(500).json({ error: 'Failed to update like status' });
        }
}

const unlikePost = async(req,res) => {
    const postId = req.params.id;
        const { userId } = req.user; // User ID from authentication middleware
      
        console.log(postId);
        console.log(userId);
    
        try {
          const post = await Post.findById(postId);
      
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
      
          // Check if the user has already liked the post
          const userIndex = post.likes.indexOf(userId);
          if (userIndex === -1) {
            return res.status(400).json({ message: 'Post is not liked by the user' });
          }
      
          // Remove the user from the likes array
          post.likes.splice(userIndex, 1);
          post.likesCount = Math.max(post.likesCount - 1, 0); // Ensure it doesn't go below 0
      
          await post.save();
      
          return res.status(200).json({ message: 'Post unliked successfully', likesCount: post.likesCount });
        } catch (error) {
          console.error('Error unliking post:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
}

const commentPost = async (req,res) => {
    const postId = req.params.postId;
        const { text } = req.body;
        const {  username } = req.user;
        const userId = req.user.id;

        console.log(req.body);
        console.log(userId);
        console.log(username);
    
        if (!text || !userId || !username) {

            return res.status(400).send({ message: 'Comment text, user ID, and username are required.' });
        }
    
        try {
            const newComment = new Comment({
                user: userId,
                username: username,
                text: text,
                createdAt: new Date(),
            });
    
      
            await newComment.save();
    
            const post = await Post.findById(postId);
            if (!post) return res.status(404).send({ message: 'Post not found.' });
    
            post.comments.push(newComment._id);
            await post.save();
    
            // Populate the new comment with its replies (if any)
            const populatedComment = await Comment.findById(newComment._id).populate('replies');
    
            res.status(200).send(populatedComment);
        } catch (error) {
            console.error('Error adding comment:', error.message || error);
            res.status(500).send({ message: 'Error adding comment.', error: error.message });
        }
}

const replyComment = async (req,res) => {
    const { commentId } = req.params;
        const { text } = req.body;
        const {username}=req.user;
        const userId = req.user.id;

        try {
            if (!userId) {
                return res.status(400).json({ message: "User ID is required." });
            }
    
            // Create a new reply comment
            const newReply = new Comment({
                user: userId,  
                username: username,
                text: text,
            });
    
            console.log("newReply");
            console.log(newReply);
    
            // Save the reply comment to the database
            const savedReply = await newReply.save();
    
            // Update the parent comment to include this reply
            await Comment.findByIdAndUpdate(commentId, {
                $push: { replies: savedReply._id }
            });
    
            console.log("reply done saved !");
    
            res.status(201).json({ message: "Reply added successfully", reply: savedReply });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to add reply" });
        }
}

const deleteComment  = async (req,res) =>{
    const { commentId } = req.params;
        console.log("reached backend");
        console.log(commentId);
        try {
            // Find and delete the comment
            const deletedComment = await Comment.findByIdAndDelete(commentId);
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
    
            // Remove comment reference from the associated post
            await Post.updateOne(
                { comments: commentId },
                { $pull: { comments: commentId } }
            );
    
            // If the comment had replies, delete them as well
            await Comment.deleteMany({ _id: { $in: deletedComment.replies } });
    
            console.log("deleted");
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
}

const editComment = async(req,res)=>{

    console.log("1");

    const { commentId } = req.params;
        const { text } = req.body;
    
        console.log(commentId);
        console.log(req.body);

        try {
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { text },
                { new: true }
            );
    
            if (!updatedComment) {
                console.log("2");
                return res.status(404).json({ message: 'Comment not found' });
            }
    
            console.log("3");
            res.status(200).json({ message: 'Comment updated successfully', updatedComment });
        } catch (error) {
            console.error('Error updating comment:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
}

const deleteReply = async(req,res) =>{
    const { replyId } = req.params;
    
        try {
            console.log("Deleting reply:", replyId);
    
            // Find and delete the reply
            const deletedReply = await Comment.findByIdAndDelete(replyId);
            if (!deletedReply) {
                return res.status(404).json({ message: 'Reply not found' });
            }
    
            // Remove reply reference from the parent comment
            await Comment.updateOne(
                { replies: { $elemMatch: { replyId } } },
                { $pull: { replies: { replyId } } }
            );
    
            console.log("Reply deleted successfully");
            res.status(200).json({ message: 'Reply deleted successfully' });
    
        } catch (error) {
            console.error('Error deleting reply:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
}

const editReply = async (req,res) =>{
    const {replyId}=req.params;
    const { text } = req.body;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            replyId,
            { text },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        res.status(200).json({ message: 'Reply updated successfully', updatedComment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getSinglePost = async(req,res) =>{
    try {
            const post = await Post.findById(req.params.postId)
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'replies',
                        model: 'Comment',
                        populate: {
                            path: 'replies',
                            model: 'Comment',  // Deep populate more levels if needed
                        }
                    },
                });
    
            if (!post) return res.status(404).send({ message: 'Post not found.' });
    
            console.log("Populated Post:", JSON.stringify(post, null, 2));
            res.status(200).send(post);
        } catch (error) {
            console.error('Error fetching post:', error.message || error);
            res.status(500).send({ message: 'Error fetching post.', error: error.message });
        }
}

const reportPost = async(req,res) => {
    try {
            const { userId, postId, reason } = req.body;
    
            const newReport = new Report({
                userId,
                postId,
                reason,
                reportedAt: new Date()
            });
    
            await newReport.save();
    
            res.json({ success: true, message: "Report saved successfully!" });
        } catch (error) {
            console.error("Failed to save report:", error);
            res.status(500).json({ success: false, message: "Failed to submit report." });
        }
}

const savePost = async(req,res) =>{
    const { userId, postId } = req.body;
    
        try {
            
            const existingSave = await SavedPost.findOne({ userId, postId });
         
            if (existingSave) {
                return res.json({ success: true, message: "Post already saved.", alreadySaved: true });
            }

    
            const savedPost = new SavedPost({ userId, postId });
            await savedPost.save();
    
            res.json({ success: true, message: "Post saved successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "An error occurred." });
        }
}

const getSavedPosts = async(req,res) => {
    const { userId } = req.params;
    
        try {
            const savedPosts = await SavedPost.find({ userId }).populate('postId').exec();
            res.json({ success: true, savedPosts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "An error occurred." });
        }
}

const deletePost = async (req,res) => {
    const postId = req.params.id;
    
        const userId = req.user.id;
    
        try {
         
          const post = await Post.findById(postId);

      
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
      

          if (post.user.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
          }
      
       
          await Post.findByIdAndDelete(postId);
    
          await SavedPost.deleteMany({ postId });
    
          await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });
    
          console.log("post deleted!");
      
          return res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
          console.error('Error deleting post:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
}

const renderSinglePost = async (req,res) =>{
    console.log(req.params);
    const { postId } = req.params;
    console.log(postId);

    try {
        const post = await Post.findById(postId)
            .populate('user', 'username profilePic') // Populate user details for the post owner
            .populate({
                path: 'comments',
                populate: [
                    { path: 'user', select: 'username profilePic' }, // Populate user details for each comment
                    {
                        path: 'replies',
                        populate: { path: 'user', select: 'username profilePic' } // Populate nested replies' user details
                    }
                ]
            });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: 'Failed to fetch post details' });
    }
}

module.exports = {createPost, likePost, commentPost, replyComment, getSinglePost, reportPost, savePost, getSavedPosts, deletePost, unlikePost, deleteComment, editComment, deleteReply, editReply, renderSinglePost, getPosts};