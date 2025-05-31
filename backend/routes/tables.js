const express = require('express');
const router = express.Router();
const Table = require('../models/table');
const mongoose = require('mongoose');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('currentOrder').sort({ tableNumber: 1 });

    // Transform data to match frontend expectations
    const formattedTables = tables.map(table => ({
      id: table._id,
      number: table.tableNumber.replace('T', ''), // Remove 'T' prefix for display
      name: table.name, // Include table name
      capacity: table.capacity,
      seats: table.capacity, // Alias for backward compatibility
      status: table.isReserved ? 'reserved' : 'available',
      isReserved: table.isReserved,
      currentOrder: table.currentOrder,
      createdAt: table.createdAt,
      updatedAt: table.updatedAt
    }));

    res.json({
      success: true,
      data: formattedTables,
      count: formattedTables.length
    });
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tables',
      message: err.message
    });
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
        { name: { $regex: query, $options: 'i' } }, // Search by table name
        { isReserved: query.toLowerCase() === 'reserved' ? true :
                      query.toLowerCase() === 'available' ? false : undefined }
      ]
    }).populate('currentOrder');

    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search table by table number
router.get('/number/:tableNumber', async (req, res) => {
  try {
    const tableNumber = req.params.tableNumber.toUpperCase();
    // Add 'T' prefix if not provided
    const formattedTableNumber = tableNumber.startsWith('T') ? tableNumber : `T${tableNumber}`;
    
    const table = await Table.findOne({ tableNumber: formattedTableNumber }).populate('currentOrder');
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    // Format the response to match frontend expectations
    const formattedTable = {
      id: table._id,
      number: table.tableNumber.replace('T', ''),
      name: table.name,
      capacity: table.capacity,
      seats: table.capacity,
      status: table.isReserved ? 'reserved' : 'available',
      isReserved: table.isReserved,
      currentOrder: table.currentOrder,
      createdAt: table.createdAt,
      updatedAt: table.updatedAt
    };

    res.json({
      success: true,
      data: formattedTable
    });
  } catch (err) {
    console.error('Error searching table by number:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to search table',
      message: err.message
    });
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
      name: req.body.name || undefined, // Include optional table name
      capacity: req.body.capacity,
      isReserved: false,
      currentOrder: null
    });

    await table.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: table,
      message: 'Table created successfully'
    });
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the table to be deleted
    const tableToDelete = await Table.findById(req.params.id).session(session);

    if (!tableToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if table is currently in use
    if (tableToDelete.isReserved) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Cannot delete a table that is currently reserved' });
    }

    // Get the table number of the deleted table
    const deletedTableNumber = tableToDelete.tableNumber;
    console.log(`Deleting table ${deletedTableNumber}`);

    // Delete the table
    await Table.findByIdAndDelete(req.params.id).session(session);

    // Find all tables with higher numbers to reorder them
    const tablesForReordering = await Table.find({
      tableNumber: { $gt: deletedTableNumber }
    }).sort({ tableNumber: 1 }).session(session);

    console.log(`Found ${tablesForReordering.length} tables to reorder after deleting ${deletedTableNumber}`);

    // Reorder the remaining tables
    for (const table of tablesForReordering) {
      // Extract the numeric part of the current table number
      const currentMatch = table.tableNumber.match(/T(\d+)/);

      if (currentMatch && currentMatch[1]) {
        const currentNumber = parseInt(currentMatch[1]);
        // Decrement the number and format with leading zeros
        const newNumber = (currentNumber - 1).toString().padStart(2, '0');
        const newTableNumber = `T${newNumber}`;

        console.log(`Renumbering table from ${table.tableNumber} to ${newTableNumber}`);

        // Update the table number
        table.tableNumber = newTableNumber;
        await table.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: 'Table deleted successfully',
      data: {
        deletedTable: deletedTableNumber,
        reorderedTables: tablesForReordering.length
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


