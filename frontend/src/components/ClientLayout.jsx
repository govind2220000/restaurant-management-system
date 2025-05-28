import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { fetchMenuItems } from '../api';
import '../styles/Client.css';

// Create Menu Context for global search state
const MenuContext = createContext();

// Custom hook to use menu context
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

function ClientLayout() {

  // Global menu state
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchMenuItems();
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

  // Filter items based on search query (search in name, description, and category)
  const filteredMenuItems = menuItems.filter(item => {
    if (!searchQuery.trim()) return true; // If no search query, return all items

    const query = searchQuery.toLowerCase().trim();
    const itemName = (item.name || '').toLowerCase();
    const itemDescription = (item.description || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();

    return itemName.includes(query) ||
           itemDescription.includes(query) ||
           itemCategory.includes(query);
  });

  // Menu context value
  const menuContextValue = {
    searchQuery,
    setSearchQuery,
    menuItems,
    filteredMenuItems,
    loading,
    error
  };

  return (
    <MenuContext.Provider value={menuContextValue}>
      <div className="client-layout">   

        {/* Greeting and Search Sections - Always visible */}
        <div className="client-greeting-search-container">
          {/* Section 1: Header/Greeting */}
          <div className="greeting-section">
            <h1 className="greeting-title">Good evening</h1>
            <p className="greeting-subtitle">Place your order here</p>
          </div>

          {/* Section 2: Search */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M0.003 0.203L21.351 21.551" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.002 16.804L24.011 23.813" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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
