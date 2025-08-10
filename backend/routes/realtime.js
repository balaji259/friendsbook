const express = require("express");
const Notification = require("../models/notification");

const router = express.Router();

// Pass `io` to use inside routes
module.exports = (io) => {
  
  // Create and send a notification
  router.post("/create", async (req, res) => {
    try {
      const { userId, senderId, type, title, body } = req.body;

      const newNotification = new Notification({
        userId, // Receiver
        senderId, // Sender
        type,
        title,
        body,
      });

      await newNotification.save();

      // Emit event to only the target user (receiver)
      io.to(userId).emit("receive-notification", newNotification);

      res.status(201).json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
