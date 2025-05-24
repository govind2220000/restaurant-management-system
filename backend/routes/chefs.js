const express = require('express');
const router = express.Router();
const Chef = require('../models/chef');
const Order = require('../models/order');

// Get all chefs
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find()
      .populate({
        path: 'currentOrders',
        populate: {
          path: 'items.menuItem'
        }
      });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chef by ID
router.get('/:id', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id)
      .populate({
        path: 'currentOrders',
        populate: {
          path: 'items.menuItem'
        }
      });
    
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    
    res.json(chef);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize default chefs
router.post('/init', async (req, res) => {
  try {
    const defaultChefs = [
      { name: 'Manesh' },
      { name: 'Pritam' },
      { name: 'Yash' },
      { name: 'Tenzen' }
    ];
    
    // Only add if no chefs exist
    const existingChefs = await Chef.countDocuments();
    if (existingChefs === 0) {
      await Chef.insertMany(defaultChefs);
      res.status(201).json({ message: 'Default chefs initialized' });
    } else {
      res.json({ message: 'Chefs already exist' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get chef workload details
router.get('/:id/workload', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    
    const orders = await Order.find({ 
      _id: { $in: chef.currentOrders },
      status: 'Processing'
    }).populate('items.menuItem');
    
    const workloadDetails = {
      chef: chef.name,
      currentWorkload: chef.currentWorkload,
      estimatedAvailableAt: chef.estimatedAvailableAt,
      orderCount: orders.length,
      orders: orders.map(order => ({
        orderNumber: order.orderNumber,
        items: order.items.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          preparationTimePerUnit: item.menuItem.preparationTimeMinutes,
          totalPreparationTime: item.menuItem.preparationTimeMinutes * item.quantity
        })),
        totalPreparationTime: order.totalPreparationTimeMinutes,
        startTime: order.startTime,
        estimatedCompletionTime: order.estimatedCompletionTime
      }))
    };
    
    res.json(workloadDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available chefs
router.get('/available', async (req, res) => {
  try {
    const availableChefs = await Chef.find({ isAvailable: true })
      .sort({ estimatedAvailableAt: 1 });
    
    const busyChefs = await Chef.find({ isAvailable: false })
      .sort({ estimatedAvailableAt: 1 });
    
    res.json({
      availableCount: availableChefs.length,
      availableChefs: availableChefs.map(chef => ({
        id: chef._id,
        name: chef.name,
        estimatedAvailableAt: chef.estimatedAvailableAt
      })),
      busyCount: busyChefs.length,
      busyChefs: busyChefs.map(chef => ({
        id: chef._id,
        name: chef.name,
        currentOrderCount: chef.currentOrders.length,
        estimatedAvailableAt: chef.estimatedAvailableAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;




