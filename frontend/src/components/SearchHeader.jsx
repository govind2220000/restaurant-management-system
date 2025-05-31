import React from 'react';
import { Link } from 'react-router-dom';
import { AdminDashboardFilterIcon } from '../assets/icons/AdminDashboardFilterIcon';

function SearchHeader() {
  return (
    <div className="content-header">
      <div className="search-container">
        <div className="search-input-wrapper" style={{ backgroundColor: '#FFFFFF' }}>
          
          <input type="text" placeholder="Filter..." className="search-input" />
          <div className="search-icon">
            <AdminDashboardFilterIcon />
          </div>
        </div>
      </div>
      <div className="header-nav">
        <Link to="/client" className="client-link">Client View</Link>
      </div>
    </div>
  );
}

export default SearchHeader;
