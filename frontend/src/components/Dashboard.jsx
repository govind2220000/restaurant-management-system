import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Sidebar from './Sidebar';
import SearchHeader from './SearchHeader';
import StatsGrid from './StatsGrid';
import ChartsSection from './ChartsSection';
import ChefTable from './ChefTable';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [dashboardData, setDashboardData] = useState({
    totalChef: 4,
    totalRevenue: '12K',
    totalOrders: 20,
    totalClients: 65,
    revenueData: [
      { day: 'Mon', value: 40 },
      { day: 'Tue', value: 65 },
      { day: 'Wed', value: 30 },
      { day: 'Thur', value: 80 },
      { day: 'Fri', value: 55 },
      { day: 'Sat', value: 70 },
      { day: 'Sun', value: 45 }
    ],
    tables: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.6 ? 'reserved' : 'available'
    })),
    orderSummary: {
      served: { count: 9, percentage: 41 },
      dineIn: { count: 5, percentage: 39 },
      takeAway: { count: 6, percentage: 24 }
    },
    chefs: [
      {
        name: 'Manesh',
        totalOrders: 3
      },
      {
        name: 'Pritam',
        totalOrders: 7
      },
      {
        name: 'Yash',
        totalOrders: 5
      },
      {
        name: 'Tenzen',
        totalOrders: 8
      }
    ]
  });

  useEffect(() => {
    // Simulate data fetching
    const fetchDashboardData = async () => {
      try {
        // Mock API call - replace with actual endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update with fresh data
        setDashboardData(prev => ({
          ...prev,
          tables: prev.tables.map(table => ({
            ...table,
            status: Math.random() > 0.6 ? 'reserved' : 'available'
          })),
          // Simulate stats updates
          totalClients: Math.floor(Math.random() * 20) + 60,
          // Simulate order summary updates
          orderSummary: {
            served: {
              count: Math.floor(Math.random() * 5) + 7,
              percentage: Math.floor(Math.random() * 10) + 35
            },
            dineIn: {
              count: Math.floor(Math.random() * 3) + 4,
              percentage: Math.floor(Math.random() * 10) + 35
            },
            takeAway: {
              count: Math.floor(Math.random() * 4) + 5,
              percentage: Math.floor(Math.random() * 10) + 20
            }
          }
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate table statistics for potential future use
  // const availableTables = dashboardData.tables.filter(table => table.status === 'available').length;
  // const reservedTables = dashboardData.tables.filter(table => table.status === 'reserved').length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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

