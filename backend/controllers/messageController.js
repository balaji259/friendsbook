
const User=require("../models/users");
const cloudinary = require('../cloudinaryConfig');
const Message=require("../models/message");
const CommunityMessage = require("../models/CommunityMessage");

const { getReceiverSocketId,io } = require("../socket");


const getUsersForSideBar=async (req,res)=>{
    try{
        const loggedInUserId=req.user.id;
        console.log("loggedInUserId");
        console.log(loggedInUserId);
        // const filteredUsers=await User.find({ _id: { $ne: loggedInUserId }}).select("-password");
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("_id username fullname email profilePic bio");
        // console.log("filteredUsers");
        // console.log(filteredUsers);

        res.status(200).json(filteredUsers);

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
            })
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
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
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

        //real time functinlity goes here!
        console.log("real time msgh event!");
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            console.log("sending the emit event");
            io.to(receiverSocketId).emit("newCommunityMessage",newMessage);
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