import React from 'react';

function StatsGrid({ dashboardData }) {
  return (
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
  );
}

export default StatsGrid;
