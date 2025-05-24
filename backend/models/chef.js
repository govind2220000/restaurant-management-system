const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ordersHandled: { type: Number, default: 0 },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isAvailable: { type: Boolean, default: true },
  estimatedAvailableAt: { type: Date, default: Date.now },
  currentWorkload: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Chef', chefSchema);




