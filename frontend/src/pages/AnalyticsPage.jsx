import { useState, useEffect } from 'react';
import OrderSummary from '../components/OrderSummary';
import RevenueChart from '../components/RevenueChart';
import TableBooking from '../components/TableBooking';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAnalytics } from '../api';
import '../styles/Analytics.css';

function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState({
    totalChef: 0,
    totalRevenue: '0',
    totalOrders: 0,
    totalClients: 0,
    revenueData: [],
    tables: [],
    orderSummary: {
      served: { count: 0, percentage: 0 },
      dineIn: { count: 0, percentage: 0 },
      takeAway: { count: 0, percentage: 0 }
    },
    chefs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalytics();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data');

      // Fallback to empty data on error - no fake data
      setDashboardData({
        totalChef: 0,
        totalRevenue: '0',
        totalOrders: 0,
        totalClients: 0,
        revenueData: [
          { day: 'Mon', value: 0 },
          { day: 'Tue', value: 0 },
          { day: 'Wed', value: 0 },
          { day: 'Thur', value: 0 },
          { day: 'Fri', value: 0 },
          { day: 'Sat', value: 0 },
          { day: 'Sun', value: 0 }
        ],
        tables: Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          status: 'available'
        })),
        orderSummary: {
          served: { count: 0, percentage: 0 },
          dineIn: { count: 0, percentage: 0 },
          takeAway: { count: 0, percentage: 0 }
        },
        chefs: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="section-title">Analytics</h1>
        <div className="analytics-loading">
          <LoadingSpinner message="Loading analytics data..." size="large" />
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <h1 className="section-title">Analytics</h1>
        <div className="error-container">
          <div className="error-message">
            Error: {error}
            <button onClick={fetchAnalyticsData} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="section-title">Analytics</h1>

      {/* Charts Section - 3 Column Layout */}
      <div className="charts-section">
        <OrderSummary />
        <RevenueChart />
        <TableBooking tables={dashboardData.tables} />
      </div>
    </>
  );
}

export default AnalyticsPage;
