require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Otp = require('../models/otp');


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL, 
        pass: process.env.TRANSPORTER_PASS, 
    },
});


const sendOTP = async (req,res) =>{
    try{
    
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 
    
    // Save OTP to the database
    await Otp.create({ email, otp, expiry });

    // Send the OTP via email
    
    await transporter.sendMail({
        from: 'getsetotp@gmail.com', // Replace with your email
        to: email,
        subject: 'Your OTP for Registration',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        });

    
        res.status(200).json({ message: 'OTP sent to email' });

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ error: 'Failed to send OTP. Try again later.' });

    }
}

const validateOTP = async (req,res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try{

        
             const otpRecord = await Otp.findOne({ email, otp });
        
                if (!otpRecord) {
                    return res.status(400).json({ error: 'Invalid OTP' });
                }
        
                // Check if OTP has expired
                if (new Date() > otpRecord.expiry) {
                    await Otp.deleteOne({ _id: otpRecord._id }); // Clean up expired OTP
                    return res.status(400).json({ error: 'OTP has expired' });
                }
        
                // OTP is valid
                await Otp.deleteOne({ _id: otpRecord._id }); // Remove OTP after successful validation
                res.status(200).json({ message: 'OTP validated successfully' });

    }
    catch(err){
        console.log(err.message);
         res.status(500).json({ error: 'Failed to validate OTP. Try again later.' });

    }
}

const registerUser = async (req,res) => {
    
    const { username, fullname, email, gender, birthday, password } = req.body;
    try {
            // Check if a user with the same email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
    
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new user instance with the additional fields
            const newUser = new User({
                username,
                fullname,
                email,
                gender,
                dateOfBirth:birthday,
                password: hashedPassword, // Save hashed password
            });
    
            // Save the new user to the database
            await newUser.save();
    
            // Create a JWT payload including the new fields
            const payload = {
                userId: newUser._id,
                username: newUser.username,
                email: newUser.email,
                
            };
    
            // Generate a JWT token that expires in 30 days
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    
            // Respond with the generated token and user details
            return res.status(201).json({
                token, 
                payload,
                message: 'Registration successful!',
            });
    
        } catch (err) {
            console.error('Error registering user:', err.message);
            return res.status(500).json({ error: 'Error registering user' });
        }


}

const verifyKey = async (req,res) => {
     const { email, friendsbookKey } = req.body;
     
        try {
            // Find the user by email
            const user = await User.findOne({ email });

            console.log(user);

            if (!user) {
                return res.status(401).json({ error: 'Email not registered' });
            }
    
    
          
    
               // Verify the friendsbookKey
               const isMatch = await bcrypt.compare(friendsbookKey, user.friendsbookKey.key);

               console.log(friendsbookKey);
               console.log(user.friendsbookKey?.key);

               if (!isMatch) {
                   console.log("Invalid key");
                   return res.status(401).json({ error: 'Invalid Friendsbook Key' });
               }
    
          
    


            // Generate a new token after verifying the key
            const payload = {
                userId: user._id,
                username: user.username,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    
            res.json({ token, payload }); 
    
        } catch (err) {
            console.error('Error during key verification:', err.message);
            res.status(500).json({ message: 'Server error.' });
        }
}

const loginUser = async (req,res) =>{
    console.log("inside");
    const { email, password } = req.body;
  
    
        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                console.log("email not regstered");
                return res.status(401).json({ error: 'Email not registered' });
            }
    
            // Verify the password
            if(password){
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                
                
                return res.status(401).json({ error: 'Invalid password' });
            }
            }
    
               // If activeState is true, ask the user to enter the friendsbookKey
               if (user.friendsbookKey.active) {
                return res.status(200).json({ active: true }); // Flag to indicate the need for the friendsbookKey
            }
    
            // Define token payload (you can include more user info if needed)
            const payload = {
                userId:user._id,
                username: user.username,
                email: user.email,
            };
            // Generate JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'30d'});
    
            // Send token to the client
            res.json({ token,payload });
            
        } catch (error) {
            console.error('Error during login:', err.message);
            res.status(500).json({ message: 'Server error'});
        }
}

const checkEmail = async (req,res) =>{
  
    const { email } = req.body;
  try {

      const user = await User.findOne({ email });
   
      if (user) {
          return res.json({ exists: true });
      }

      res.json({ exists: false });
  } catch (err) {
      console.error('Error checking email:', err.message);
      res.status(500).json({ error: 'Internal server error' });
  }

}

module.exports = {sendOTP, validateOTP, registerUser, verifyKey, loginUser, checkEmail}