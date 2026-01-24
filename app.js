const express = require('express');
const mongoose = require('mongoose');
const UserType = require('./models/userType');
const app = express();
const adminRoutes = require('./routes/admin');
const userRouter = require('./routes/user');
const sellerRoutes = require('./routes/seller');
const port = 4000;
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const deliveryRoutes = require('./routes/delivery');
const cors = require('cors');
// db Connected


mongoose.connect('mongodb://localhost:27017/ecommerce'
).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const createUserTypes = async (req, res) => {
  try {
    // total records count karo
    const count = await UserType.countDocuments();

    if (count > 0) {
      //   return res.json({ message: 'User already exists' });
      console.log('User already exists');
      return;
    }

    // agar collection empty hai to save karo
    await UserType.insertMany([
      { role: 'admin' },
      { role: 'seller' },
      { role: 'user' },
      { role: 'delivery' },
    ]);

    // res.json({ message: 'User types saved successfully' });
    console.log('User types saved successfully');

  } catch (error) {
    // res.status(500).json({ error: error.message });
    console.error('Error creating user types:', error.message);
  }
};

createUserTypes()

app.use(express.json());
app.use(cors());
app.use('/', adminRoutes);
app.use('/', userRouter);
app.use('/', sellerRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);
app.use('/api',deliveryRoutes );

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});