import React from 'react';

function RevenueChart({ revenueData }) {
  return (
    <div className="chart-container revenue-chart">
      <div className="chart-header">
        <h3>Revenue</h3>
        <div className="chart-controls">
          <div className="time-selector">
            <span>Daily</span>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <path d="M5.63186 3.086L12 7.36379L18.3681 3.086L19.7279 4.44579L12 9.63621L4.27214 4.44579L5.63186 3.086Z" fill="#B9B8BE"/>
            </svg>
          </div>
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
