const Joi = require('joi');

// Validation schemas
const schemas = {
  signup: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(50),
    address: Joi.string().optional(),
    mobile: Joi.string().optional().pattern(/^[0-9]{10}$/)
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  verifyEmail: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().required().min(6).max(50)
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6).max(50)
  }),

  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  }),

  updateCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  }),

  placeOrder: Joi.object({
    paymentMethod: Joi.string().valid('COD', 'CARD').required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      mobile: Joi.string().required().pattern(/^[0-9]{10}$/),
      addressLine: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
      country: Joi.string().required()
    }).required()
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string()
      .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
      .required()
  }),

  addCategory: Joi.object({
    name: Joi.string().required().min(2).max(50),
    description: Joi.string().optional().max(500)
  }),

  createSeller: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    mobile: Joi.string().optional().pattern(/^[0-9]{10}$/),
    address: Joi.string().optional()
  }),

  createDeliveryBoy: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    mobile: Joi.string().required().pattern(/^[0-9]{10}$/),
    vehicleNumber: Joi.string().required().min(3).max(20)
  }),

  assignDeliveryBoy: Joi.object({
    deliveryBoyId: Joi.string().required()
  }),

  addProduct: Joi.object({
    name: Joi.string().required().min(3).max(100),
    price: Joi.number().required().min(0),
    description: Joi.string().optional().max(1000),
    category: Joi.string().required()
  }),

  verifyDeliveryOTP: Joi.object({
    otp: Joi.string().length(6).required()
  })
};

// Validation middleware factory
const validate = (schemaKey) => {
  return (req, res, next) => {
    const schema = schemas[schemaKey];
    if (!schema) {
      return res.status(500).json({ error: 'Validation schema not found' });
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: messages
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = { validate, schemas };
