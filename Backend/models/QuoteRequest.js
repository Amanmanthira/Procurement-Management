// models/QuoteRequest.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema with supplierName
const QuoteRequestSchema = new Schema({
  supplierId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model for the supplier
    required: true 
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Reference to the Product model
        required: true 
      },
      productName: { 
        type: String 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
    },
  ],
  date: { 
    type: Date, 
    required: true 
  },
  status: {   
    type: String,
    default: 'Pending',  
    required: true 

  },
});


module.exports = mongoose.model('QuoteRequest' , QuoteRequestSchema);


