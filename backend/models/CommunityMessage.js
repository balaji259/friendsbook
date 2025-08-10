const mongoose = require('mongoose');
const Community = require("./community");

const CommunityMessageSchema = new mongoose.Schema(
    {
        
        communityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
            required: true
          },
        
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
        },
        media: {
            type: String, // This will store the URL or base64 string of the media
        },
        mediaType: {
            type: String, // Either "image" or "video"
            enum: ['image', 'video'], // Restrict to specific types
            default: null, // optional
        },
    },
    { timestamps: true }
);

const CommunityMessage = mongoose.model('CommunityMessage', CommunityMessageSchema);
module.exports = CommunityMessage;
