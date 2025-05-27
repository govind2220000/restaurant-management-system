import { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import { fetchOrders } from '../api';
import '../styles/Orders.css';

function OrderLinePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);



  // Show loading state
  if (loading) {
    return (
      <>
        <h1 className="section-title">Order Line</h1>
        <div className="loading-container">
          <div className="loading-spinner">Loading orders...</div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <h1 className="section-title">Order Line</h1>
        <div className="error-container">
          <div className="error-message">
            Error: {error}
            <button onClick={loadOrders} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="section-title">Order Line</h1>

      <div className="orders-grid">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              orderType={order.orderType}
              orderStatus={order.orderStatus}
              tableName={order.tableName}
              orderTime={order.orderTime}
              orderStartTime={order.orderStartTime}
              items={order.items}
            />
          ))
        ) : (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderLinePage;
