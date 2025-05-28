import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/Client.css';

function ClientLayout() {
  const location = useLocation();
  const isOrderMenuPage = location.pathname === '/client/order-menu';

  return (
    <div className="client-layout">
      {/* Client Header - Hidden for order menu page */}
      {!isOrderMenuPage && (
        <div className="client-header">
          <h2>Order Menu</h2>
          <div className="client-nav">
            <Link to="/admin" className="admin-link">Admin Dashboard</Link>
          </div>
        </div>
      )}

      {/* Main Client Content */}
      <div className="client-main-content">
        <div className="client-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ClientLayout;
