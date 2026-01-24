const Order = require("../models/order");
const { sendEmail } = require("../utils/sendMail");

exports.getMyDeliveryOrders = async (req, res) => {
  try {
    console.log("Delivery Boy ID:", "6974903cc9a6d7081c0d38bf");
    const orders = await Order.find({
      deliveryBoy: "6974903cc9a6d7081c0d38bf",
    //   deliveryBoy: req.user._id,
      deliveryStatus: { $ne: "delivered" }
    })
      .populate("user")              // customer details
      .populate("items.product")     // product details
      .sort({ createdAt: -1 });      // latest first

    res.json({
      total: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.updateDeliveryStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await Order.findOneAndUpdate(
//       { _id: req.params.orderId, deliveryBoy: req.user._id },
//       { deliveryStatus: status },
//       { new: true }
//     );

//     res.json({ message: "Delivery status updated", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.verifyDeliveryOTP = async (req, res) => {
//   try {
//     const { otp } = req.body;

//     const order = await Order.findOne({
//       _id: req.params.orderId,
//       deliveryBoy: req.user._id
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.deliveryOTP !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     order.deliveryStatus = "delivered";
//     order.status = "delivered";
//     order.deliveredAt = new Date();
//     order.deliveryOTP = null;

//     // COD case
//     if (order.paymentMethod === "COD") {
//       order.paymentStatus = "paid";
//     }

//     await order.save();

//     res.json({ message: "Order delivered successfully", order });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.outForDelivery = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryBoy:"6974903cc9a6d7081c0d38bf"
    }).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryStatus = "out_for_delivery";
    order.deliveryOTP = otp;
    order.deliveryOTPExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await order.save();

    // 📧 Send OTP to CUSTOMER
    await sendEmail(
      order.user.email,
      "Delivery OTP – Order Verification",
      `
      <div style="font-family: Arial">
        <h3>Your order is out for delivery 🚚</h3>
        <p>Order ID: <b>${order.orderNumber}</b></p>
        <p>Your delivery OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 15 minutes.</p>
      </div>
      `
    );

    res.json({ message: "OTP sent to customer email" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
    //   deliveryBoy: "req.user._id"
      deliveryBoy: "6974903cc9a6d7081c0d38bf"
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (Date.now() > order.deliveryOTPExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Mark delivered
    order.deliveryStatus = "delivered";
    order.status = "delivered";
    order.deliveredAt = new Date();
    order.deliveryOTP = null;
    order.deliveryOTPExpires = null;

    // COD handling
    if (order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.json({
      message: "Order delivered successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
