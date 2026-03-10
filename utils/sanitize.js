// Helper functions to sanitize responses

/**
 * Remove sensitive fields from user object
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, otp, otpExpires, __v, ...sanitized } = userObj;
  return sanitized;
};

/**
 * Remove sensitive fields from order object
 */
const sanitizeOrder = (order) => {
  const orderObj = order.toObject ? order.toObject() : order;
  const { __v, ...sanitized } = orderObj;
  return sanitized;
};

/**
 * Remove sensitive fields from array of users
 */
const sanitizeUsers = (users) => {
  return users.map(user => sanitizeUser(user));
};

/**
 * Remove sensitive fields from array of orders
 */
const sanitizeOrders = (orders) => {
  return orders.map(order => sanitizeOrder(order));
};

module.exports = {
  sanitizeUser,
  sanitizeUsers,
  sanitizeOrder,
  sanitizeOrders
};
