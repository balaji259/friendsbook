require('dotenv').config();
const express = require('express');
const path = require('path');
const verifyToken =require("./middleware/verify.js");
const connectDB = require('./db/db');
const authRouter = require('./routes/auth');
const postRouter=require("./routes/postRoutes");
const userRouter=require("./routes/user")
const profileRouter=require("./routes/profile");
const streakRouter=require('./routes/streak');
const chatRouter=require("./routes/message");
const feedbackRouter=require("./routes/feedback.js");
const notificationRouter=require("./routes/notifications.js");
const groupRouter=require("./routes/group.js");
const User=require("./models/users.js");
const Notification=require("./models/notification")
const communityRouter=require("./routes/community.js");
const keyRouter=require("./routes/key.js");
const eventRouter=require("./routes/events.js");
const morgan = require('morgan');



const {app,server} =require("./socket.js");
app.use(morgan('dev'));
const cors = require('cors');




// const app = express();

app.use(express.json({ limit: '50mb' })); // Set limit to 10 MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use(cors(*));

app.use(
  cors({
    origin: "*", // Your deployed frontend URL
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
  })
);

connectDB();

// Routes
app.use('/auth', authRouter);
app.use('/posts',postRouter);
app.use('/user',userRouter);
app.use('/profile',profileRouter);
app.use('/streak',streakRouter);
app.use('/messages',chatRouter);
app.use('/feedback',feedbackRouter);
app.use('/notifications',notificationRouter);
app.use('/group',groupRouter);
app.use('/community',communityRouter);
app.use('/events',eventRouter);
app.use('/key',keyRouter);



app.post('/update-fcm-token', async (req, res) => {
  const { userId, token } = req.body;

  try {
    if (!userId || !token) {
      return res.status(400).json({ success: false, message: 'Missing userId or token' });
    }

    // 🔹 Update the user's FCM token
    await User.findByIdAndUpdate(userId, { fcmToken: token }, { new: true });

    res.json({ success: true, message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Error updating FCM token:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




app.get('/verify',verifyToken,(req,res)=>{
  console.log("Token Verified");
  res.status(200).json({
    message:"Token Verified",
    token:req.token,
    user:req.user
  })
});






const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist'); // Vite
app.use(express.static(frontendDistPath));


app.get('*',(req,res)=>{
  res.sendFile(path.join(frontendDistPath,'index.html'));
})


// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is runningg on port ${PORT}`);
});
