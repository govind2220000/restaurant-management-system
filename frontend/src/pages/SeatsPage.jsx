import { useState, useEffect } from 'react';
import TablesGrid from '../components/TablesGrid';
import ToastContainer from '../components/ToastContainer';
import useToast from '../hooks/useToast';
import { fetchTables, deleteTable } from '../api';
import { useAdminSearch } from '../context/AdminSearchContext';
import '../styles/Toast.css';
import '../styles/Seats.css';

function SeatsPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { searchQuery, clearSearch } = useAdminSearch();

  // Fetch tables data from API
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const tablesData = await fetchTables();
      setTables(tablesData);
    } catch (err) {
      console.error('Failed to load tables:', err);
      setError(err.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      setLoading(true);
      await deleteTable(tableId);
      // Clear search query first
      clearSearch();
      // Then refresh the tables data
      const updatedTables = await fetchTables();
      setTables(updatedTables);
      showSuccess('Table deleted successfully');
    } catch (err) {
      console.error('Failed to delete table:', err);
      setError(err.message || 'Failed to delete table');
      showError(err.message || 'Failed to delete table');
      await loadTables();
    } finally {
      setLoading(false);
    }
  };

  const handleTableCreated = (newTable) => {
    console.log('Received new table data:', newTable);

    // Validate that we have the required data
    if (!newTable || !newTable._id) {
      console.error('Invalid table data received:', newTable);
      setError('Failed to create table: Invalid response from server');
      return;
    }

    try {
      // Transform the backend response to match frontend expectations
      const formattedTable = {
        id: newTable._id,
        number: newTable.tableNumber ? newTable.tableNumber.replace('T', '') : 'Unknown',
        name: newTable.name,
        capacity: newTable.capacity || 0,
        seats: newTable.capacity || 0,
        status: newTable.isReserved ? 'reserved' : 'available',
        isReserved: newTable.isReserved || false,
        currentOrder: newTable.currentOrder || null,
        createdAt: newTable.createdAt,
        updatedAt: newTable.updatedAt
      };

      // Add the new table to state
      setTables(prevTables => [...prevTables, formattedTable]);
      const tableName = formattedTable.name || `Table ${formattedTable.number}`;
      showSuccess(`${tableName} created successfully`);
    } catch (err) {
      console.error('Error formatting table data:', err);
      setError('Failed to add new table to the list');
      showError('Failed to create table');
    }
  };

  // Simple filtering of tables based on search query
  const displayTables = searchQuery.trim() 
    ? tables.filter(table => 
        table.number.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (table.name && table.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tables;

  return (
    <div className="seats-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Content */}
      <div className="seats-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading tables...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">
              Error: {error}
              <button onClick={loadTables} className="retry-button">
                Retry
              </button>
            </div>
          </div>
        ) : (
          <TablesGrid
            tables={displayTables}
            onDeleteTable={handleDeleteTable}
            onTableCreated={handleTableCreated}
          />
        )}
      </div>
    </div>
  );
}

export default SeatsPage;
