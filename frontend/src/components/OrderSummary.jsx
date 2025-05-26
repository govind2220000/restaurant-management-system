import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../api';

function OrderSummary() {
  const [timePeriod, setTimePeriod] = useState('daily');
  const [orderSummary, setOrderSummary] = useState({
    served: { count: 0, percentage: 0 },
    dineIn: { count: 0, percentage: 0 },
    takeAway: { count: 0, percentage: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Fetch order summary data for the selected time period
  const fetchOrderSummaryData = async (selectedTimePeriod = timePeriod) => {
    try {
      setLoading(true);
      const data = await getAnalytics(selectedTimePeriod);

      // Extract order summary from the response
      if (data && data.orderSummary) {
        setOrderSummary(data.orderSummary);
      }
    } catch (error) {
      console.error('Error fetching order summary data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  // Handle time period selection change
  const handleTimePeriodChange = (event) => {
    const newTimePeriod = event.target.value;
    setTimePeriod(newTimePeriod);
    fetchOrderSummaryData(newTimePeriod);
  };

  // Fetch data on component mount and when time period changes
  useEffect(() => {
    fetchOrderSummaryData();
  }, []);

  // Provide default values to prevent undefined errors
  const safeOrderSummary = {
    served: { count: 0, percentage: 0, ...orderSummary?.served },
    dineIn: { count: 0, percentage: 0, ...orderSummary?.dineIn },
    takeAway: { count: 0, percentage: 0, ...orderSummary?.takeAway }
  };

  // Check if we have any data
  const totalPercentage = safeOrderSummary.takeAway.percentage + safeOrderSummary.served.percentage + safeOrderSummary.dineIn.percentage;
  const hasData = totalPercentage > 0;

  // Calculate pie chart segments
  const createPieChart = () => {
    const data = [
      { label: 'Take Away', percentage: safeOrderSummary.takeAway.percentage || 0, color: '#2c2c2c', count: safeOrderSummary.takeAway.count || 0 },
      { label: 'Served', percentage: safeOrderSummary.served.percentage || 0, color: '#828282', count: safeOrderSummary.served.count || 0 },
      { label: 'Dine In', percentage: safeOrderSummary.dineIn.percentage || 0, color: '#5b5b5b', count: safeOrderSummary.dineIn.count || 0 }
    ];

    // If no data, return empty segments
    if (!hasData) {
      return [];
    }

    // Filter out segments with 0 percentage first, then calculate angles
    const validSegments = data.filter(segment => segment.percentage > 0);

    if (validSegments.length === 0) {
      return [];
    }

    let cumulativePercentage = 0;
    const segments = validSegments.map(item => {
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
          <select
            className="time-selector"
            value={timePeriod}
            onChange={handleTimePeriodChange}
          >
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
            {(safeOrderSummary.served.count || 0).toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Served</div>
        </div>

        <div className="order-stat-card">
          <div className="stat-number">
            {(safeOrderSummary.dineIn.count || 0).toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Dine In</div>
        </div>

        <div className="order-stat-card">
          <div className="stat-number">
            {(safeOrderSummary.takeAway.count || 0).toString().padStart(2, '0')}
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
              {hasData ? (
                pieSegments.map((segment, index) => {
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
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        // Create and show tooltip
                        const tooltip = document.createElement('div');
                        tooltip.className = 'chart-tooltip';
                        tooltip.innerHTML = `
                          <div class="tooltip-title">${segment.label}</div>
                          <div class="tooltip-value">${segment.count} orders (${segment.percentage}%)</div>
                        `;
                        document.body.appendChild(tooltip);

                        const rect = e.target.getBoundingClientRect();
                        tooltip.style.left = `${rect.left + rect.width / 2}px`;
                        tooltip.style.top = `${rect.top - 10}px`;
                      }}
                      onMouseLeave={() => {
                        // Remove tooltip
                        const tooltip = document.querySelector('.chart-tooltip');
                        if (tooltip) tooltip.remove();
                      }}
                    />
                  );
                })
              ) : (
                // Empty state: show a light gray circle to indicate no data
                <circle
                  cx="49.5"
                  cy="49"
                  r="30"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Right Section: Legend with Progress Bars */}
        <div className="legend-section">
          <div className="legend-row">
            <div className="legend-text">
              <span className="legend-label">Take Away</span>
              <span className="legend-percentage">({safeOrderSummary.takeAway.percentage || 0}%)</span>
            </div>
            <div
              className="progress-bar-container"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                tooltip.innerHTML = `
                  <div class="tooltip-title">Take Away Orders</div>
                  <div class="tooltip-value">${safeOrderSummary.takeAway.count || 0} orders (${safeOrderSummary.takeAway.percentage || 0}%)</div>
                `;
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
              }}
              onMouseLeave={() => {
                const tooltip = document.querySelector('.chart-tooltip');
                if (tooltip) tooltip.remove();
              }}
            >
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill takeaway"
                  style={{ width: `${safeOrderSummary.takeAway.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="legend-row">
            <div className="legend-text">
              <span className="legend-label">Served</span>
              <span className="legend-percentage">({safeOrderSummary.served.percentage || 0}%)</span>
            </div>
            <div
              className="progress-bar-container"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                tooltip.innerHTML = `
                  <div class="tooltip-title">Served Orders</div>
                  <div class="tooltip-value">${safeOrderSummary.served.count || 0} orders (${safeOrderSummary.served.percentage || 0}%)</div>
                `;
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
              }}
              onMouseLeave={() => {
                const tooltip = document.querySelector('.chart-tooltip');
                if (tooltip) tooltip.remove();
              }}
            >
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill served"
                  style={{ width: `${safeOrderSummary.served.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="legend-row">
            <div className="legend-text">
              <span className="legend-label">Dine in</span>
              <span className="legend-percentage">({safeOrderSummary.dineIn.percentage || 0}%)</span>
            </div>
            <div
              className="progress-bar-container"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                tooltip.innerHTML = `
                  <div class="tooltip-title">Dine In Orders</div>
                  <div class="tooltip-value">${safeOrderSummary.dineIn.count || 0} orders (${safeOrderSummary.dineIn.percentage || 0}%)</div>
                `;
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
              }}
              onMouseLeave={() => {
                const tooltip = document.querySelector('.chart-tooltip');
                if (tooltip) tooltip.remove();
              }}
            >
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill dinein"
                  style={{ width: `${safeOrderSummary.dineIn.percentage || 0}%` }}
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
