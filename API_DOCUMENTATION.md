# E-Commerce Backend API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Authentication Routes

### 1. Signup
- **Endpoint:** `POST /signup`
- **Auth:** No
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main Street",
  "mobile": "9876543210"
}
```
- **Response:** 201 Created
```json
{
  "message": "Signup successful. OTP sent to email."
}
```

### 2. Login
- **Endpoint:** `POST /login`
- **Auth:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** 200 OK
```json
{
  "message": "Login successful",
  "user": { ...user details... },
  "token": "eyJhbGc..."
}
```

### 3. Verify Email
- **Endpoint:** `POST /verify-email`
- **Auth:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response:** 200 OK

### 4. Forgot Password
- **Endpoint:** `POST /forgot-password`
- **Auth:** No
- **Request Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:** 200 OK
```json
{
  "message": "OTP sent to your email. Check your inbox."
}
```

### 5. Reset Password
- **Endpoint:** `POST /reset-password`
- **Auth:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```
- **Response:** 200 OK

---

## Cart Routes (All require authentication - authUser)

### 1. Add to Cart
- **Endpoint:** `POST /add`
- **Auth:** User
- **Request Body:**
```json
{
  "productId": "64abc123...",
  "quantity": 2
}
```
- **Response:** 201 Created

### 2. Get Cart
- **Endpoint:** `GET /getCart`
- **Auth:** User
- **Response:** 200 OK
```json
{
  "_id": "...",
  "user": "...",
  "items": [
    {
      "product": { ...product details... },
      "quantity": 2
    }
  ]
}
```

### 3. Update Cart
- **Endpoint:** `PUT /update`
- **Auth:** User
- **Request Body:**
```json
{
  "productId": "64abc123...",
  "quantity": 5
}
```

### 4. Remove Item
- **Endpoint:** `DELETE /remove/:productId`
- **Auth:** User

### 5. Clear Cart
- **Endpoint:** `DELETE /clear`
- **Auth:** User

---

## Order Routes

### 1. Place Order (Requires: User)
- **Endpoint:** `POST /place-order`
- **Auth:** authUser
- **Request Body:**
```json
{
  "paymentMethod": "COD"
}
```

### 2. Get My Orders (Requires: User)
- **Endpoint:** `GET /my-orders`
- **Auth:** authUser
- **Response:** Orders placed by the user

### 3. Get Order By ID (Requires: User)
- **Endpoint:** `GET /order/:orderId`
- **Auth:** authUser

### 4. Cancel Order (Requires: User)
- **Endpoint:** `PUT /cancel-order/:orderId`
- **Auth:** authUser

### 5. Get Seller Orders (Requires: Seller)
- **Endpoint:** `GET /seller-orders`
- **Auth:** authSeller
- **Response:** Orders where user is the seller

### 6. Get All Orders (Requires: Admin)
- **Endpoint:** `GET /all-orders`
- **Auth:** authAdmin

### 7. Update Order Status (Requires: Admin)
- **Endpoint:** `PUT /order-status/:orderId`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "status": "shipped"
}
```

---

## Delivery Routes (All require authentication - authDeliveryBot)

### 1. Get My Delivery Orders
- **Endpoint:** `GET /api/my-delivery`
- **Auth:** authDeliveryBot
- **Response:** Orders assigned to delivery boy

### 2. Out For Delivery
- **Endpoint:** `PUT /api/out-for-delivery/:orderId`
- **Auth:** authDeliveryBot
- **Response:** Sends OTP to customer

### 3. Verify Delivery OTP
- **Endpoint:** `PUT /api/verify-delivery/:orderId`
- **Auth:** authDeliveryBot
- **Request Body:**
```json
{
  "otp": "123456"
}
```

---

## Admin Routes (All require authentication - authAdmin)

### 1. Create Admin User
- **Endpoint:** `POST /create-admin`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Create Seller
- **Endpoint:** `POST /create-seller`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password123"
}
```

### 3. Add Category
- **Endpoint:** `POST /add-category`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

### 4. Create Delivery Boy
- **Endpoint:** `POST /create-delivery-boy`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "name": "Delivery Person",
  "email": "delivery@example.com",
  "password": "password123",
  "mobile": "9876543210"
}
```

### 5. Assign Delivery Boy
- **Endpoint:** `PUT /assign-delivery/:orderId`
- **Auth:** authAdmin
- **Request Body:**
```json
{
  "deliveryBoyId": "64abc123..."
}
```

---

## Seller Routes

### 1. Add Product (Requires: authSeller)
- **Endpoint:** `POST /add-product`
- **Auth:** authSeller
- **Request Body:**
```json
{
  "name": "Product Name",
  "price": 299.99,
  "description": "Product description",
  "category": "64abc123...",
  "image": "(multipart file)"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Detail 1", "Detail 2"]
}
```

### Common Error Codes
- **400** - Bad Request / Validation Error
- **401** - Unauthorized / Invalid Token
- **403** - Forbidden / Access Denied
- **404** - Not Found
- **500** - Server Error

---

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with configuration

3. Run in development mode:
```bash
npm run dev
```

4. Run in production:
```bash
npm start
```

---

## Environment Variables

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@ecommerce.com
```

---

## User Roles

1. **Admin** - Can manage sellers, products, categories, delivery persons, and orders
2. **Seller** - Can add products and view their orders
3. **User** - Can browse products, add to cart, place orders
4. **Delivery** - Can view and update delivery status

---

## Features

✅ User authentication with email verification  
✅ Forgot & reset password functionality  
✅ Role-based access control  
✅ Shopping cart management  
✅ Order management  
✅ Delivery tracking with OTP verification  
✅ Payment method support (COD, Card)  
✅ Admin dashboard capabilities  
✅ Input validation  
✅ Error handling  
✅ Secure JWT authentication  

---

## Support

For issues or questions, please contact support@ecommerce.com
