// controllers/QuotationController.js

const mongoose = require('mongoose');
const QuoteRequest = mongoose.models.QuoteRequest || require('../models/QuoteRequest'); // Adjusted model import
const User = require('../models/UserModel');  // Import User model
const Product = require('../models/Product'); // Import the Product model
const AcceptedQuotation = require('../models/AcceptedQuotations');  // Import the AcceptedQuotation model

// Backend handling - saveQuoteRequest
const saveQuoteRequest = async (req, res) => {
  try {
    const { supplierId, products, date } = req.body;

    const newQuoteRequest = new QuoteRequest({
      supplierId,
      products,
      date, 
    });

    // Save the quote request to the database
    const savedQuoteRequest = await newQuoteRequest.save();

    // Send the response
    res.status(201).json({
      message: 'Quotation request saved successfully!',
      data: savedQuoteRequest,
    });
  } catch (error) {
    console.error('Error saving quote request:', error);
    res.status(500).json({ message: 'Failed to save quotation request' });
  }
};

// Fetch the quotation history
const getQuotationHistory = async (req, res) => {
  try {
    // Fetch the quotations and manually populate supplierId and productId
    const history = await QuoteRequest.find();

    // Manually populate supplierName and productName, including quantity
    const populatedHistory = await Promise.all(
      history.map(async (quote) => {
        // Fetch supplier name based on supplierId
        const supplier = await User.findById(quote.supplierId);
        const supplierName = supplier ? supplier.name : 'Unknown Supplier';
        
        // Manually fetch product names and include quantities
        const populatedProducts = await Promise.all(
          quote.products.map(async (product) => {
            const productDetails = await Product.findById(product.productId);
            return {
              ...product,
              productName: productDetails ? productDetails.name : 'Unknown Product',
              quantity: product.quantity || 0, 
            };
          })
        );

        return {
          ...quote.toObject(),
          supplierName: supplierName,
          products: populatedProducts,
        };
      })
    );

    res.status(200).json(populatedHistory);
  } catch (error) {
    console.error('Error fetching quotation history:', error);
    res.status(500).json({
      message: 'Error fetching quotation history',
      error: error.message,
    });
  }
};

// Get quotations for a specific supplier
const getQuotationsForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;  // Get the supplier ID from the authenticated user

    // Find all quotations for the specific supplier and populate product names
    const quotations = await QuoteRequest.find({ supplierId })
      .populate('supplierId', 'name')  // Get the supplier name
      .populate('products.productId', 'name');  // Get product names

    const populatedQuotations = await Promise.all(
      quotations.map(async (quote) => {
        // Fetch the supplier's name using supplierId
        const supplier = await User.findById(quote.supplierId);
        const supplierName = supplier ? supplier.name : 'Unknown Supplier';
        
        // Populate product details (name, quantity)
        const populatedProducts = await Promise.all(
          quote.products.map(async (product) => {
            const productDetails = await Product.findById(product.productId);
            return {
              ...product,
              productName: productDetails ? productDetails.name : 'Unknown Product',
              quantity: product.quantity || 0,  // Ensure quantity is populated
            };
          })
        );

        return {
          ...quote.toObject(),
          supplierName,
          products: populatedProducts,  // Attach populated products
        };
      })
    );

    res.status(200).json(populatedQuotations);  // Return populated quotations
  } catch (error) {
    console.error('Error fetching quotations for supplier:', error);
    res.status(500).json({
      message: 'Error fetching quotations',
      error: error.message,
    });
  }
};

// Update the status of a quotation
const updateQuotationStatus = async (req, res) => {
  try {
    const { quotationId, status } = req.body;
    const supplierId = req.user._id;  // Get supplier ID from the authenticated user

    // Find the quotation by ID and check if it belongs to the supplier
    const quotation = await QuoteRequest.findById(quotationId);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (quotation.supplierId.toString() !== supplierId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this quotation' });
    }

    // Update the status
    quotation.status = status;  // Update the status field
    await quotation.save();

    return res.status(200).json({
      message: 'Quotation status updated successfully',
      data: quotation,
    });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    return res.status(500).json({
      message: 'Error updating quotation status',
      error: error.message,
    });
  }
};



