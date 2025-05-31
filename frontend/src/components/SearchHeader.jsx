import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AdminDashboardFilterIcon } from '../assets/icons/AdminDashboardFilterIcon';
import { useAdminSearch } from '../context/AdminSearchContext';

function SearchHeader() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchQuery,
    setSearchQuery,
    searchTables,
    searchOrders,
    error,
    clearSearch
  } = useAdminSearch();

  const filterOptions = [
    { name: 'Tables', path: '/admin/seats' },
    { name: 'Orders', path: '/admin/order-line' },
    { name: 'Analytics', path: '/admin/analytics' }
  ];

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleOptionClick = (path) => {
    // Always clear search when navigating
    clearSearch();
    navigate(path);
    setShowFilter(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Use effect to handle search with debounce
  useEffect(() => {
    // Skip the effect if the path is not searchable
    if (location.pathname !== '/admin/seats' && location.pathname !== '/admin/order-line') {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (location.pathname === '/admin/seats') {
        searchTables(searchQuery);
      } else if (location.pathname === '/admin/order-line') {
        searchOrders(searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, location.pathname, searchTables, searchOrders]);

  // Determine if we should show search input
  const showSearch = location.pathname === '/admin/seats' || location.pathname === '/admin/order-line';

  return (
    <div className="content-header">
      <div className="search-container">
        <div className="search-input-wrapper" style={{ backgroundColor: '#FFFFFF' }}>
          <input 
            type="text" 
            placeholder={showSearch ? (
              location.pathname === '/admin/seats' 
                ? "Search by table number..." 
                : "Search by order number..."
            ) : "Filter..."}
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            disabled={!showSearch}
          />
          <div className="search-icon" onClick={handleFilterClick}>
            <AdminDashboardFilterIcon />
            
          </div>
          {showFilter && (
            <div className="filter-dropdown">
              {filterOptions.map((option) => (
                <div
                  key={option.name}
                  className={`filter-option ${location.pathname === option.path ? 'active' : ''}`}
                  onClick={() => handleOptionClick(option.path)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <div className="search-error">{error}</div>}
      </div>
      <div className="header-nav">
        <Link to="/client" className="client-link">Client View</Link>
      </div>
    </div>
  );
}

export default SearchHeader;
