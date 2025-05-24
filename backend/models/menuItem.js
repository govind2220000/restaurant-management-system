const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true // Add unique constraint
  },
  price: { type: Number, required: true },
  tax: { type: Number, default: 0 }, // Added tax field with default 0
  category: { 
    type: String, 
    required: true,
    enum: ['Drink', 'Burger', 'Pizza', 'French Fries', 'Veggies'] 
  },
  description: String,
  image: String,
  preparationTimeMinutes: { type: Number, default: 10 }
}, { timestamps: true });

// Add error handling middleware for duplicate key errors
menuItemSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error(`A menu item with name "${doc.name}" already exists`));
  } else {
    next(error);
  }
});

// Add similar error handling for update operations
menuItemSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A menu item with that name already exists'));
  } else {
    next(error);
  }
});

menuItemSchema.post('findOneAndUpdate', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A menu item with that name already exists'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);



