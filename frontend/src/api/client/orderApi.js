// Client Order API functions
// Following the established patterns from menuApi.js

import axios from 'axios';

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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

// Transform cart items to order format
export const transformCartToOrder = (cartItems, orderType, cookingInstructions, customerInfo, deliveryCharge) => {
  // Transform cart items to the format expected by the backend
  const items = cartItems.map(item => ({
    menuItem: item.id,
    quantity: item.quantity
    // Note: price will be calculated by backend from menu item data
  }));

  // Create the base order data
  const orderData = {
    type: orderType === 'dineIn' ? 'Dine In' : 'Take Away',
    items,
    cookingInstructions: cookingInstructions || '',
    deliveryCharge,
    // Always include customer info in the order
    customer: {
      name: customerInfo.name,
      phone: customerInfo.phone,
      // Only include address for Take Away orders
      ...(orderType === 'takeAway' && { address: customerInfo.address })
    }
  };

  return orderData;
};

// Place a new order
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    handleApiError(error);
  }
};

// Get order status
export const getOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting order status:', error);
    handleApiError(error);
  }
};
