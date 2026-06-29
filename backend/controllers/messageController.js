
const mongoose = require("mongoose");
const User=require("../models/users");
const cloudinary = require('../cloudinaryConfig');
const Message=require("../models/message");
const CommunityMessage = require("../models/CommunityMessage");

const { getReceiverSocketId,io } = require("../socket");


const getUsersForSideBar=async (req,res)=>{
    try{
        const loggedInUserId=req.user.id;
        const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);

        // Aggregate to find the latest message time with each user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserObjectId },
                        { receiverId: loggedInUserObjectId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", loggedInUserObjectId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessageTime: { $max: "$createdAt" }
                }
            }
        ]);

        // Map userId string to last message time
        const conversationMap = {};
        conversations.forEach(conv => {
            if (conv._id) {
                conversationMap[conv._id.toString()] = conv.lastMessageTime;
            }
        });

        // Get all users except loggedInUserId
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("_id username fullname email profilePic bio")
            .lean();

        // Sort users: those with conversations sorted by lastMessageTime desc,
        // then those without conversations (at the bottom).
        const sortedUsers = allUsers.sort((a, b) => {
            const timeA = conversationMap[a._id.toString()] ? new Date(conversationMap[a._id.toString()]).getTime() : 0;
            const timeB = conversationMap[b._id.toString()] ? new Date(conversationMap[b._id.toString()]).getTime() : 0;

            if (timeA !== timeB) {
                return timeB - timeA; // Descending order of last message time
            }
            // Fallback: sort alphabetically by username
            return a.username.localeCompare(b.username);
        });

        res.status(200).json(sortedUsers);

    }
    catch(e)
    {
        console.log(e.message);
        res.status(500).json(e);
    }
};

const getMessages=async (req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user.id;
        console.log(myId);
        console.log(userToChatId);

        const messages=await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
            }).sort({ createdAt: 1 });
            res.status(200).json(messages);
        }
        catch(e){
            console.log(e);
            res.status(500).json({error:"Internal Server Error"});
        }
}

const sendMessage=async (req,res)=>{
    try{
        // const {text,image}=req.body;
        const { text, media, mediaType } = req.body;
        const {id:receiverId}=req.params;
        const senderId= req.user.id;

        let mediaUrl;
        if(media){
            const uploadResponse = await cloudinary.uploader.upload(media, {
                resource_type: mediaType === "video" ? "video" : "image",
            });
            mediaUrl = uploadResponse.secure_url;
        }

        const newMessage=new Message(
            {
                senderId,
                receiverId,
                text,
                media: mediaUrl,
                mediaType,
            }
        ); 

        await newMessage.save();

        //real time functinlity goes here!
        const receiverSocketIds = getReceiverSocketId(receiverId);
        if(receiverSocketIds.length > 0){
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        }


        res.status(201).json(newMessage);

    }
    catch(e){
        console.log(e);
        res.status(500).json("Error in sending message",e.message);
    }
};  

const sendCommunityMessage=async (req,res)=>{
    try{
        // const {text,image}=req.body;
        const { text, communityId, media, mediaType } = req.body;
        const {id:receiverId}=req.params;
        const senderId= req.user.id;

        console.log("messageData");
        console.log(text);
        console.log(receiverId);
        console.log(senderId);
        console.log(communityId);
        console.log(media);
        console.log(mediaType);

        let mediaUrl;
        if(media){
            const uploadResponse = await cloudinary.uploader.upload(media, {
                resource_type: mediaType === "video" ? "video" : "image",
            });
            mediaUrl = uploadResponse.secure_url;
        }

        const newMessage=new CommunityMessage(
            {
                senderId,
                receiverId,
                text,
                media: mediaUrl,
                mediaType,
                communityId
            }
        ); 
        console.log("newMessage");
        console.log(newMessage);

        await newMessage.save();

        //real time functionality goes here!
        console.log("real time msgh event!");
        const receiverSocketIds = getReceiverSocketId(receiverId);
        if (receiverSocketIds.length > 0) {
            console.log("sending the emit event");
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newCommunityMessage", newMessage);
            });
        }


        res.status(201).json(newMessage);

    }
    catch(e){
        console.log(e);
        res.status(500).json("Error in sending message",e.message);
    }
};  


const getMessagesBetweenUsers = async (req, res) => {
    const { communityId, receiverId } = req.params;
    const senderId = req.user.id; 
  
    try {
      const messages = await CommunityMessage.find({
        communityId,
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      })
      .sort({ createdAt: 1 }); // ascending order
  
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  };


module.exports={getUsersForSideBar, getMessages, sendMessage, sendCommunityMessage, getMessagesBetweenUsers}