import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../api';

function RevenueChart() {
  const [timePeriod, setTimePeriod] = useState('daily');
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch revenue data for the selected time period
  const fetchRevenueData = async (selectedTimePeriod = timePeriod) => {
    try {
      setLoading(true);
      const data = await getAnalytics(selectedTimePeriod);

      // Extract revenue data from the response
      if (data && data.revenueData) {
        setRevenueData(data.revenueData);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  // Handle time period selection change
  const handleTimePeriodChange = (event) => {
    const newTimePeriod = event.target.value;
    setTimePeriod(newTimePeriod);
    fetchRevenueData(newTimePeriod);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRevenueData();
  }, []);

  // Ensure revenueData is always an array to prevent errors
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];

  // Calculate the maximum value for proper scaling
  const maxValue = Math.max(...safeRevenueData.map(item => item?.value || 0), 1);

  // Function to calculate bar height with minimum visibility
  const getBarHeight = (value) => {
    if (value === 0) {
      return 5; // Minimum height for zero values to show the bar structure
    }
    // Scale the value to percentage of container height (max 90% to leave space)
    return Math.max((value / maxValue) * 90, 10);
  };

  // Function to calculate bar opacity based on value (higher values = darker)
  const getBarOpacity = (value) => {
    if (value === 0) return 0.4; // Slightly higher opacity for zero values
    // Scale opacity from 0.7 to 1.0 based on value relative to max (much darker)
    return 0.7 + (value / maxValue) * 0.3;
  };

  // Function to generate smooth curve coordinates using cubic bezier
  const generateSmoothCurveCoordinates = () => {
    if (safeRevenueData.length === 0 || maxValue === 0) return '';

    const chartWidth = 302;
    const chartHeight = 121;
    const barWidth = 47;
    const spacing = (chartWidth - (safeRevenueData.length * barWidth)) / (safeRevenueData.length + 1);

    // Calculate points
    const points = safeRevenueData.map((item, index) => {
      const x = spacing + (index * (barWidth + spacing)) + (barWidth / 2);
      const y = chartHeight - ((item?.value || 0) / maxValue) * (chartHeight - 20);
      return { x, y };
    });

    if (points.length < 2) return '';

    // Generate smooth curve using cubic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      // Calculate control points for smooth curve
      const tension = 0.3; // Curve tension (0 = straight line, 1 = very curved)
      const cp1x = prev.x + (curr.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * tension;
      const cp2y = curr.y;

      // Add cubic bezier curve
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Format currency for tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="chart-container revenue-chart">
      <div className="chart-header">
        <h3>Revenue</h3>
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

      <div className="chart-content">
        <div className="chart-bars">
          {safeRevenueData.map((item, index) => (
            <div key={index} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  height: `${getBarHeight(item?.value || 0)}%`,
                  opacity: getBarOpacity(item?.value || 0)
                }}
                title={`${item?.day || 'N/A'}: ${formatCurrency(item?.value || 0)}`}
                onMouseEnter={(e) => {
                  // Create and show tooltip
                  const tooltip = document.createElement('div');
                  tooltip.className = 'chart-tooltip';
                  tooltip.innerHTML = `
                    <div class="tooltip-title">${item?.day || 'N/A'}</div>
                    <div class="tooltip-value">${formatCurrency(item?.value || 0)}</div>
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
              ></div>
              <span className="chart-label">{item?.day || 'N/A'}</span>
            </div>
          ))}
        </div>
        {/* Dynamic smooth curve overlay - only show if there's actual data */}
        {maxValue > 0 && safeRevenueData.length > 1 && (
          <div className="chart-overlay">
            <svg width="302" height="121" viewBox="0 0 302 121" fill="none" className="revenue-trend-line">
              <path
                d={generateSmoothCurveCoordinates()}
                stroke="#2A2A2A"
                strokeWidth="2.5"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Add subtle glow effect */}
              <path
                d={generateSmoothCurveCoordinates()}
                stroke="#2A2A2A"
                strokeWidth="4"
                fill="none"
                opacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default RevenueChart;
