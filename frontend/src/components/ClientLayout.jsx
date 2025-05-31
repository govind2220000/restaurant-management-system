import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { fetchMenuItems } from '../api';
import '../styles/Client.css';
import SearchIcon from '../assets/icons/SearchIcon';

// Simple Menu Context - everything in one place
const MenuContext = createContext();

// Simple hook to use menu data
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within ClientLayout');
  }
  return context;
};

function ClientLayout() {
  // All menu state in one place
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart state - simple array of cart items
  const [cartItems, setCartItems] = useState([]);

  // Load menu items when component mounts
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchMenuItems();
        console.log('Fetched menu items with tax info and preparation time:', items);
        setMenuItems(items);
        
      } catch (err) {
        console.error('Failed to load menu items:', err);
        setError(err.message || 'Failed to load menu items');
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Filter items based on search - simple and clear
  const filteredMenuItems = menuItems.filter(item => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const itemName = (item.name || '').toLowerCase();
    const itemDescription = (item.description || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();

    return itemName.includes(query) ||
           itemDescription.includes(query) ||
           itemCategory.includes(query);
  });

  // Cart functions
  const addToCart = (item) => {
    console.log('Adding item to cart:', item); // Debug log
    setCartItems(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        // Item exists - increase quantity by 1
        const newCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log(`Added ${item.name} to cart (quantity: ${existingItem.quantity + 1})`);
        return newCart;
      } else {
        // Item doesn't exist - add new item with quantity 1
        const newCart = [...prevCart, {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          tax: item.tax || 0, // Include tax field from menu item
          quantity: 1,
          preparationTimeMinutes: item.preparationTimeMinutes // Using the exact same name as backend
        }];
        console.log(`Added ${item.name} to cart (quantity: 1, tax: ${item.tax || 0})`);
        console.log('New cart:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      console.log(`Updated quantity for item ${itemId} to ${newQuantity}. New cart:`, updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalTax = () => {
    const totalTax = cartItems.reduce((total, item) => {
      // Use the stored tax value from menu item (should always be available now)
      const itemTax = item.tax || 0;
      const itemTotalTax = itemTax * item.quantity;
      console.log(`Tax calculation for ${item.name}: ${itemTax} × ${item.quantity} = ${itemTotalTax}`);
      return total + itemTotalTax;
    }, 0);
    console.log(`Total tax for cart: ${totalTax}`);
    return totalTax;
  };

  const getDeliveryCharge = (orderType = 'dineIn') => {
    // Delivery charge: $1 for Take Away orders, Free for Dine In
    return orderType === 'takeAway' ? 1 : 0;
  };

  const getGrandTotal = (orderType = 'dineIn') => {
    const itemTotal = getTotalPrice();
    const tax = getTotalTax();
    const deliveryCharge = getDeliveryCharge(orderType);
    return itemTotal + tax + deliveryCharge;
  };

  // Simple context value - all data and functions in one object
  const contextValue = {
    // Menu data
    searchQuery,
    setSearchQuery,
    menuItems,
    filteredMenuItems,
    loading,
    error,

    // Cart data and functions
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalTax,
    getDeliveryCharge,
    getGrandTotal
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div className="client-layout">
        {/* Greeting and Search Sections - Always visible */}
        <div className="client-greeting-search-container">
          {/* Greeting Section */}
          <div className="greeting-section">
            <h1 className="greeting-title">Good evening</h1>
            <p className="greeting-subtitle">Place your order here</p>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
              </div>
            </div>
          </div>
        </div>

        {/* Main Client Content */}
        <div className="client-main-content">
          <div className="client-content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </MenuContext.Provider>
  );
}

export default ClientLayout;
