import React from 'react';
import { ProcessingIcon, OrderDoneIcon, TakeawayDoneIcon, OrderIcon } from '../assets/icons';
import '../styles/OrderCard.css';

function OrderCard({
  orderType,
  orderStatus,
  items,
  tableName,
  orderStartTime,
  orderNumber,
  orderTime
}) {

  // Calculate ongoing time for Dine In orders
  const calculateOngoingTime = () => {
    if (orderType !== 'Dine In' || !orderStartTime) return '';

    const start = new Date(orderStartTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - start) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Ongoing: ${diffInMinutes} Min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `Ongoing: ${hours}h ${minutes}m`;
    }
  };

  // Get card background color based on status
  const getCardBackgroundColor = () => {
    switch (orderStatus) {
      case 'Processing':
        return '#FFE3BC';
      case 'Completed':
        return '#B9F8C9';
      case 'Ready':
        return '#C2D4D9';
      default:
        return '#FFE3BC';
    }
  };

  // Get darker variant of card background color for order-type text
  const getDarkerBackgroundColor = () => {
    switch (orderStatus) {
      case 'Processing':
        return '#FF9500'; // Darker orange for Processing (FFE3BC background)
      case 'Completed':
        return '#34C759'; // Darker green for Completed (B9F8C9 background)
      case 'Ready':
        return '#3181A3'; // Darker blue for Ready (C2D4D9 background)
      default:
        return '#FF9500'; // Default darker orange
    }
  };

  // Get timing badge text colors
  const getTimingBadgeColors = () => {
    return {
      typeColor: getDarkerBackgroundColor(), // Use darker variant of bg color
      statusColor: '#2C2C2E' // Keep status text dark gray
    };
  };

  // Get button configuration based on status
  const getButtonConfig = () => {
    switch (orderStatus) {
      case 'Processing':
        return {
          text: 'Processing',
          icon: <ProcessingIcon fill="#D87300" />,
          background: '#FDC474',
          textColor: '#D87300'
        };
      case 'Completed':
        return {
          text: 'Order Done',
          icon: <OrderDoneIcon fill="#0E912F" />,
          background: '#31FF65',
          textColor: '#0E912F'
        };
      case 'Ready':
        return {
          text: 'Order Done',
          icon: <TakeawayDoneIcon fill="#3B413D" />,
          background: '#9BAEB3',
          textColor: '#3B413D'
        };
      default:
        return {
          text: 'Processing',
          icon: <ProcessingIcon fill="#D87300" />,
          background: '#FDC474',
          textColor: '#D87300'
        };
    }
  };

  const timingColors = getTimingBadgeColors();
  const buttonConfig = getButtonConfig();
  const totalItems = items?.length || 0;

  return (
    <div
      className="order-card"
      style={{ backgroundColor: getCardBackgroundColor() }}
    >
      {/* Top Info Section - CSS Grid Layout */}
      <div className="order-card-top-info">
        <div className="order-card-background"></div>

        {/* Column 1, Row 1: Order Header (Icon + Number) */}
        <div className="order-header-area">
          <div className="order-icon">
            <OrderIcon fill="#007AFF" />
          </div>
          <div className="order-number">
            # {orderNumber || '108'}
          </div>
        </div>

        {/* Column 1, Row 2: Table Info (Table Name + Time) */}
        <div className="table-info-area">
          {orderType === 'Dine In' && tableName && (
            <div className="table-name">
              {tableName}
            </div>
          )}
          <div className="order-time">
            {orderTime || '9:37 AM'}
          </div>
        </div>

        {/* Column 1, Row 3: Item Count */}
        <div className="item-count-area">
          <div className="item-count">
            {totalItems} Item{totalItems !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Column 2, Spans All Rows: Timing Badge */}
        <div
          className="order-card-timing-badge"
          style={{ backgroundColor: getCardBackgroundColor() }}
        >
          <span
            className="order-type"
            style={{ color: timingColors.typeColor }}
          >
            {orderType}
          </span>
          {orderType === 'Dine In' && orderStartTime && (
            <span
              className="ongoing-time"
              style={{ color: timingColors.statusColor }}
            >
              {calculateOngoingTime()}
            </span>
          )}
          {orderType === 'Takeaway' && (
            <span
              className="pickup-status"
              style={{ color: timingColors.statusColor }}
            >
              Not Picked up
            </span>
          )}
        </div>
      </div>

      {/* Order List Section */}
      <div className="order-list-section">
        <div className="order-list-container">
          {items && items.length > 0 ? (
            <>
              {/* Category Header */}
              <div className="order-category">
                <span className="category-quantity">1 x</span>
                <span className="category-name">Value Set Meals</span>
              </div>

              {/* Order Items - Display in order: Double Cheeseburger, Apple Pie, Coca-Cola L */}
              {items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-content">
                    <span className="item-quantity">{item.quantity || 1} x</span>
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>

                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="no-items">No items in this order</div>
          )}
        </div>
      </div>

      {/* Bottom Status Section */}
      <div className="order-card-bottom">
        <span
          className="order-status-display"
          style={{
            backgroundColor: buttonConfig.background,
            color: buttonConfig.textColor
          }}
        >
          <span className="status-text">{buttonConfig.text}</span>
          <div className="status-icon">{buttonConfig.icon}</div>
        </span>
      </div>
    </div>
  );
}

export default OrderCard;
