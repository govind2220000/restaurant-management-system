import React from 'react';

function RevenueChart({ revenueData }) {
  return (
    <div className="chart-container revenue-chart">
      <div className="chart-header">
        <h3>Revenue</h3>
        <div className="chart-controls">
          <select className="time-selector">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="chart-content">
        <div className="chart-bars">
          {revenueData.map((item, index) => (
            <div key={index} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{ height: `${item.value}%` }}
              ></div>
              <span className="chart-label">{item.day}</span>
            </div>
          ))}
        </div>
        {/* Revenue trend line overlay */}
        <div className="chart-overlay">
          <svg width="302" height="121" viewBox="0 0 302 121" fill="none" className="revenue-trend-line">
            <path d="M40 47L82 35L124 55L166 25L208 40L250 30L292 45" stroke="#2A2A2A" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;
