const mongoose = require('mongoose');

const AcceptedQuotationSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String },
    quantity: { type: Number, required: true }
  }],
  date: { type: Date, required: true },
  status: { type: String, default: 'Accepted', required: true }
});

module.exports = mongoose.model('AcceptedQuotation', AcceptedQuotationSchema);
