import React from 'react';

function TableBooking({ tables }) {
  return (
    <div className="chart-container table-booking">
      <div className="chart-header">
        <h3>Tables</h3>
      </div>
      <div className="table-legend">
        <div className="legend-item">
          <div className="legend-color reserved"></div>
          <span>Reserved</span>
        </div>
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
      </div>
      <div className="table-grid-container">
        <div className="table-grid">
          {Array.from({ length: Math.ceil(tables.length / 7) }, (_, rowIndex) => (
            <div key={rowIndex} className="table-row">
              {tables
                .slice(rowIndex * 7, (rowIndex + 1) * 7)
                .map((table) => (
                  <div
                    key={table.id}
                    className={`table-item ${table.status}`}
                  >
                    <span className="table-number">
                      <span className="table-label">Table</span><br />{table.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableBooking;
