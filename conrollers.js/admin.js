const UserType = require("../models/userType");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Category = require("../models/category");

const { sendEmail } = require("../utils/sendMail");
const Order = require("../models/order");
exports.createAdminUser = async (req, res) => {
    try {
        // Find admin user type
        const adminType = await UserType.findOne({ role: 'admin' });
        if (!adminType) {
            return res.status(400).json({ message: 'Admin user type not found' });
        }
        const isAdminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (isAdminExists) {
            return res.status(400).json({ message: 'Admin  already exists' });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        // Create new admin user
        const newAdmin = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            address: "webel",
            mobile: "1234567890",
            userType: adminType._id,
            isVerified: true,
            isActive: true
        });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin user created successfully', user: newAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Create Seller
exports.createSeller = async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;

    // 1️⃣ check existing seller
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // 2️⃣ get seller role
    const sellerRole = await UserType.findOne({ role: "seller" });
    if (!sellerRole) {
      return res.status(500).json({ message: "Seller role not found" });
    }

    // 3️⃣ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ create seller
    const seller = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      userType: sellerRole._id,
      isActive: true,
      isVerified: true
    });

    await seller.save();

    // 5️⃣ send credentials email
    await sendEmail(
      email,
      "Seller Account Created – Login Credentials",
      `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">
        <h2>Welcome to Our Platform</h2>

        <p>Dear ${name},</p>

        <p>
          Your seller account has been successfully created by the administrator.
          You can now log in using the credentials below:
        </p>

        <p>
          <strong>Email:</strong> ${email}<br/>
          <strong>Password:</strong> ${password}
        </p>

        <p>
          For security reasons, we strongly recommend changing your password
          after your first login.
        </p>

        <p>
          If you have any questions, feel free to contact our support team.
        </p>

        <br/>

        <p>
          Best regards,<br/>
          <strong>Your Company Name</strong><br/>
          Support Team
        </p>
      </div>
      `
    );

    res.status(201).json({
      message: "Seller created successfully and credentials sent via email"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      createdBy: req.user._id
    });

    await category.save();

    res.status(201).json({
      message: "Category added successfully",
      category
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create Delivery Boy

exports.createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, password, mobile, vehicleNumber } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Delivery boy already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const deliveryRole = await UserType.findOne({ role: "delivery" });

    const deliveryBoy = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      userType: deliveryRole._id,
      deliveryInfo: { vehicleNumber },
      isActive: true,
      isVerified: true

    });

    await deliveryBoy.save();
     await sendEmail(
  email,
  "Delivery Partner Account Created – Login Credentials",
  `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">
    <h2>Welcome to Our Delivery Team 🚚</h2>

    <p>Dear ${name},</p>

    <p>
      Your <strong>Delivery Partner account</strong> has been successfully created
      by the administrator.
    </p>

    <p>
      You can log in to the delivery app/portal using the credentials below:
    </p>

    <p style="background:#f5f5f5; padding:10px; border-radius:6px;">
      <strong>Email:</strong> ${email}<br/>
      <strong>Password:</strong> ${password}
    </p>

    <p>
      Please keep your login credentials confidential.
      For security reasons, we strongly recommend changing your password
      after your first login.
    </p>

    <p>
      Once logged in, you will be able to:
      <ul>
        <li>View assigned deliveries</li>
        <li>Update delivery status</li>
        <li>Verify delivery using OTP</li>
      </ul>
    </p>

    <p>
      If you face any issues or have questions, please contact our support team.
    </p>

    <br/>

    <p>
      Best regards,<br/>
      <strong>Your Company Name</strong><br/>
      Delivery Operations Team
    </p>
  </div>
  `
);




    res.status(201).json({
      message: "Delivery boy created successfully",
      deliveryBoy
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoy: deliveryBoyId,
        deliveryStatus: "assigned"
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Delivery boy assigned successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


