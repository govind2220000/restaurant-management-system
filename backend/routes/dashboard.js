const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Chef = require('../models/chef');
const Table = require('../models/table');

// GET /api/dashboard/analytics - Get comprehensive dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const now = new Date();

    // Get total number of chefs
    const totalChefs = await Chef.countDocuments();

    // Get total number of orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['Done', 'Served'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get total clients (unique customers by phone)
    const uniqueClients = await Order.distinct('customer.phone');
    const totalClients = uniqueClients.length;

    // Generate comprehensive revenue data for different time periods
    const revenueData = await generateRevenueData();

    // Generate comprehensive order summary with time-based filtering support
    const orderSummary = await generateOrderSummary();

    // Get chef summary with orders handled and current workload
    const chefSummary = await Chef.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'currentOrders',
          foreignField: '_id',
          as: 'currentOrderDetails'
        }
      },
      {
        $project: {
          name: 1,
          ordersHandled: 1,
          currentOrders: { $size: '$currentOrderDetails' },
          estimatedAvailableAt: 1
        }
      },
      { $sort: { name: 1 } }
    ]);

    // Get table status summary as array of table objects
    const allTables = await Table.find().select('tableNumber isReserved').sort({ tableNumber: 1 });

    const tableStatusSummary = allTables.map(table => ({
      tableNumber: table.tableNumber,
      isReserved: table.isReserved
    }));

    res.json({
      totalChefs,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalClients,
      revenueData,
      orderSummary,
      chefSummary,
      tableStatusSummary,
      lastUpdated: now.toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate revenue data for different time periods
async function generateRevenueData() {
  const now = new Date();

  // Daily revenue for last 7 days
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Done', 'Served'] },
        createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$total' },
        date: { $first: '$createdAt' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  // Weekly revenue for last 8 weeks
  const weeklyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Done', 'Served'] },
        createdAt: { $gte: new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        },
        revenue: { $sum: '$total' },
        startDate: { $min: '$createdAt' }
      }
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } }
  ]);

  // Monthly revenue for last 12 months
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Done', 'Served'] },
        createdAt: { $gte: new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$total' },
        startDate: { $min: '$createdAt' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    daily: dailyRevenue.map(item => ({
      period: item._id,
      revenue: Math.round(item.revenue * 100) / 100,
      date: item.date || item.startDate
    })),
    weekly: weeklyRevenue.map(item => ({
      period: item._id,
      revenue: Math.round(item.revenue * 100) / 100,
      startDate: item.startDate
    })),
    monthly: monthlyRevenue.map(item => ({
      period: item._id,
      revenue: Math.round(item.revenue * 100) / 100,
      startDate: item.startDate
    }))
  };
}

// Helper function to generate order summary with time-based filtering support
async function generateOrderSummary() {
  const now = new Date();

  // Calculate date boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Debug logging
  console.log('Order Summary Date Boundaries:');
  console.log('Now:', now.toISOString());
  console.log('Start of Today:', startOfToday.toISOString());
  console.log('End of Today:', endOfToday.toISOString());
  console.log('Last 7 Days:', last7Days.toISOString());
  console.log('Last 30 Days:', last30Days.toISOString());

  // Daily orders (today only)
  const dailyOrders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfToday,
          $lt: endOfToday
        }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);

  // Weekly orders (last 7 days rolling)
  const weeklyOrders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last7Days }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);

  // Monthly orders (last 30 days rolling)
  const monthlyOrders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days }
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);

  // Debug logging for query results
  console.log('Daily Orders Query Result:', dailyOrders);
  console.log('Weekly Orders Query Result:', weeklyOrders);
  console.log('Monthly Orders Query Result:', monthlyOrders);

  // Process order data into structured format with percentages
  const processOrderData = (orders) => {
    const summary = { byType: {}, byStatus: {} };
    let totalCount = 0;

    orders.forEach(item => {
      const { type, status } = item._id;
      const count = item.count;

      if (!summary.byType[type]) summary.byType[type] = 0;
      if (!summary.byStatus[status]) summary.byStatus[status] = 0;

      summary.byType[type] += count;
      summary.byStatus[status] += count;
      totalCount += count;
    });

    // Calculate percentages for order types
    Object.keys(summary.byType).forEach(type => {
      const count = summary.byType[type];
      summary.byType[type] = {
        count: count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
      };
    });

    return summary;
  };

  const result = {
    daily: processOrderData(dailyOrders),
    weekly: processOrderData(weeklyOrders),
    monthly: processOrderData(monthlyOrders),
    overall: processOrderData(await Order.aggregate([
      {
        $group: {
          _id: { type: '$type', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]))
  };

  console.log('Final Order Summary Result:', JSON.stringify(result, null, 2));
  return result;
}

module.exports = router;



