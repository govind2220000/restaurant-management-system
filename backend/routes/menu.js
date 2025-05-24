const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ category: req.params.category });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new menu item
router.post('/', async (req, res) => {
  try {
    // Check if a menu item with the same name already exists
    const existingItem = await MenuItem.findOne({ name: req.body.name });
    if (existingItem) {
      return res.status(400).json({ error: `A menu item with name "${req.body.name}" already exists` });
    }
    
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk create menu items
router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of menu items' });
    }

    const results = {
      success: [],
      errors: []
    };

    // Process each item
    for (const item of req.body) {
      try {
        // Check if a menu item with the same name already exists
        const existingItem = await MenuItem.findOne({ name: item.name });
        if (existingItem) {
          results.errors.push({
            item: item.name,
            error: `A menu item with name "${item.name}" already exists`
          });
          continue;
        }
        
        const menuItem = new MenuItem(item);
        const savedItem = await menuItem.save();
        results.success.push(savedItem);
      } catch (itemErr) {
        results.errors.push({
          item: item.name || 'Unknown item',
          error: itemErr.message
        });
      }
    }

    // Return appropriate status code based on results
    if (results.errors.length === 0) {
      res.status(201).json(results);
    } else if (results.success.length === 0) {
      res.status(400).json(results);
    } else {
      res.status(207).json(results); // 207 Multi-Status
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a menu item
router.put('/:id', async (req, res) => {
  try {
    // If name is being updated, check for duplicates
    if (req.body.name) {
      const existingItem = await MenuItem.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id } // Exclude current item
      });
      
      if (existingItem) {
        return res.status(400).json({ error: `A menu item with name "${req.body.name}" already exists` });
      }
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search menu items
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

