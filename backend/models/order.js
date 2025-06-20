const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Dine In', 'Take Away'], required: true },
  status: { 
    type: String, 
    enum: ['Processing', 'Done', 'Served', 'Not Picked Up'], 
    default: 'Processing' 
  },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  customer: {
    name: { 
      type: String,
      required: [function() { return this.type === 'Take Away'; }, 'Customer name is required for Take Away orders']
    },
    phone: { 
      type: String,
      required: [function() { return this.type === 'Take Away'; }, 'Phone number is required for Take Away orders']
    },
    address: { 
      type: String,
      required: [function() { return this.type === 'Take Away'; }, 'Address is required for Take Away orders']
    }
  },
  cookingInstructions: String,
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },
  startTime: { type: Date, default: Date.now },
  estimatedCompletionTime: { type: Date },
  totalPreparationTimeMinutes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);



