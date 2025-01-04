const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  supplierId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
});

// Check if the model is already compiled
const Quote = mongoose.models.QuoteRequest || mongoose.model('QuoteRequest', QuoteSchema);

module.exports = Quote;
