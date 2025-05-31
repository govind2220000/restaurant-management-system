import React, { createContext, useContext, useState } from 'react';

const AdminSearchContext = createContext();

export const useAdminSearch = () => {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error('useAdminSearch must be used within AdminSearchProvider');
  }
  return context;
};

export const AdminSearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTablesHandler = (query, tables) => {
    if (!query || !query.trim() || !tables) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchTerm = query.trim().toLowerCase();
      const results = tables.filter(table => 
        table.number.toString().toLowerCase().includes(searchTerm) ||
        (table.name && table.name.toLowerCase().includes(searchTerm))
      );
      setSearchResults(results);
    } catch (err) {
      console.error('Error filtering tables:', err);
      setError(err.message || 'Failed to filter tables');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchOrdersHandler = (query, orders) => {
    if (!query || !query.trim() || !orders) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchTerm = query.trim().toLowerCase();
      const results = orders.filter(order => 
        order.orderNumber.toString().toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    } catch (err) {
      console.error('Error filtering orders:', err);
      setError(err.message || 'Failed to filter orders');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setLoading(false);
  };

  return (
    <AdminSearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        loading,
        error,
        searchTables: searchTablesHandler,
        searchOrders: searchOrdersHandler,
        clearSearch
      }}
    >
      {children}
    </AdminSearchContext.Provider>
  );
}; 