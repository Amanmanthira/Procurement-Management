const express = require('express');
const {
  placeOrder,
  getOrders,
} = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/AuthMiddleware');

const router = express.Router();

// Order Routes
router.post('/orders', authMiddleware, placeOrder);
router.get('/orders', authMiddleware, getOrders);

module.exports = router;
