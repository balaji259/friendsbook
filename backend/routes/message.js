const express=require('express');
const router=express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require('../middleware/auth');



router.get("/get/:id",authMiddleware,messageController.getMessages);
router.post("/send/:id",authMiddleware, messageController.sendMessage);
router.get("/getusers",authMiddleware,messageController.getUsersForSideBar);
router.post("/community/send/:id",authMiddleware,messageController.sendCommunityMessage);
router.get('/community/:communityId/with/:receiverId', authMiddleware, messageController.getMessagesBetweenUsers);


module.exports=router;