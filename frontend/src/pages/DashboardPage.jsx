import React, { useState, useEffect } from 'react';
import StatsGrid from '../components/StatsGrid';
import ChartsSection from '../components/ChartsSection';
import ChefTable from '../components/ChefTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAnalytics } from '../api';

function DashboardPage() {
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
    const interval = setInterval(() => fetchDashboardData(), 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="section-title">Analytics</h1>
        <div className="dashboard-loading">
          <LoadingSpinner message="Loading dashboard data..." size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="section-title">Analytics</h1>

      {/* Stats Cards */}
      <StatsGrid dashboardData={dashboardData} />

      {/* Charts Section - 3 Column Layout */}
      <ChartsSection dashboardData={dashboardData} />

      {/* Chef Table Section - Matching Figma Design */}
      <ChefTable chefs={dashboardData.chefs} />
    </>
  );
}

export default DashboardPage;
