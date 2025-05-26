import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Sidebar from './Sidebar';
import SearchHeader from './SearchHeader';
import StatsGrid from './StatsGrid';
import ChartsSection from './ChartsSection';
import ChefTable from './ChefTable';
import { getAnalytics } from '../api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
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

  // Function to fetch basic dashboard data (no time period dependency)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic dashboard data from API (default time period)
      const data = await getAnalytics('daily');
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);

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
    fetchDashboardData();
    const intervalId = setInterval(() => fetchDashboardData(), 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate table statistics for potential future use
  // const availableTables = dashboardData.tables.filter(table => table.status === 'available').length;
  // const reservedTables = dashboardData.tables.filter(table => table.status === 'reserved').length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Container */}
      <div className="sidebar-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header with Search */}
        <SearchHeader />

        {/* Analytics Section */}
        <div className="analytics-section">
          <h1 className="section-title">Analytics</h1>

          {/* Stats Cards */}
          <StatsGrid dashboardData={dashboardData} />



          {/* Charts Section - 3 Column Layout */}
          <ChartsSection dashboardData={dashboardData} />

          {/* Chef Table Section - Matching Figma Design */}
          <ChefTable chefs={dashboardData.chefs} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

