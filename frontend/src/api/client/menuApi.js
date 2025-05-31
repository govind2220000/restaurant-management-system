// Client Menu API functions
// Following the established patterns from admin API functions

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

// Transform backend menu item data to frontend format
function transformMenuItem(item) {
  return {
    id: item._id,
    name: item.name,
    price: item.price,
    category: item.category,
    description: item.description,
    image: item.image || '/api/placeholder/174/84', // Fallback to placeholder
    preparationTimeMinutes: item.preparationTimeMinutes, // Using the exact same name as backend
    tax: item.tax
  };
}

// Fetch all menu items
export const fetchMenuItems = async () => {
  try {
    const response = await axios.get('/api/menu');
    const items = response.data.data || [];
    return items.map(transformMenuItem);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    handleApiError(error);
  }
};

// Search menu items
export const searchMenuItems = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const response = await axios.get(`/api/menu/search/${encodeURIComponent(query.trim())}`);
    const items = response.data.data || [];
    return items.map(transformMenuItem);
  } catch (error) {
    console.error('Error searching menu items:', error);
    handleApiError(error);
  }
};

// Get available categories from menu items
export const getMenuCategories = async () => {
  try {
    // Fetch all menu items and extract unique categories
    const menuItems = await fetchMenuItems();
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.sort(); // Return sorted categories
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    // Return default categories as fallback
    return ['Pizza', 'Burger', 'Drink', 'French Fries', 'Veggies'];
  }
};

// Get menu item by ID
export const getMenuItem = async (itemId) => {
  try {
    const response = await axios.get(`/api/menu/${itemId}`);
    return transformMenuItem(response.data.data);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    handleApiError(error);
  }
};
