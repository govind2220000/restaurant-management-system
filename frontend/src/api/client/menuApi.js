// Client Menu API functions
// Following the established patterns from admin API functions



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
    const response = await fetch('/api/menu');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch menu items');
    }

    // Transform the data to match frontend expectations
    const transformedItems = Array.isArray(result) 
      ? result.map(transformMenuItem)
      : [];

    return transformedItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};




// Search menu items
export const searchMenuItems = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const response = await fetch(`/api/menu/search/${encodeURIComponent(query.trim())}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to search menu items');
    }

    // Transform the data to match frontend expectations
    const transformedItems = Array.isArray(result) 
      ? result.map(transformMenuItem)
      : [];

    return transformedItems;
  } catch (error) {
    console.error('Error searching menu items:', error);
    throw error;
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

// Fetch menu item by ID
export const fetchMenuItemById = async (id) => {
  try {
    const response = await fetch(`/api/menu/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch menu item');
    }

    return transformMenuItem(result);
  } catch (error) {
    console.error('Error fetching menu item by ID:', error);
    throw error;
  }
};
