const express = require('express');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  suggestProducts,
} = require('../controllers/ProductController');
const { authMiddleware, adminMiddleware } = require('../middleware/AuthMiddleware');

const router = express.Router();

// Product Routes
router.get('/products', authMiddleware, getProducts);
router.post('/products', authMiddleware, addProduct);
router.put('/products/:id', authMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware,  deleteProduct); // Admin only

// Suggest Products if Inventory is below threshold
router.get('/suggest-products', authMiddleware, suggestProducts);

module.exports = router;
