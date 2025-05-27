import React from 'react';
import '../styles/OrderCard.css';

function OrderCard({
  orderType,
  orderStatus,
  items,
  tableName,
  orderStartTime,
  orderNumber,
  orderTime,
  onStatusChange
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

  // Get timing badge colors based on order type
  const getTimingBadgeColors = () => {
    switch (orderType) {
      case 'Dine In':
        return {
          background: '#FFE3BC',
          typeColor: '#FF9500',
          statusColor: '#2C2C2E'
        };
      case 'Takeaway':
        return {
          background: '#C2D4D9',
          typeColor: '#3181A3',
          statusColor: '#2C2C2E'
        };
      case 'Delivery':
        return {
          background: '#B9F8C9',
          typeColor: '#34C759',
          statusColor: '#2C2C2E'
        };
      default:
        return {
          background: '#FFE3BC',
          typeColor: '#FF9500',
          statusColor: '#2C2C2E'
        };
    }
  };

  // Get button configuration based on status
  const getButtonConfig = () => {
    switch (orderStatus) {
      case 'Processing':
        return {
          text: 'Processing',
          icon: (
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
              <path d="M4.5 0L9 15H0L4.5 0Z" fill="#D87300"/>
            </svg>
          ),
          background: '#FDC474',
          textColor: '#D87300'
        };
      case 'Completed':
        return {
          text: 'Order Done',
          icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7.5 12L3 7.5L4.5 6L7.5 9L13.5 3L15 4.5L7.5 12Z" fill="#0E912F"/>
            </svg>
          ),
          background: '#31FF65',
          textColor: '#0E912F'
        };
      case 'Ready':
        return {
          text: 'Order Done',
          icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7.5 12L3 7.5L4.5 6L7.5 9L13.5 3L15 4.5L7.5 12Z" fill="#3B413D"/>
            </svg>
          ),
          background: '#9BAEB3',
          textColor: '#3B413D'
        };
      default:
        return {
          text: 'Processing',
          icon: (
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
              <path d="M4.5 0L9 15H0L4.5 0Z" fill="#D87300"/>
            </svg>
          ),
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
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M6 0L12 20H0L6 0Z" fill="#007AFF"/>
            </svg>
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
          style={{ backgroundColor: timingColors.background }}
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
                  <span className="item-quantity">{item.quantity || 1} x</span>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    {item.customization && (
                      <span className="item-customization">{item.customization}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="no-items">No items in this order</div>
          )}
        </div>
      </div>

      {/* Bottom Button Section */}
      <div className="order-card-bottom">
        <button
          className="order-status-button"
          style={{
            backgroundColor: buttonConfig.background,
            color: buttonConfig.textColor
          }}
          onClick={() => onStatusChange && onStatusChange(orderStatus)}
        >
          <div className="button-icon">{buttonConfig.icon}</div>
          <span className="button-text">{buttonConfig.text}</span>
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
