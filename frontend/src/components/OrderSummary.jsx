import React from 'react';

function OrderSummary({ orderSummary }) {
  // Calculate pie chart segments
  const createPieChart = () => {
    const data = [
      { label: 'Take Away', percentage: orderSummary.takeAway.percentage, color: '#2c2c2c' },
      { label: 'Served', percentage: orderSummary.served.percentage, color: '#828282' },
      { label: 'Dine In', percentage: orderSummary.dineIn.percentage, color: '#5b5b5b' }
    ];

    let cumulativePercentage = 0;
    const segments = data.map(item => {
      const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
      const endAngle = (cumulativePercentage + item.percentage) * 3.6;
      cumulativePercentage += item.percentage;

      return {
        ...item,
        startAngle,
        endAngle,
        largeArcFlag: item.percentage > 50 ? 1 : 0
      };
    });

    return segments;
  };

  const pieSegments = createPieChart();

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

      {/* Pie Chart and Legend Section */}
      <div className="order-summary-legend">
        {/* Left Section: Pie Chart */}
        <div className="pie-chart-section">
          <div className="pie-chart-container">
            <svg width="99" height="98" viewBox="0 0 99 98" className="donut-chart">
              {pieSegments.map((segment, index) => {
                const centerX = 49.5;
                const centerY = 49;
                const outerRadius = 40;
                const innerRadius = 20; // Inner radius for donut hole

                // Calculate start and end points for the outer arc
                const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
                const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180);

                const x1Outer = centerX + outerRadius * Math.cos(startAngleRad);
                const y1Outer = centerY + outerRadius * Math.sin(startAngleRad);
                const x2Outer = centerX + outerRadius * Math.cos(endAngleRad);
                const y2Outer = centerY + outerRadius * Math.sin(endAngleRad);

                const x1Inner = centerX + innerRadius * Math.cos(startAngleRad);
                const y1Inner = centerY + innerRadius * Math.sin(startAngleRad);
                const x2Inner = centerX + innerRadius * Math.cos(endAngleRad);
                const y2Inner = centerY + innerRadius * Math.sin(endAngleRad);

                const pathData = [
                  `M ${x1Outer} ${y1Outer}`,
                  `A ${outerRadius} ${outerRadius} 0 ${segment.largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
                  `L ${x2Inner} ${y2Inner}`,
                  `A ${innerRadius} ${innerRadius} 0 ${segment.largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
                  'Z'
                ].join(' ');

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={segment.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Section: Legend with Progress Bars */}
        <div className="legend-section">
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
    </div>
  );
}

export default OrderSummary;
