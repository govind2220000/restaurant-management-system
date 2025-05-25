import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

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
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="nav-items">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                 onClick={() => setActiveTab('dashboard')}>
              <div className="nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
            </div>
            <div className={`nav-item ${activeTab === 'seats' ? 'active' : ''}`}
                 onClick={() => setActiveTab('seats')}>
              <div className="nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9v5h2v-3h2v3h2v-3h2V7z"/>
                </svg>
              </div>
            </div>
            <div className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
                 onClick={() => setActiveTab('menu')}>
              <div className="nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
              </div>
            </div>
            <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                 onClick={() => setActiveTab('analytics')}>
              <div className="nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header with Search */}
        <div className="content-header">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <input type="text" placeholder="Filter..." className="search-input" />
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <h1 className="section-title">Analytics</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon chef-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5 2C13.81 2 15.29 3.42 15.29 5.14C15.29 6.86 13.81 8.29 12.5 8.29C11.19 8.29 9.71 6.86 9.71 5.14C9.71 3.42 11.19 2 12.5 2M12.5 9.14C14.73 9.14 16.57 7.3 16.57 5.07S14.73 1 12.5 1S8.43 2.84 8.43 5.07S10.27 9.14 12.5 9.14M7 22V20H18V22H7M8 18V16L12 15L16 16V18H8Z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">TOTAL CHEF</span>
                  <span className="stat-value">{dashboardData.totalChef.toString().padStart(2, '0')}</span>
                </div>

              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                 <div className="stat-icon revenue-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.47-3.31 3.5-3.82V3h3v2.18C15.53 5.69 17 7.21 17 9h-2c0-1.08-1.37-2-3-2s-3 .92-3 2c0 1.1 1.04 1.5 3.24 2.03C14.36 11.56 17 12.22 17 15c0 1.79-1.47 3.31-3.5 3.82V21h-3v-2.18C8.47 18.31 7 16.79 7 15z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">TOTAL REVENUE</span>
                  <span className="stat-value">{dashboardData.totalRevenue}</span>
                </div>

              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon orders-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">TOTAL ORDERS</span>
                  <span className="stat-value">{dashboardData.totalOrders.toString().padStart(2, '0')}</span>
                </div>

              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                 <div className="stat-icon clients-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2 1l-3.72 5.58L8.5 11.5C8.22 11.19 7.82 11 7.39 11H3v2h3.61l2 2L4 20h2l4.5-5.5L13 17h7zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">TOTAL CLIENTS</span>
                  <span className="stat-value">{dashboardData.totalClients.toString().padStart(2, '0')}</span>
                </div>

              </div>
            </div>
          </div>



          {/* Charts Section - 3 Column Layout */}
          <div className="charts-section">

            {/* Order Summary - Matching Figma Design */}
            <div className="chart-container order-summary">
              <div className="chart-header">
                <h3>Order Summary</h3>
                <div className="chart-controls">
                  <select className="time-selector">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Order Stats Cards */}
              <div className="order-stats-grid">
                <div className="order-stat-card">
                  <div className="stat-number">
                    {dashboardData.orderSummary.served.count.toString().padStart(2, '0')}
                  </div>
                  <div className="stat-label">Served</div>
                </div>

                <div className="order-stat-card">
                  <div className="stat-number">
                    {dashboardData.orderSummary.dineIn.count.toString().padStart(2, '0')}
                  </div>
                  <div className="stat-label">Dine In</div>
                </div>

                <div className="order-stat-card">
                  <div className="stat-number">
                    {dashboardData.orderSummary.takeAway.count.toString().padStart(2, '0')}
                  </div>
                  <div className="stat-label">Take Away</div>
                </div>
              </div>

              {/* Legend and Progress Bars */}
              <div className="order-summary-legend">
                <div className="legend-row">
                  <div className="legend-text">
                    <span className="legend-label">Take Away</span>
                    <span className="legend-percentage">({dashboardData.orderSummary.takeAway.percentage}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill takeaway"
                        style={{ width: `${dashboardData.orderSummary.takeAway.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="legend-row">
                  <div className="legend-text">
                    <span className="legend-label">Served</span>
                    <span className="legend-percentage">({dashboardData.orderSummary.served.percentage}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill served"
                        style={{ width: `${dashboardData.orderSummary.served.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="legend-row">
                  <div className="legend-text">
                    <span className="legend-label">Dine in</span>
                    <span className="legend-percentage">({dashboardData.orderSummary.dineIn.percentage}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill dinein"
                        style={{ width: `${dashboardData.orderSummary.dineIn.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Revenue Chart - Matching Figma Design */}
            <div className="chart-container revenue-chart">
              <div className="chart-header">
                <h3>Revenue</h3>
                <div className="chart-controls">
                  <div className="time-selector">
                    <span>Daily</span>
                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                      <path d="M5.63186 3.086L12 7.36379L18.3681 3.086L19.7279 4.44579L12 9.63621L4.27214 4.44579L5.63186 3.086Z" fill="#B9B8BE"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="chart-content">
                <div className="chart-bars">
                  {dashboardData.revenueData.map((item, index) => (
                    <div key={index} className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{ height: `${item.value}%` }}
                      ></div>
                      <span className="chart-label">{item.day}</span>
                    </div>
                  ))}
                </div>
                {/* Revenue trend line overlay */}
                <div className="chart-overlay">
                  <svg width="302" height="121" viewBox="0 0 302 121" fill="none" className="revenue-trend-line">
                    <path d="M40 47L82 35L124 55L166 25L208 40L250 30L292 45" stroke="#2A2A2A" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Table Booking Layout - Matching Figma Design */}
            <div className="chart-container table-booking">
              <div className="chart-header">
                <h3>Tables</h3>
              </div>
              <div className="table-legend">
                <div className="legend-item">
                  <div className="legend-color reserved"></div>
                  <span>Reserved</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color available"></div>
                  <span>Available</span>
                </div>
              </div>
              <div className="table-grid-container">
                <div className="table-grid">
                  {Array.from({ length: Math.ceil(dashboardData.tables.length / 7) }, (_, rowIndex) => (
                    <div key={rowIndex} className="table-row">
                      {dashboardData.tables
                        .slice(rowIndex * 7, (rowIndex + 1) * 7)
                        .map((table) => (
                          <div
                            key={table.id}
                            className={`table-item ${table.status}`}
                          >
                            <span className="table-number">
                              <span className="table-label">Table</span><br />{table.id.toString().padStart(2, '0')}
                            </span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>




          </div>

          {/* Chef Table Section - Matching Figma Design */}
          <div className="chef-table-section">
            <div className="chef-table-container">
              <table className="chef-table">
                <thead className="chef-table-head">
                  <tr>
                    <th className="chef-header-cell">Chef Name</th>
                    <th className="chef-header-cell">Order Taken</th>
                  </tr>
                </thead>
                <tbody className="chef-table-body">
                  {dashboardData.chefs.map((chef, index) => (
                    <tr key={index} className="chef-table-row">
                      <td className="chef-cell chef-name-cell">
                        {chef.name}
                      </td>
                      <td className="chef-cell chef-orders-cell">
                        {chef.totalOrders.toString().padStart(2, '0')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

