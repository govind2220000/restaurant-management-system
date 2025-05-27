import { useState, useEffect } from 'react';
import TablesGrid from '../components/TablesGrid';
import ToastContainer from '../components/ToastContainer';
import useToast from '../hooks/useToast';
import { fetchTables, deleteTable } from '../api/tables';
import '../styles/Toast.css';
import '../styles/Seats.css';

function SeatsPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

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
      // Remove the deleted table from state
      //setTables(prevTables => prevTables.filter(table => table.id !== tableId));
      const updatedTables = await fetchTables();
      setTables(updatedTables);
      // Show success toast
      showSuccess('Table deleted successfully');
    } catch (err) {
      console.error('Failed to delete table:', err);
      setError(err.message || 'Failed to delete table');
      // Show error toast
      showError(err.message || 'Failed to delete table');
      await loadTables();
    }
    finally {
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
        name: newTable.name, // Include table name
        capacity: newTable.capacity || 0,
        seats: newTable.capacity || 0,
        status: newTable.isReserved ? 'reserved' : 'available',
        isReserved: newTable.isReserved || false,
        currentOrder: newTable.currentOrder || null,
        createdAt: newTable.createdAt,
        updatedAt: newTable.updatedAt
      };

      console.log('Formatted table data:', formattedTable);

      // Add the new table to state
      setTables(prevTables => [...prevTables, formattedTable]);
      // Show success toast
      const tableName = formattedTable.name || `Table ${formattedTable.number}`;
      showSuccess(`${tableName} created successfully`);
    } catch (err) {
      console.error('Error formatting table data:', err);
      setError('Failed to add new table to the list');
      // Show error toast
      showError('Failed to create table');
    }
  };

  return (
    <>
      <h1 className="section-title">Tables</h1>

      <TablesGrid
        tables={tables}
        onDeleteTable={handleDeleteTable}
        onTableCreated={handleTableCreated}
        loading={loading}
        error={error}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default SeatsPage;
