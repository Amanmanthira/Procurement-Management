const Product = require('../models/Product');
const Order = require('../models/OrderModel');


// Get all products - Admin can view all products, suppliers only their own
const getProducts = async (req, res) => {
  try {
    let products;
    if (req.user.role === 'admin') {
      // Admin can view all products
      products = await Product.find().populate('supplier', 'name');
    } else {
      // Suppliers can only view their own products
      products = await Product.find({ supplier: req.user._id }).populate('supplier', 'name');
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Add product - Suppliers can add their own products
const addProduct = async (req, res) => {
  console.log("Request body for adding product:", req.body); // Log incoming data for debugging

  try {
    // Ensure the user has the correct role
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'You are not authorized to add products' });
    }

    const { name, price, inventory, minimumStockLevel } = req.body;

    // Validate request body
    if (!name || !price || !inventory || !minimumStockLevel) {
      return res.status(400).json({ message: 'All fields (name, price, inventory, minimumStockLevel) are required' });
    }

    // Create product
    const newProduct = await Product.create({
      name,
      price,
      inventory,
      minimumStockLevel,
      supplier: req.user._id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in addProduct controller:', error.message); // Log detailed error
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};




// Update product - Suppliers can update their own products only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own products' });
    }

    const { name, price, inventory, minimumStockLevel } = req.body;
    product.name = name || product.name;
    product.price = price || product.price;
    product.inventory = inventory || product.inventory;
    product.minimumStockLevel = minimumStockLevel || product.minimumStockLevel;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};


const deleteProduct = async (req, res) => {
  try {
    // Check if the product exists and if the user owns it
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the logged-in user is the supplier of the product
    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    // Use the deleteOne method to delete the product
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct controller:', error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};




// Suggest Products - Check if inventory is below minimum stock and suggest alternatives
const suggestProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const lowStockProducts = products.filter(
      (product) => product.inventory < product.minimumStockLevel
    );

    res.status(200).json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch suggestions', error });
  }
};

// Place Order - Allows users to place orders
const placeOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newOrder = await Order.create({
      product: product._id,
      quantity,
      supplier: product.supplier,
      orderedBy: req.user._id,
      status: 'Pending',
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
};

// Get Orders - View all orders made by the current user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderedBy: req.user._id }).populate('product', 'name');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  suggestProducts,
  placeOrder,
  getOrders,
};
