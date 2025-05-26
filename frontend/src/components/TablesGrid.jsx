import { useState } from 'react';

function TablesGrid({ tables, onDeleteTable, loading, error }) {
  const [deletingTableId, setDeletingTableId] = useState(null);

  const handleDeleteTable = async (tableId) => {
    if (deletingTableId) return; // Prevent multiple deletes
    
    setDeletingTableId(tableId);
    try {
      await onDeleteTable(tableId);
    } catch (error) {
      console.error('Failed to delete table:', error);
    } finally {
      setDeletingTableId(null);
    }
  };

  if (loading) {
    return (
      <div className="tables-grid-loading">
        <div className="loading-message">Loading tables...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tables-grid-error">
        <div className="error-message">Error loading tables: {error}</div>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="tables-grid-empty">
        <div className="empty-message">No tables available</div>
      </div>
    );
  }

  return (
    <div className="tables-grid">
      {tables.map((table) => (
        <div key={table.id} className="table-card">
          <button 
            className="delete-btn"
            onClick={() => handleDeleteTable(table.id)}
            disabled={deletingTableId === table.id}
            aria-label={`Delete Table ${table.number}`}
          >
            {deletingTableId === table.id ? (
              <div className="delete-spinner">⟳</div>
            ) : (
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path d="M3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999 16.549 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.549 18.001 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="currentColor"/>
              </svg>
            )}
          </button>
          
          <div className="table-info">
            <div className="table-number">
              <div className="table-label">Table</div>
              <div className="table-id">{table.number}</div>
            </div>
          </div>
          
          <div className="table-footer">
            <div className="chair-icon">
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
                <path d="M0.5 10.5V8.5H1.5V6.5H0.5V4.5C0.5 4.225 0.598 3.99 0.794 3.794C0.99 3.598 1.225 3.5 1.5 3.5H4.5C4.775 3.5 5.01 3.598 5.206 3.794C5.402 3.99 5.5 4.225 5.5 4.5V6.5H4.5V8.5H5.5V10.5H4.5V8.5H1.5V10.5H0.5ZM1.5 6.5H4.5V4.5H1.5V6.5Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="seat-count">{String(table.capacity || table.seats).padStart(2, '0')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TablesGrid;
