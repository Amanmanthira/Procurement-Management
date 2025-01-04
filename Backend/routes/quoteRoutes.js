const express = require('express');
const { 
  saveQuoteRequest, 
  getQuotationsForSupplier,
  updateQuotationStatus,
  getQuotationHistory,
  moveToAcceptedQuotations, 
  getAcceptedQuotationsForSupplier,
  getAllAcceptedQuotations,
  getUsers,
} = require('../controllers/QuotationController');
const { authMiddleware } = require('../middleware/AuthMiddleware');
const { adminMiddleware } = require('../middleware/AuthMiddleware');

const router = express.Router();

// Route for sending quotations to multiple suppliers
router.post('/save-quotations', authMiddleware, adminMiddleware, saveQuoteRequest);

// Route for fetching supplier quotations
router.get('/history', getQuotationHistory);

// Route for fetching quotations specific to a supplier
router.get('/supplier/quotations', authMiddleware, getQuotationsForSupplier);

// Route for responding to quotation (approve/reject)
router.put('/supplier/quotations/status', authMiddleware, updateQuotationStatus);

router.post('/move-to-accepted/:quotationId', moveToAcceptedQuotations);

// Route for fetching accepted quotations specific to a supplier
router.get('/supplier/accepted-quotations', authMiddleware, getAcceptedQuotationsForSupplier);

router.get('/admin/accepted-quotations', authMiddleware, getAllAcceptedQuotations);

router.get('/users', authMiddleware, adminMiddleware, getUsers);

module.exports = router;
