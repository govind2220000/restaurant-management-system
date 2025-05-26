import React from 'react';

function OrderSummary({ orderSummary }) {
  return (
    <div className="chart-container order-summary">
      <div className="chart-header">
        <h3>Order Summary</h3>
        <div className="chart-controls">
          <select className="time-selector">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Order Stats Cards */}
      <div className="order-stats-grid">
        <div className="order-stat-card">
          <div className="stat-number">
            {orderSummary.served.count.toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Served</div>
        </div>

        <div className="order-stat-card">
          <div className="stat-number">
            {orderSummary.dineIn.count.toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Dine In</div>
        </div>

        <div className="order-stat-card">
          <div className="stat-number">
            {orderSummary.takeAway.count.toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Take Away</div>
        </div>
      </div>

      {/* Legend and Progress Bars */}
      <div className="order-summary-legend">
        <div className="legend-row">
          <div className="legend-text">
            <span className="legend-label">Take Away</span>
            <span className="legend-percentage">({orderSummary.takeAway.percentage}%)</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill takeaway"
                style={{ width: `${orderSummary.takeAway.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="legend-row">
          <div className="legend-text">
            <span className="legend-label">Served</span>
            <span className="legend-percentage">({orderSummary.served.percentage}%)</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill served"
                style={{ width: `${orderSummary.served.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="legend-row">
          <div className="legend-text">
            <span className="legend-label">Dine in</span>
            <span className="legend-percentage">({orderSummary.dineIn.percentage}%)</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill dinein"
                style={{ width: `${orderSummary.dineIn.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
