import { useState, useEffect } from 'react';
import TablesGrid from '../components/TablesGrid';
import { fetchTables, deleteTable } from '../api/tables';
import '../styles/Seats.css';

function SeatsPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      await deleteTable(tableId);
      // Remove the deleted table from state
      setTables(prevTables => prevTables.filter(table => table.id !== tableId));
    } catch (err) {
      console.error('Failed to delete table:', err);
      setError(err.message || 'Failed to delete table');
      throw err; // Re-throw to let TablesGrid handle the error state
    }
  };

  return (
    <>
      <h1 className="section-title">Tables</h1>

      <TablesGrid
        tables={tables}
        onDeleteTable={handleDeleteTable}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default SeatsPage;
