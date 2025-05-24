const express = require('express');
const router = express.Router();
const Table = require('../models/table');
const mongoose = require('mongoose');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('currentOrder');
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get table by ID
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('currentOrder');
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search tables
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const tables = await Table.find({
      $or: [
        { tableNumber: { $regex: query, $options: 'i' } },
        { isReserved: query.toLowerCase() === 'reserved' ? true : 
                      query.toLowerCase() === 'available' ? false : undefined }
      ]
    }).populate('currentOrder');
    
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new table
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validate capacity is provided
    if (!req.body.capacity || isNaN(req.body.capacity)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Table capacity is required and must be a number" });
    }
    
    // Find the highest existing table number
    const highestTable = await Table.findOne({}, { tableNumber: 1 })
      .sort({ tableNumber: -1 })
      .session(session);
    
    let nextTableNumber;
    
    if (highestTable) {
      // Extract the numeric part of the highest table number
      const match = highestTable.tableNumber.match(/T(\d+)/);
      if (match && match[1]) {
        // Increment the number and format with leading zeros
        const nextNumber = (parseInt(match[1]) + 1).toString().padStart(2, '0');
        nextTableNumber = `T${nextNumber}`;
      } else {
        // Fallback if the format doesn't match
        nextTableNumber = 'T01';
      }
    } else {
      // No tables exist yet, start with T01
      nextTableNumber = 'T01';
    }
    
    // Create the table with the generated table number
    const table = new Table({
      tableNumber: nextTableNumber,
      capacity: req.body.capacity,
      isReserved: false,
      currentOrder: null
    });
    
    await table.save({ session });
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(table);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// Update a table
router.put('/:id', async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a table
router.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

