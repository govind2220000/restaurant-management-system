import { useState } from 'react';
import OrderCard from '../components/OrderCard';
import '../styles/Orders.css';

function OrderLinePage() {
  // Sample data for demonstration
  const [orders] = useState([
    {
      id: 1,
      orderNumber: '108',
      orderType: 'Dine In',
      orderStatus: 'Processing',
      tableName: 'Table-05',
      orderTime: '9:37 AM',
      orderStartTime: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
      items: [
        { name: 'Double Cheeseburger', quantity: 1, customization: 'Add extra pickles' },
        { name: 'Apple Pie', quantity: 1 },
        { name: 'Coca-Cola L', quantity: 1 }
      ]
    },
    {
      id: 2,
      orderNumber: '109',
      orderType: 'Dine In',
      orderStatus: 'Completed',
      tableName: 'Table-03',
      orderTime: '9:25 AM',
      orderStartTime: new Date(Date.now() - 16 * 60 * 1000), // 16 minutes ago
      items: [
        { name: 'Double Cheeseburger', quantity: 1, customization: 'Add extra pickles' },
        { name: 'Apple Pie', quantity: 1 },
        { name: 'Coca-Cola L', quantity: 1 }
      ]
    },
    {
      id: 3,
      orderNumber: '110',
      orderType: 'Takeaway',
      orderStatus: 'Ready',
      orderTime: '9:15 AM',
      items: [
        { name: 'Double Cheeseburger', quantity: 1, customization: 'Add extra pickles' },
        { name: 'Apple Pie', quantity: 1 },
        { name: 'Coca-Cola L', quantity: 1 }
      ]
    },
    {
      id: 4,
      orderNumber: '111',
      orderType: 'Dine In',
      orderStatus: 'Processing',
      tableName: 'Table-07',
      orderTime: '9:40 AM',
      orderStartTime: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      items: [
        { name: 'Double Cheeseburger', quantity: 1, customization: 'Add extra pickles' },
        { name: 'Apple Pie', quantity: 1 },
        { name: 'Coca-Cola L', quantity: 1 }
      ]
    }
  ]);



  return (
    <>
      <h1 className="section-title">Order Line</h1>

      <div className="orders-grid">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            orderNumber={order.orderNumber}
            orderType={order.orderType}
            orderStatus={order.orderStatus}
            tableName={order.tableName}
            orderTime={order.orderTime}
            orderStartTime={order.orderStartTime}
            items={order.items}
          />
        ))}
      </div>
    </>
  );
}

export default OrderLinePage;
