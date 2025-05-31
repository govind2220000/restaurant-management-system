import axios from 'axios';

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Helper function for error handling
function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
  } else if (error.request) {
    // Network error
    throw new Error('Network error - please check your connection');
  } else {
    // Other error
    throw new Error(error.message || 'Unknown error occurred');
  }
}

/**
 * Get comprehensive dashboard analytics
 * @param {string} timePeriod - Time period filter ('daily', 'weekly', 'monthly')
 * @returns {Promise} - Dashboard analytics data
 */
export async function getAnalytics(timePeriod = 'daily') {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/dashboard/analytics`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    // Transform backend data to match frontend expectations
    return transformAnalyticsData(response.data, timePeriod);
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    handleApiError(error);
  }
}

/**
 * Transform backend analytics data to frontend format
 * @param {Object} backendData - Raw data from backend
 * @param {string} timePeriod - Selected time period ('daily', 'weekly', 'monthly')
 * @returns {Object} - Transformed data for frontend
 */
function transformAnalyticsData(backendData, timePeriod = 'daily') {
    return {
      // Basic stats
      totalChef: backendData.totalChefs || 0,
      totalRevenue: formatRevenue(backendData.totalRevenue || 0),
      totalOrders: backendData.totalOrders || 0,
      totalClients: backendData.totalClients || 0,

      // Revenue chart data - transform to match existing component expectations
      revenueData: transformRevenueData(backendData.revenueData, timePeriod),

      // Table data - transform backend table status to frontend format
      tables: transformTableData(backendData.tableStatusSummary),

      // Order summary - transform to match existing component expectations
      orderSummary: transformOrderSummary(backendData.orderSummary, timePeriod),

      // Chef data - transform to match existing component expectations
      chefs: transformChefData(backendData.chefSummary),

      // Metadata
      lastUpdated: backendData.lastUpdated,
      currentTimePeriod: timePeriod
    };
  }

/**
 * Transform revenue data for chart display
 * @param {Object} revenueData - Backend revenue data
 * @param {string} timePeriod - Selected time period ('daily', 'weekly', 'monthly')
 * @returns {Array} - Chart-ready revenue data
 */
function transformRevenueData(revenueData, timePeriod = 'daily') {
    if (!revenueData) {
      return getEmptyRevenueData(timePeriod);
    }

    switch (timePeriod) {
      case 'daily':
        return transformDailyRevenue(revenueData.daily || []);
      case 'weekly':
        return transformWeeklyRevenue(revenueData.weekly || []);
      case 'monthly':
        return transformMonthlyRevenue(revenueData.monthly || []);
      default:
        return transformDailyRevenue(revenueData.daily || []);
    }
  }

/**
 * Get empty revenue data structure based on time period
 */
function getEmptyRevenueData(timePeriod) {
    switch (timePeriod) {
      case 'daily':
        return [
          { day: 'Mon', value: 0 },
          { day: 'Tue', value: 0 },
          { day: 'Wed', value: 0 },
          { day: 'Thur', value: 0 },
          { day: 'Fri', value: 0 },
          { day: 'Sat', value: 0 },
          { day: 'Sun', value: 0 }
        ];
      case 'weekly':
        return [
          { day: 'W1', value: 0 },
          { day: 'W2', value: 0 },
          { day: 'W3', value: 0 },
          { day: 'W4', value: 0 }
        ];
      case 'monthly':
        return [
          { day: 'Jan', value: 0 },
          { day: 'Feb', value: 0 },
          { day: 'Mar', value: 0 },
          { day: 'Apr', value: 0 },
          { day: 'May', value: 0 },
          { day: 'Jun', value: 0 }
        ];
      default:
        return [];
    }
  }

/**
 * Transform daily revenue data
 */
function transformDailyRevenue(dailyData) {
    if (!dailyData || dailyData.length === 0) {
      return getEmptyRevenueData('daily');
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return dailyData.slice(-7).map((item) => {
      const date = new Date(item.date);
      const dayName = dayNames[date.getDay()];
      return {
        day: dayName,
        value: Math.round(item.revenue) || 0
      };
    });
  }

/**
 * Transform weekly revenue data
 */
function transformWeeklyRevenue(weeklyData) {
    if (!weeklyData || weeklyData.length === 0) {
      return getEmptyRevenueData('weekly');
    }

    return weeklyData.slice(-4).map((item, index) => ({
      day: `W${index + 1}`,
      value: Math.round(item.revenue) || 0
    }));
  }

/**
 * Transform monthly revenue data
 */
function transformMonthlyRevenue(monthlyData) {
    if (!monthlyData || monthlyData.length === 0) {
      return getEmptyRevenueData('monthly');
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthlyData.slice(-6).map((item) => {
      const monthIndex = item.period.month - 1;
      return {
        day: monthNames[monthIndex],
        value: Math.round(item.revenue) || 0
      };
    });
  }

/**
 * Transform table data from backend format
 * @param {Array} tableStatusSummary - Backend table data
 * @returns {Array} - Frontend table data
 */
function transformTableData(tableStatusSummary) {
    if (!tableStatusSummary || !Array.isArray(tableStatusSummary)) {
      // Return empty table data if no backend data - all tables available
      return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        status: 'available'
      }));
    }

    return tableStatusSummary.map(table => ({
      id: table.tableNumber,
      status: table.isReserved ? 'reserved' : 'available'
    }));
  }

/**
 * Transform order summary data
 * @param {Object} orderSummary - Backend order summary
 * @param {string} timePeriod - Selected time period ('daily', 'weekly', 'monthly')
 * @returns {Object} - Frontend order summary
 */
function transformOrderSummary(orderSummary, timePeriod = 'daily') {
    if (!orderSummary) {
      return {
        served: { count: 0, percentage: 0 },
        dineIn: { count: 0, percentage: 0 },
        takeAway: { count: 0, percentage: 0 }
      };
    }

    // Select the appropriate time period data
    let periodData;
    switch (timePeriod) {
      case 'daily':
        periodData = orderSummary.daily;
        break;
      case 'weekly':
        periodData = orderSummary.weekly;
        break;
      case 'monthly':
        periodData = orderSummary.monthly;
        break;
      default:
        periodData = orderSummary.overall;
    }

    // Fallback to overall if period data doesn't exist
    if (!periodData) {
      periodData = orderSummary.overall;
    }

    if (!periodData) {
      return {
        served: { count: 0, percentage: 0 },
        dineIn: { count: 0, percentage: 0 },
        takeAway: { count: 0, percentage: 0 }
      };
    }

    const byType = periodData.byType || {};
    const byStatus = periodData.byStatus || {};

    // Calculate total orders for percentage calculation (from byStatus)
    const totalOrdersByStatus = Object.values(byStatus).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0);

    // Calculate total orders for byType (should be same as byStatus total)
    const totalOrdersByType = Object.values(byType).reduce((sum, item) => {
      const count = typeof item === 'object' ? item.count : (typeof item === 'number' ? item : 0);
      return sum + count;
    }, 0);

    // Helper function to normalize data structure
    const normalizeData = (data, total) => {
      if (typeof data === 'object' && data.count !== undefined) {
        // Already in correct format (byType data)
        return data;
      } else if (typeof data === 'number') {
        // Convert number to object with percentage (byStatus data)
        return {
          count: data,
          percentage: total > 0 ? Math.round((data / total) * 100) : 0
        };
      } else {
        // Default fallback
        return { count: 0, percentage: 0 };
      }
    };

    const result = {
      // Map "Done" status to "Served" for display - use byStatus total for percentage
      served: normalizeData(byStatus.Done, totalOrdersByStatus),
      // Map order types correctly - these already have percentages
      dineIn: normalizeData(byType['Dine In'], totalOrdersByType),
      takeAway: normalizeData(byType['Take Away'], totalOrdersByType)
    };

    return result;
  }

/**
 * Transform chef data
 * @param {Array} chefSummary - Backend chef data
 * @returns {Array} - Frontend chef data
 */
function transformChefData(chefSummary) {
    if (!chefSummary || !Array.isArray(chefSummary)) {
      // Return empty chef data if no backend data
      return [];
    }

    return chefSummary.map(chef => ({
      name: chef.name,
      totalOrders: chef.ordersHandled || 0,
      currentOrders: chef.currentOrders || 0,
      estimatedAvailableAt: chef.estimatedAvailableAt
    }));
  }

/**
 * Format revenue for display
 * @param {number} revenue - Raw revenue number
 * @returns {string} - Formatted revenue string
 */
function formatRevenue(revenue) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(revenue);
}

/**
 * Get dashboard analytics (alias for getAnalytics for backward compatibility)
 * @returns {Promise} - Dashboard analytics data
 */
export async function getAnalyticsByPeriod() {
  return getAnalytics();
}
