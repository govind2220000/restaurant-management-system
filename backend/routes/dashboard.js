const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Chef = require('../models/chef');
const Table = require('../models/table');

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalChefs = await Chef.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({ status: 'Processing' });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Count unique clients by phone number
    const uniqueClients = await Order.distinct('customer.phone');
    const totalClients = uniqueClients.length;

    // Get daily revenue for the past week
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get order summary by type
    const orderSummary = await Order.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          percentage: { $sum: 1 }
        }
      }
    ]);

    // Calculate percentages
    const totalOrderCount = await Order.countDocuments();
    orderSummary.forEach(item => {
      item.percentage = (item.count / totalOrderCount) * 100;
    });

    // Get order status summary
    const statusSummary = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          percentage: { $sum: 1 }
        }
      }
    ]);

    // Calculate percentages for status
    statusSummary.forEach(item => {
      item.percentage = (item.count / totalOrderCount) * 100;
    });

    // Get chef workload summary
    const chefs = await Chef.find().select('name currentWorkload estimatedAvailableAt');
    const chefWorkloads = await Promise.all(chefs.map(async (chef) => {
      const orderCount = await Order.countDocuments({
        chef: chef._id,
        status: 'Processing'
      });

      return {
        name: chef.name,
        currentWorkload: chef.currentWorkload,
        estimatedAvailableAt: chef.estimatedAvailableAt,
        orderCount
      };
    }));

    // Get table status summary as array of table objects
    const allTables = await Table.find().select('tableNumber isReserved').sort({ tableNumber: 1 });

    const tableStatusSummary = allTables.map(table => ({
      tableNumber: table.tableNumber,
      isReserved: table.isReserved
    }));

    res.json({
      totalChefs,
      totalOrders,
      activeOrders,
      totalRevenue,
      totalClients,
      dailyRevenue,
      orderSummary,
      statusSummary,
      chefWorkloads,
      tableStatusSummary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



