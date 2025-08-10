const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema explicitly

const announcementSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postType: { type: String, enum: ['text', 'image', 'video'], required: true },
    cg_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true }, 
    caption: { type: String },
    media: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 }, 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;






