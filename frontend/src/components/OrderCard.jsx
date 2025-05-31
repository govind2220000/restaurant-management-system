import React from 'react';
import { ProcessingIcon, OrderDoneIcon, TakeawayDoneIcon, OrderIcon } from '../assets/icons';
import '../styles/OrderCard.css';

function OrderCard({
  id,
  orderType,
  orderStatus,
  items,
  tableName,
  orderStartTime,
  orderNumber,
  orderTime
}) {
  // Deterministic random function based on order ID for consistent results
  const getDeterministicRandom = (seed) => {
    if (!seed) return 0.5; // Default fallback

    // Simple hash function to convert ID to number
    let hash = 0;
    const str = seed.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to 0-1 range
    return Math.abs(hash) / 2147483647;
  };

  // Calculate ongoing time for processing orders
  const calculateOngoingTime = () => {
    if (!orderStartTime) return '';

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

  // Get card background color based on order type and status combination
  const getCardBackgroundColor = () => {
    // Scenario 1: Completed Dine In Orders
    if (orderType === 'Dine In' && orderStatus === 'Completed') {
      return '#B9F8C9';
    }

    // Scenario 2: Completed Take Away Orders
    if (orderType === 'Take Away' && orderStatus === 'Completed') {
      return '#C2D4D9';
    }

    // Scenario 3: Processing Orders (Any Type)
    if (orderStatus === 'Processing') {
      return '#FFE3BC';
    }

    // Default fallback
    return '#FFE3BC';
  };

  // Get darker variant of card background color for order-type text
  const getDarkerBackgroundColor = () => {
    // Scenario 1: Completed Dine In Orders (B9F8C9 background)
    if (orderType === 'Dine In' && orderStatus === 'Completed') {
      return '#34C759'; // Darker green
    }

    // Scenario 2: Completed Take Away Orders (C2D4D9 background)
    if (orderType === 'Take Away' && orderStatus === 'Completed') {
      return '#3181A3'; // Darker blue
    }

    // Scenario 3: Processing Orders (FFE3BC background)
    if (orderStatus === 'Processing') {
      return '#FF9500'; // Darker orange
    }

    // Default fallback
    return '#FF9500';
  };

  // Get display text for order type section
  const getOrderTypeDisplay = () => {
    // Scenario 1: Completed Dine In Orders - Display "Done"
    if (orderType === 'Dine In' && orderStatus === 'Completed') {
      return 'Done';
    }

    // Scenario 2: Completed Take Away Orders - Display "Take Away"
    if (orderType === 'Take Away' && orderStatus === 'Completed') {
      return 'Take Away';
    }

    // Scenario 3: Processing Orders - Display actual order type
    if (orderStatus === 'Processing') {
      return orderType;
    }

    // Default fallback
    return orderType;
  };

  // Get display text for timing section
  const getTimingDisplay = () => {
    // Scenario 1: Completed Dine In Orders - Display "SERVED"
    if (orderType === 'Dine In' && orderStatus === 'Completed') {
      return 'SERVED';
    }

    // Scenario 2: Completed Take Away Orders - Display "Not Picked Up" or "Picked Up" randomly
    if (orderType === 'Take Away' && orderStatus === 'Completed') {
      const random = getDeterministicRandom(id);
      return random > 0.5 ? 'Picked Up' : 'Not Picked Up';
    }

    // Scenario 3: Processing Orders - Display ongoing time
    if (orderStatus === 'Processing') {
      return calculateOngoingTime();
    }

    // Default fallback
    return '';
  };

  // Get timing badge text colors
  const getTimingBadgeColors = () => {
    return {
      typeColor: getDarkerBackgroundColor(), // Use darker variant of bg color
      statusColor: '#2C2C2E' // Keep status text dark gray
    };
  };

  // Get button configuration based on order type and status combination
  const getButtonConfig = () => {
    // Processing orders (any type)
    if (orderStatus === 'Processing') {
      return {
        text: 'Processing',
        icon: <ProcessingIcon fill="#D87300" />,
        background: '#FDC474',
        textColor: '#D87300'
      };
    }

    // Completed orders - differentiate by order type
    if (orderStatus === 'Completed') {
      // Dine In completed orders
      if (orderType === 'Dine In') {
        return {
          text: 'Order Done',
          icon: <OrderDoneIcon fill="#0E912F" />,
          background: '#31FF65',
          textColor: '#0E912F'
        };
      }

      // Take Away completed orders
      if (orderType === 'Take Away') {
        return {
          text: 'Order Done',
          icon: <TakeawayDoneIcon fill="#3B413D" />,
          background: '#9BAEB3',
          textColor: '#3B413D'
        };
      }
    }

    // Legacy 'Ready' status (fallback for Take Away)
    if (orderStatus === 'Ready') {
      return {
        text: 'Order Done',
        icon: <TakeawayDoneIcon fill="#3B413D" />,
        background: '#9BAEB3',
        textColor: '#3B413D'
      };
    }

    // Default fallback
    return {
      text: 'Processing',
      icon: <ProcessingIcon fill="#D87300" />,
      background: '#FDC474',
      textColor: '#D87300'
    };
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
            {getOrderTypeDisplay()}
          </span>
          {getTimingDisplay() && (
            <span
              className="timing-status"
              style={{ color: timingColors.statusColor }}
            >
              {getTimingDisplay()}
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
