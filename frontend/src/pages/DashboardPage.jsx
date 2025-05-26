import React, { useState, useEffect } from 'react';
import StatsGrid from '../components/StatsGrid';
import ChartsSection from '../components/ChartsSection';
import ChefTable from '../components/ChefTable';

function DashboardPage() {
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
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-section">
      <h1 className="section-title">Analytics</h1>

      {/* Stats Cards */}
      <StatsGrid dashboardData={dashboardData} />

      {/* Charts Section - 3 Column Layout */}
      <ChartsSection dashboardData={dashboardData} />

      {/* Chef Table Section - Matching Figma Design */}
      <ChefTable chefs={dashboardData.chefs} />
    </div>
  );
}

export default DashboardPage;
