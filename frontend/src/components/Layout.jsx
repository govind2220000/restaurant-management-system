import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchHeader from './SearchHeader';
import '../styles/Dashboard.css';

function Layout() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar Container */}
      <div className="sidebar-container">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header with Search */}
        <SearchHeader />

        {/* Dynamic Content Area */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
