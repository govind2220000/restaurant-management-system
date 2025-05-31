// Orders API functions
// Following the established patterns from tables.js and dashboardApi.js

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

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/orders`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    handleApiError(error);
  }
};

// Fetch order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    handleApiError(error);
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post('/api/orders', orderData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    handleApiError(error);
  }
};

// Update order
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    handleApiError(error);
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    handleApiError(error);
  }
};

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    handleApiError(error);
  }
};
