const express=require('express');

const router=express.Router();

const Notification = require('../models/notification');

const { sendNotification } = require('../socket');



// Route to fetch all notifications of a specific user
router.get('/getall/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log("feteching all notification !");

  try {
    // Fetch notifications and populate senderId with followers also
    const notifications = await Notification.find({ userId })
      .populate({
        path: 'senderId',
        select: 'username fullname profilePic followers',
        populate: {
          path: 'followers',
          select: '_id'
        }
      })
      .sort({ createdAt: -1 });

      console.log("notifications:")
      console.log(notifications);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndDelete(id);
      console.log("Notification deleted!")
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.log("Failed to delete notification!");
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

// ✅ Get unread notification count
router.get('/unread/count/:userId', async (req, res) => {
    try {
      const {userId} = req.params;
      
      // ✅ Count only unread notifications
      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false
      });
  
      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error("Error fetching unread count", error);
      res.status(500).json({ error: 'Server error while fetching unread count' });
    }
  });



// Create notification route
router.post('/create', async (req, res) => {
  try {
    const { userId, senderId, body, type } = req.body;
    
    // Create notification in database
    const newNotification = new Notification({
      userId,
      senderId,
      body,
      type,
      isRead: false 
    });
    
    const savedNotification = await newNotification.save();
    
    // Populate sender information before sending via socket
    const populatedNotification = await Notification.findById(savedNotification._id)
      .populate('senderId', 'username profilePic');
    
    // Send real-time notification via socket
    sendNotification(userId, populatedNotification);
    
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

  

module.exports = router;
