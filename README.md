# E-Commerce Backend

A comprehensive Node.js/Express-based e-commerce backend API with MongoDB, featuring multi-role authentication, shopping cart, order management, and delivery tracking.

## 🚀 Features

- **User Authentication**
  - Email-based signup with OTP verification
  - Secure login/logout
  - Forgot password & reset password functionality
  - JWT-based authentication

- **Multi-Role System**
  - Admin: Full platform management
  - Seller: Product management & order tracking
  - User: Shopping, cart, orders
  - Delivery: Order delivery management

- **Shopping Features**
  - Product catalog with categories
  - Shopping cart management
  - Order placement & tracking
  - Multiple payment methods (COD, Card)

- **Delivery Management**
  - Delivery person assignment
  - Order delivery tracking
  - OTP-based delivery verification
  - Payment status tracking

- **Security & Validation**
  - JWT authentication
  - Input validation with Joi
  - Error handling middleware
  - CORS enabled
  - Password hashing with bcrypt

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd e-commerce-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@ecommerce.com
```

4. **Start the server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:4000`

## 📁 Project Structure

```
e-commerce-backend/
├── app.js                 # Main application file
├── package.json           # Dependencies & scripts
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── API_DOCUMENTATION.md  # API reference guide
├── controllers/          # Business logic
│   ├── admin.js
│   ├── user.js
│   ├── seller.js
│   ├── product.js
│   ├── order.js
│   ├── cart.js
│   └── delivery.js
├── routes/               # API endpoints
│   ├── admin.js
│   ├── user.js
│   ├── seller.js
│   ├── order.js
│   ├── cart.js
│   └── delivery.js
├── models/               # Database schemas
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── cart.js
│   ├── category.js
│   └── userType.js
├── middleware/           # Custom middleware
│   ├── auth.js           # Authentication guards
│   ├── validation.js     # Input validation
│   └── errorHandler.js   # Error handling
└── utils/                # Utility functions
    └── sendMail.js       # Email service
```

## 🔐 Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Getting a Token

1. **Signup** - Create a new account
2. **Verify Email** - Verify with OTP
3. **Login** - Get JWT token

## 📚 API Endpoints

### User Routes
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /verify-email` - Verify email with OTP
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP

### Cart Routes (User only)
- `POST /add` - Add item to cart
- `GET /getCart` - View cart
- `PUT /update` - Update cart item
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear cart

### Order Routes
- `POST /place-order` - Place new order (User)
- `GET /my-orders` - View user orders
- `GET /seller-orders` - View seller orders
- `GET /all-orders` - View all orders (Admin)
- `PUT /order-status/:orderId` - Update order status (Admin)

### Delivery Routes (Delivery only)
- `GET /api/my-delivery` - View assigned deliveries
- `PUT /api/out-for-delivery/:orderId` - Mark as out for delivery
- `PUT /api/verify-delivery/:orderId` - Verify delivery with OTP

### Admin Routes
- `POST /create-admin` - Create admin user
- `POST /create-seller` - Create seller account
- `POST /create-delivery-boy` - Create delivery person
- `POST /add-category` - Add product category
- `PUT /assign-delivery/:orderId` - Assign delivery person

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔑 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Manage users, sellers, products, categories, deliveries, orders |
| **Seller** | Add products, view own orders, update order status |
| **User** | Browse products, manage cart, place orders, track delivery |
| **Delivery** | View assigned orders, update delivery status, verify OTP |

## 💡 Key Features

### Email Verification
- OTP-based email verification during signup
- Resend OTP on login if email not verified
- 10-minute OTP expiry

### Password Management
- Secure password hashing with bcrypt
- Forgot password with email OTP
- Password reset with verification

### Order Management
- Order creation from cart items
- Multiple payment methods (COD, Card)
- Order status tracking (pending, shipped, delivered)
- Order cancellation support

### Delivery Tracking
- Delivery person assignment
- OTP-based delivery verification
- Real-time delivery status updates
- COD payment confirmation

### Input Validation
- Request body validation with Joi
- Automatic error response formatting
- Detailed validation error messages

## 🐛 Error Handling

All errors return in this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Detail 1", "Detail 2"]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🚀 Best Practices Implemented

✅ Environment variables for sensitive data  
✅ Input validation on all endpoints  
✅ Consistent error handling  
✅ JWT for secure authentication  
✅ Role-based access control  
✅ Async error handling  
✅ MongoDB models with relationships  
✅ Secure password hashing  
✅ Email verification system  

## 📝 Development

### npm Scripts
```bash
npm start      # Run production server
npm run dev    # Run development server with nodemon
npm test       # Run tests (if configured)
```

### Best Practices
- Always validate user input
- Use environment variables for secrets
- Handle errors gracefully
- Log important events
- Use async/await for promises
- Follow REST API conventions

## 🔜 Future Enhancements

- [ ] Product search & filtering
- [ ] Reviews & ratings
- [ ] Wishlist feature
- [ ] Admin analytics dashboard
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Unit & integration tests
- [ ] API rate limiting
- [ ] Caching layer (Redis)
- [ ] Image optimization

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📧 Support

For bugs, feature requests, or questions, please open an issue or contact the development team.

## 👨‍💻 Author

E-Commerce Development Team

---

**Last Updated:** March 2025  
**Version:** 1.0.0
