require("dotenv").config();
const express=require("express");
const nodemailer=require('nodemailer');
const router=express();


router.post("/senddata", async (req, res) => {
  const { feedbackType, feedbackPart, feedbackText, includeSessionData, contactMe, email } = req.body;


  if(!email){
    
      return res.json({error: "Error sending feedback.Try again!"})

  }

    
  if (!feedbackType || !feedbackPart || !feedbackText) {
  
    return res.status(400).json({ error: "All fields are required" });
  }


  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "balajipuneti259@gmail.com", 
      subject: "New Feedback Received",
      text: `Received a feedback from:${email}\nFeedback Type: ${feedbackType}\nFeedback Part: ${feedbackPart}\nMessage: ${feedbackText}\nInclude Session Data: ${includeSessionData}\nContact Me: ${contactMe}`,
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: "Error sending feedback" });
  }
});

module.exports=router;