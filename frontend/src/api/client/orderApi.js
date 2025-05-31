// Client Order API functions
// Following the established patterns from menuApi.js

// Place a new order
export const placeOrder = async (orderData) => {
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
      throw new Error(result.message || result.error || 'Failed to place order');
    }

    return result;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

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
