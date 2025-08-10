const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema explicitly

const groupPostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postType: { type: String, enum: ['text', 'image', 'video'], required: true },
    group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true }, // Added `ref: 'Group'`
    caption: { type: String },
    media: { type: String }, // Fixed media field to store only the URL as a string
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 }, 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});



const GroupPosts=mongoose.model('GroupPosts', groupPostSchema);
module.exports = GroupPosts;
    