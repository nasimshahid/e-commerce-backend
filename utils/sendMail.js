const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "snasim1786@gmail.com",
    pass: "pmujgadapmriwrll"
  }
});
const sendEmail = async (to, subject, html) => {
 try {
    await transporter.sendMail({
      from: "snasim1786@gmail.com",
      to,
      subject,
      html
    });
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw error;
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {sendEmail,generateOTP}

