import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchHeader from './SearchHeader';
import '../styles/Dashboard.css';

function AdminLayout() {
  const location = useLocation();

  // Function to determine the appropriate section class based on current route
  const getSectionClass = () => {
    const pathname = location.pathname;

    if (pathname === '/admin/dashboard' || pathname === '/admin') {
      return 'dashboard-section';
    } else if (pathname === '/admin/seats') {
      return 'seats-section';
    } else if (pathname === '/admin/order-line') {
      return 'orders-section';
    } else if (pathname === '/admin/analytics') {
      return 'analytics-section';
    }

    // Default fallback
    return 'analytics-section';
  };

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

        {/* Dynamic Content Area with Semantic Section Class */}
        <div className="content-area">
          <div className={getSectionClass()}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
