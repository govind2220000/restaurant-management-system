// Orders API functions
// Following the established patterns from tables.js and dashboardApi.js

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await fetch('/api/orders');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch orders');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Fetch order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to fetch order');
    }

    return result;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to create order');
    }

    return result.data || result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update order');
    }

    return result;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update order status');
    }

    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to delete order');
    }

    return result;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
