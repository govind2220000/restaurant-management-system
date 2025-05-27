// Tables API functions
// Following the established patterns from dashboardApi.js and orders.js

// Fetch all tables
export const fetchTables = async () => {
  try {
    const response = await fetch('/api/tables');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch tables');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

// Fetch single table by ID
export const fetchTableById = async (tableId) => {
  try {
    const response = await fetch(`/api/tables/${tableId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch table');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching table:', error);
    throw error;
  }
};

// Create new table
export const createTable = async (tableData) => {
  try {
    const response = await fetch('/api/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tableData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to create table');
    }

    // Return the data from the response, or the result itself if no data wrapper
    return result.data || result;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

// Update table
export const updateTable = async (tableId, tableData) => {
  try {
    const response = await fetch(`/api/tables/${tableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tableData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update table');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

// Delete table
export const deleteTable = async (tableId) => {
  try {
    const response = await fetch(`/api/tables/${tableId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to delete table');
    }

    return result;
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};

// Search tables
export const searchTables = async (query) => {
  try {
    const response = await fetch(`/api/tables/search/${encodeURIComponent(query)}`);
    const result = await response.json();

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
    throw error;
  }
};
