const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserType = require("../models/userType");
const { sendEmail, generateOTP } = require("../utils/sendMail");
const { sanitizeUser } = require("../utils/sanitize");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}


exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, mobile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = await UserType.findOne({ role: "user" })

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      mobile,
      userType: userId._id,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 min
    });

    await newUser.save();

    await sendEmail
      (
        email,
        "Email Verification – One-Time Password (OTP)",
        `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Email Verification</h2>

      <p>Dear User,</p>

      <p>
        Thank you for registering with us. To complete your sign-up process,
        please verify your email address using the One-Time Password (OTP) below:
      </p>

      <h1 style="letter-spacing: 4px;">${otp}</h1>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.
        Please do not share this code with anyone for security reasons.
      </p>

      <p>
        If you did not request this verification, please ignore this email.
      </p>

      <br />

      <p>
        Best regards,<br />
        <strong>Your Company Name</strong><br />
        Support Team
      </p>
    </div>
  `
      );


    res.status(201).json({
      message: "Signup successful. OTP sent to email."
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// verify email

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // check user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // otp match
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // otp expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User is not active" });
    }

    // ❗ USER NOT VERIFIED
    if (!user.isVerified) {

      const otp = generateOTP();

      // ✅ save OTP properly
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // ✅ send email
      await sendEmail(
        email,
        "Verify Your Email Address – OTP Required",
        `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">
          <h2>Email Verification</h2>
          <p>Dear User,</p>

          <p>
            Please verify your email address using the OTP below to continue login.
          </p>

          <h1 style="letter-spacing: 6px;">${otp}</h1>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
            Do not share it with anyone.
          </p>

          <p>
            Best regards,<br/>
            <strong>Your Company Name</strong>
          </p>
        </div>
        `
      );

      return res.status(403).json({
        message: "Email not verified. OTP sent to email."
      });
    }

    // ✅ VERIFIED USER → LOGIN
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: sanitizeUser(user),
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail(
      email,
      "Password Reset – One-Time Password (OTP)",
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p><strong>This OTP is valid for 10 minutes only.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
        <br />
        <p>Best regards,<br/><strong>Your Company Name</strong></p>
      </div>
      `
    );

    res.status(200).json({
      message: "OTP sent to your email. Check your inbox."
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. Please login with your new password."
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
