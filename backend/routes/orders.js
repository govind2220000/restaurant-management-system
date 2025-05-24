const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Table = require('../models/table');
const Chef = require('../models/chef');
const MenuItem = require('../models/menuItem');
const mongoose = require('mongoose');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .populate('table')
      .populate('chef');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('table')
      .populate('chef');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${(orderCount + 1).toString().padStart(4, '0')}`;
    
    // Validate that all menu items exist
    const menuItemIds = req.body.items.map(item => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    
    // Check if all menu items were found
    if (menuItems.length !== menuItemIds.length) {
      // Find which items don't exist
      const foundIds = menuItems.map(item => item._id.toString());
      const missingIds = menuItemIds.filter(id => !foundIds.includes(id.toString()));
      
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        error: `One or more menu items do not exist`,
        missingIds: missingIds
      });
    }
    
    // Auto-assign table for Dine In orders if no table is specified
    let tableId = req.body.table;
    
    if (req.body.type === 'Dine In' && !tableId) {
      // Find the first available table with smallest table number
      const availableTable = await Table.findOne({ 
        isReserved: false 
      })
      .sort({ tableNumber: 1 })
      .session(session);
      
      if (!availableTable) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'No tables available for dine-in order' });
      }
      
      tableId = availableTable._id;
      console.log(`Auto-assigned table ${availableTable.tableNumber} for dine-in order`);
    }
    
    // Create a map for quick lookup
    const menuItemMap = {};
    menuItems.forEach(item => {
      menuItemMap[item._id.toString()] = item;
    });
    
    // Calculate total preparation time and prices
    let totalPreparationTimeMinutes = 0;
    let subtotal = 0;
    let totalTax = 0;

    // Process items with prices from database
    const processedItems = [];

    for (const item of req.body.items) {
      const menuItem = menuItemMap[item.menuItem.toString()];
      if (menuItem) {
        // Calculate item price based on menu price and quantity
        const itemPrice = menuItem.price * item.quantity;
        
        // Calculate item tax if available
        const itemTax = menuItem.tax ? menuItem.tax * item.quantity : 0;
        
        // Add to processed items with correct price
        processedItems.push({
          menuItem: item.menuItem,
          quantity: item.quantity,
          price: itemPrice
        });
        
        // Add to subtotal and tax
        subtotal += itemPrice;
        totalTax += itemTax;
        
        // Add to preparation time - multiply by quantity
        const itemPrepTime = menuItem.preparationTimeMinutes * item.quantity;
        totalPreparationTimeMinutes += itemPrepTime;
        
        console.log(`Item: ${menuItem.name}, Quantity: ${item.quantity}, Prep Time: ${menuItem.preparationTimeMinutes} min/item, Total Item Prep Time: ${itemPrepTime} min`);
      } else {
        // This should never happen due to the check above, but keeping as a safeguard
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Menu item ${item.menuItem} not found` });
      }
    }

    console.log(`Total preparation time for all items: ${totalPreparationTimeMinutes} minutes`);
    
    // Calculate total
    const total = subtotal + totalTax;
    
    const orderData = {
      orderNumber,
      type: req.body.type,
      items: processedItems,
      table: tableId, // Use the auto-assigned table if applicable
      customer: req.body.customer,
      cookingInstructions: req.body.cookingInstructions,
      subtotal,
      tax: totalTax,
      total,
      totalPreparationTimeMinutes,
      status: 'Processing'
    };
    
    const order = new Order(orderData);
    
    // Find chef with the earliest availability time
    const chefs = await Chef.find()
      .sort({ estimatedAvailableAt: 1 })
      .limit(1)
      .session(session);

    if (chefs.length > 0) {
      const chef = chefs[0];
      order.chef = chef._id;
      
      // Current time
      const now = new Date();
      
      // Determine when the chef will actually start this order
      // Either now or when the chef becomes available, whichever is later
      const actualStartTime = new Date(Math.max(
        now.getTime(),
        chef.estimatedAvailableAt.getTime()
      ));
      
      // Set the order's start time
      order.startTime = actualStartTime;
      
      // Calculate estimated completion time based on actual start time
      const estimatedCompletionTime = new Date(
        actualStartTime.getTime() + totalPreparationTimeMinutes * 60000
      );
      order.estimatedCompletionTime = estimatedCompletionTime;
      
      // Update chef's orders and availability
      chef.currentOrders.push(order._id);
      
      // Don't increment ordersHandled here - will do it when order completes
      // chef.ordersHandled += 1;
      
      // Set chef as unavailable while they have orders
      chef.isAvailable = false;
      
      // Update chef's estimated available time to when this order will be completed
      chef.estimatedAvailableAt = estimatedCompletionTime;
      
      await chef.save({ session });
      
      // Calculate the delay before this order should be completed
      // This is the time difference between now and the estimated completion time
      const delayMs = estimatedCompletionTime.getTime() - now.getTime();
      
      // Schedule order completion with the correct delay
      setTimeout(async () => {
        await completeOrder(order._id);
      }, delayMs);
      
      console.log(`Assigned chef ${chef.name} to order. Will start at ${actualStartTime.toISOString()} and complete at ${estimatedCompletionTime.toISOString()}`);
    } else {
      console.log('No chefs found at all. Order will be created without chef assignment.');
    }
    
    // If dine-in, update table status
    if (order.type === 'Dine In' && order.table) {
      const tableUpdateResult = await Table.findByIdAndUpdate(
        order.table, 
        { 
          isReserved: true,
          currentOrder: order._id
        },
        { 
          session,
          new: true // Return the updated document
        }
      );
      
      if (!tableUpdateResult) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Table ${order.table} not found or could not be updated` });
      }
      
      console.log(`Table ${tableUpdateResult.tableNumber} reserved for order ${order.orderNumber}`);
    }
    
    await order.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    // Populate the response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem')
      .populate('table')
      .populate('chef');
    
    res.status(201).json(populatedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// Helper function to complete an order
async function completeOrder(orderId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const order = await Order.findById(orderId).session(session);
    
    if (!order) {
      console.log(`Order ${orderId} not found for completion`);
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    if (order.status !== 'Processing') {
      console.log(`Order ${order.orderNumber} is already ${order.status}, not completing again`);
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    console.log(`Completing order ${order.orderNumber}`);
    
    // Update order status to Done
    order.status = 'Done';
    order.completedAt = new Date();
    await order.save({ session });
    
    // Update chef availability
    if (order.chef) {
      const chef = await Chef.findById(order.chef).session(session);
      
      if (chef) {
        console.log(`Chef ${chef.name} had ${chef.currentOrders.length} orders before completion and ${chef.ordersHandled} orders handled`);
        
        // Increment ordersHandled when order is completed
        chef.ordersHandled += 1;
        
        console.log(`Chef ${chef.name} now has ${chef.ordersHandled} orders handled after completing order ${order.orderNumber}`);
        
        // Remove order from chef's current orders
        chef.currentOrders = chef.currentOrders.filter(
          currentOrderId => currentOrderId.toString() !== order._id.toString()
        );
        
        console.log(`Chef ${chef.name} now has ${chef.currentOrders.length} orders after removing completed order ${order.orderNumber}`);
        
        // Update chef's availability based on remaining orders
        if (chef.currentOrders.length === 0) {
          // If no more orders, chef is available now
          chef.isAvailable = true;
          chef.estimatedAvailableAt = new Date();
          console.log(`Chef ${chef.name} has no more orders and is now available`);
        } else {
          // Find the latest completion time among remaining orders
          const remainingOrders = await Order.find({
            _id: { $in: chef.currentOrders },
            status: 'Processing'
          }).sort({ estimatedCompletionTime: -1 }).limit(1).session(session);
          
          if (remainingOrders.length > 0) {
            chef.estimatedAvailableAt = remainingOrders[0].estimatedCompletionTime;
            console.log(`Chef ${chef.name} still has ${chef.currentOrders.length} orders. Next available at: ${chef.estimatedAvailableAt}`);
          } else {
            // Fallback if no processing orders found
            chef.isAvailable = true;
            chef.estimatedAvailableAt = new Date();
            console.log(`Chef ${chef.name} has no more processing orders and is now available`);
          }
        }
        
        await chef.save({ session });
      }
    }
    
    // Handle order completion based on type
    if (order.type === 'Dine In' && order.table) {
      // For Dine In orders, don't free up the table yet
      // The table will be freed when the order is marked as Served
      console.log(`Dine In order ${order.orderNumber} completed, table remains reserved until served`);
    } else if (order.type === 'Take Away') {
      // For Take Away orders, mark as ready for pickup
      console.log(`Take Away order ${order.orderNumber} completed, ready for pickup`);
    }
    
    await session.commitTransaction();
    console.log(`Order ${order.orderNumber} successfully completed`);
  } catch (error) {
    await session.abortTransaction();
    console.error(`Failed to complete order: ${error.message}`);
  } finally {
    session.endSession();
  }
}

// Update an order
router.put('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Get the original order
    const originalOrder = await Order.findById(req.params.id).session(session);
    
    if (!originalOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if status is being changed
    const statusChanged = req.body.status && req.body.status !== originalOrder.status;
    const beingCompleted = statusChanged && req.body.status === 'Done' && originalOrder.status === 'Processing';
    
    // If order is being completed, use the completeOrder function instead
    if (beingCompleted) {
      await session.abortTransaction();
      session.endSession();
      
      // Call completeOrder function
      await completeOrder(req.params.id);
      
      // Return the updated order
      const updatedOrder = await Order.findById(req.params.id)
        .populate('items.menuItem')
        .populate('table')
        .populate('chef');
      
      return res.json(updatedOrder);
    }
    
    // For other updates, proceed normally
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { status } = req.body;
    
    if (!status) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const order = await Order.findById(req.params.id).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If changing to Done from Processing, use completeOrder function
    if (status === 'Done' && order.status === 'Processing') {
      await session.abortTransaction();
      session.endSession();
      
      await completeOrder(req.params.id);
      
      const updatedOrder = await Order.findById(req.params.id)
        .populate('items.menuItem')
        .populate('table')
        .populate('chef');
      
      return res.json(updatedOrder);
    }
    
    // For other status changes
    order.status = status;
    
    // If status is Served and it's a Dine In order, free up the table
    if (status === 'Served' && order.type === 'Dine In' && order.table) {
      await Table.findByIdAndUpdate(
        order.table,
        {
          isReserved: false,
          currentOrder: null
        },
        { session }
      );
    }
    
    await order.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const order = await Order.findById(req.params.id).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Free up table if associated
    if (order.table) {
      await Table.findByIdAndUpdate(
        order.table, 
        {
          isReserved: false,
          currentOrder: null
        },
        { session }
      );
    }
    
    // Update chef's current orders and availability
    if (order.chef) {
      const chef = await Chef.findById(order.chef).session(session);
      
      if (chef) {
        // Remove order from chef's current orders
        chef.currentOrders = chef.currentOrders.filter(
          orderId => orderId.toString() !== order._id.toString()
        );
        
        // Update chef's availability based on remaining orders
        if (chef.currentOrders.length === 0) {
          // If no more orders, chef is available now
          chef.estimatedAvailableAt = new Date();
        } else {
          // Find the latest completion time among remaining orders
          const remainingOrders = await Order.find({
            _id: { $in: chef.currentOrders },
            status: 'Processing'
          }).sort({ estimatedCompletionTime: -1 }).limit(1).session(session);
          
          if (remainingOrders.length > 0) {
            chef.estimatedAvailableAt = remainingOrders[0].estimatedCompletionTime;
          } else {
            // Fallback if no processing orders found
            chef.estimatedAvailableAt = new Date();
          }
        }
        
        await chef.save({ session });
      }
    }
    
    await Order.findByIdAndDelete(order._id).session(session);
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



















