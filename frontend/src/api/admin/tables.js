// Tables API functions
// Following the established patterns from dashboardApi.js and orders.js

import axios from 'axios';

// Helper function for error handling
function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
  } else if (error.request) {
    // Network error
    throw new Error('Network error - please check your connection');
  } else {
    // Other error
    throw new Error(error.message || 'Unknown error occurred');
  }
}

// Fetch all tables
export const fetchTables = async () => {
  try {
    const response = await axios.get('/api/tables');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching tables:', error);
    handleApiError(error);
  }
};

// Fetch single table by ID
export const fetchTableById = async (tableId) => {
  try {
    const response = await axios.get(`/api/tables/${tableId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching table:', error);
    handleApiError(error);
  }
};

// Create new table
export const createTable = async (tableData) => {
  try {
    const response = await axios.post('/api/tables', tableData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating table:', error);
    handleApiError(error);
  }
};

// Update table
export const updateTable = async (tableId, tableData) => {
  try {
    const response = await axios.put(`/api/tables/${tableId}`, tableData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating table:', error);
    handleApiError(error);
  }
};

// Delete table
export const deleteTable = async (tableId) => {
  try {
    const response = await axios.delete(`/api/tables/${tableId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting table:', error);
    handleApiError(error);
  }
};

// Search tables
export const searchTables = async (query) => {
  try {
    const response = await axios.get(`/api/tables/search/${encodeURIComponent(query)}`);
    const result = await response.data;

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to search tables');
    }

    // Transform data if needed (for backward compatibility with existing search endpoint)
    const formattedTables = Array.isArray(result) ? result.map(table => ({
      id: table._id,
      number: table.tableNumber.replace('T', ''),
      name: table.name, // Include table name
      capacity: table.capacity,
      seats: table.capacity,
      status: table.isReserved ? 'reserved' : 'available',
      isReserved: table.isReserved,
      currentOrder: table.currentOrder,
      createdAt: table.createdAt,
      updatedAt: table.updatedAt
    })) : [];

    return formattedTables;
  } catch (error) {
    console.error('Error searching tables:', error);
    handleApiError(error);
  }
};
