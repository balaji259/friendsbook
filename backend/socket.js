const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv");

const Discussion = require("./models/discussion.js"); // Adjust the path as needed


dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN || "*", // Secure CORS
    methods: ["GET", "POST"],
  },
});

// Store user socket connections securely
const userSocketMap = new Map(); // {userId: Set(socketIds)}

// Function to get the receiver's socket ID
function getReceiverSocketId(userId) {
  return userSocketMap.get(userId) ? [...userSocketMap.get(userId)] : [];
}

// Middleware: Authenticate users using JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.error("Authentication failed: No token provided");
    return next(new Error("Authentication failed: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Authentication failed: Invalid or expired token",err.message);
      return next(new Error("Authentication failed: Invalid or expired token"));
    }

    // Attach user data to the socket for later reference
    socket.userId = decoded.userId;
    socket.username = decoded.username || "Anonymous";

    next();
  });
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id} (UserID: ${socket.userId})`);

  const userId = socket.userId;

  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }

  userSocketMap.get(userId).add(socket.id);

  // Emit the updated list of online users
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));


  //discussions:
  socket.on("joinCommunityRoom", ({ id, userName }) => {
    console.log("In the join community room !");
    console.log(id);
    console.log(userName);
    socket.join(id);
    socket.to(id).emit("receiveMessage", {
      sender: "System",
      text: `${userName} joined the discussion`,
      userId: null
    });
  });

  socket.on("sendMessageToCommunity", async ({ communityId, userId, userName, text }) => {
    console.log("Send message function !");
    console.log({ communityId, userId, userName, text });
    const newMsg = await Discussion.create({
      communityId,
      userId,
      userName,
      text
    });

    // io.to(communityId).emit("receiveMessage", {
    //   sender: userName,
    //   text,
    //   userId
    // });
    console.log("before emitting receiving message");
    console.log(newMsg);

    io.to(communityId).emit("receiveMessage", {
      ...newMsg.toObject()
    });

  });


  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id} (UserID: ${userId})`);

    if (userSocketMap.has(userId)) {
      const sockets = userSocketMap.get(userId);
      sockets.delete(socket.id);

      // If the user has no active sockets, remove them
      if (sockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }

    // Emit updated online users
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

module.exports = { io, app, server, getReceiverSocketId };