// Move quotation to the accepted quotations collection
const moveToAcceptedQuotations = async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Find the quotation to move
    const quotation = await QuoteRequest.findById(quotationId);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Create a new accepted quotation
    const newAcceptedQuotation = new AcceptedQuotation({
      supplierId: quotation.supplierId,
      products: quotation.products,
      date: quotation.date,
      status: 'Accepted'
    });

    // Save the accepted quotation
    await newAcceptedQuotation.save();

    // Optionally delete the quotation from the original collection
    await quotation.deleteOne(); // Updated from quotation.remove()

    return res.status(200).json({ message: 'Quotation moved to accepted' });
  } catch (error) {
    console.error('Error moving quotation:', error);
    res.status(500).json({ message: 'Error moving quotation to accepted' });
  }
};


const getAcceptedQuotationsForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;  // Get the supplier ID from the authenticated user

    // Fetch accepted quotations for the specific supplier from the AcceptedQuotation model
    const acceptedQuotations = await AcceptedQuotation.find({ supplierId })
      .populate('supplierId', 'name')  // Get the supplier name
      .populate('products.productId', 'name');  // Get product names

    const populatedAcceptedQuotations = await Promise.all(
      acceptedQuotations.map(async (quote) => {
        // Fetch the supplier's name using supplierId
        const supplier = await User.findById(quote.supplierId);
        const supplierName = supplier ? supplier.name : 'Unknown Supplier';
        
        // Populate product details (name, quantity)
        const populatedProducts = await Promise.all(
          quote.products.map(async (product) => {
            const productDetails = await Product.findById(product.productId);
            return {
              ...product,
              productName: productDetails ? productDetails.name : 'Unknown Product',
              quantity: product.quantity || 0,  // Ensure quantity is populated
            };
          })
        );

        return {
          ...quote.toObject(),
          supplierName,
          products: populatedProducts,  // Attach populated products
        };
      })
    );

    res.status(200).json(populatedAcceptedQuotations);  // Return populated accepted quotations
  } catch (error) {
    console.error('Error fetching accepted quotations for supplier:', error);
    res.status(500).json({
      message: 'Error fetching accepted quotations',
      error: error.message,
    });
  }
};


// Fetch all accepted quotations for the admin
const getAllAcceptedQuotations = async (req, res) => {
  try {
    // Fetch all accepted quotations from the AcceptedQuotation model
    const acceptedQuotations = await AcceptedQuotation.find()
      .populate('supplierId', 'name')  // Get the supplier name
      .populate('products.productId', 'name');  // Get product names

    const populatedAcceptedQuotations = await Promise.all(
      acceptedQuotations.map(async (quote) => {
        // Fetch the supplier's name using supplierId
        const supplier = await User.findById(quote.supplierId);
        const supplierName = supplier ? supplier.name : 'Unknown Supplier';

        // Populate product details (name, quantity)
        const populatedProducts = await Promise.all(
          quote.products.map(async (product) => {
            const productDetails = await Product.findById(product.productId);
            return {
              ...product,
              productName: productDetails ? productDetails.name : 'Unknown Product',
              quantity: product.quantity || 0,  // Ensure quantity is populated
            };
          })
        );

        return {
          ...quote.toObject(),
          supplierName,
          products: populatedProducts,  // Attach populated products
        };
      })
    );

    // Send the response with the populated quotations
    res.status(200).json(populatedAcceptedQuotations);
  } catch (error) {
    console.error('Error fetching accepted quotations for admin:', error);
    res.status(500).json({
      message: 'Error fetching accepted quotations',
      error: error.message,
    });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.status(200).json(users);  // Send the users as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};




module.exports = {
  getQuotationHistory,
  saveQuoteRequest,
  getQuotationsForSupplier,
  updateQuotationStatus,
  moveToAcceptedQuotations,
  getAcceptedQuotationsForSupplier,
  getAllAcceptedQuotations,
  getUsers,

};
