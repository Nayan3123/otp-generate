const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Twilio credentials (replace these with your actual Twilio credentials)
const accountSid = 'AC222844574f5a74d8d75d95fce2bd5006'; // Your Twilio Account SID
const authToken = 'AC222844574f5a74d8d75d95fce2bd5006'; // Your Twilio Auth Token
const twilioClient = new twilio(accountSid, authToken);

// Store OTPs temporarily (In a real application, you would use a database)
const otpStore = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Store OTP for the phone number
  otpStore[phoneNumber] = otp;
  
  // Send OTP via Twilio
  twilioClient.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: '+12132961019', // Your Twilio phone number
      to: phoneNumber
    })
    .then(message => {
      console.log(`OTP sent to ${phoneNumber}: ${otp}`);
      res.json({ message: 'OTP sent successfully' });
    })
    .catch(err => {
      console.error('Error sending OTP:', err);
      res.status(500).json({ message: 'Failed to send OTP' });
    });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }
  
  // Check if OTP is valid
  if (otpStore[phoneNumber] && otpStore[phoneNumber] == otp) {
    delete otpStore[phoneNumber]; // Remove OTP after successful verification
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
￼Enter
