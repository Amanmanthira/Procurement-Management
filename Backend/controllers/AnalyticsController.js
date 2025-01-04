const Product = require('../models/Product'); 
const AcceptedQuotation = require('../models/AcceptedQuotations');


const getProductCount = async (req, res) => {
    try {
      const count = await Product.countDocuments();
      res.status(200).json(count);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product count' });
    }
  };