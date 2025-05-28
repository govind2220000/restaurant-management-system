import React, { useState, useEffect } from 'react';
import '../styles/ClientOrderMenuPage.css';
import { PizzaIcon, BurgerIcon, DrinkIcon, FrenchFriesIcon, VeggiesIcon } from '../assets/icons/CategoryIcons';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchMenuItems } from '../api';

function ClientOrderMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    {
      name: 'Pizza',
      icon: <PizzaIcon />
    },
    {
      name: 'Burger',
      icon: <BurgerIcon />
    },
    {
      name: 'Drink',
      icon: <DrinkIcon />
    },
    {
      name: 'French Fries',
      icon: <FrenchFriesIcon />
    },
    {
      name: 'Veggies',
      icon: <VeggiesIcon />
    }
  ];

  // Load menu items on component mount and when category changes
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Option 1: Fetch all items and filter client-side (better for responsiveness)
        const items = await fetchMenuItems();
        setMenuItems(items);
        console.log(items)

       

      } catch (err) {
        console.error('Failed to load menu items:', err);
        setError(err.message || 'Failed to load menu items');
        setMenuItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []); // Load all items once on mount

  // Alternative: Load items when category changes (uncomment if using Option 2)
  // }, [selectedCategory]);

  const filteredItems = menuItems.filter(item =>
    item.category === selectedCategory &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding items to cart
  const handleAddItem = (item) => {
    console.log('Adding item to cart:', item);
    // TODO: Implement cart functionality
    // This could dispatch to a cart context, call an API, etc.
  };

  return (
    <div className="client-order-menu">
      {/* Section 1: Header/Greeting */}
      <div className="greeting-section">
        <h1 className="greeting-title">Good evening</h1>
        <p className="greeting-subtitle">Place you order here</p>
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

      {/* Section 3: Categories */}
      <div className="categories-section">
        <div className="categories-container">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-btn1 ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="category-icon">
                {category.icon}
                <span className="category-name">{category.name}</span>
              </div>

            </button>
          ))}
        </div>
      </div>

      {/* Section 4: Menu Content (flex container that takes remaining space) */}
      <div className="menu-content-section">
        {/* Menu items container with next button */}
        <div className="menu-items-container">
          <h2 className="menu-category-title">{selectedCategory}</h2>
          <div className="menu-items-grid">
            {loading ? (
              <div className="menu-loading-container">
                <LoadingSpinner message="Loading menu items..." size="medium" />
              </div>
            ) : error ? (
              <div className="menu-error-container">
                <p className="error-message">
                  {error}
                </p>
                <button
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="menu-empty-container">
                <p className="empty-message">
                  {searchQuery
                    ? `No items found for "${searchQuery}" in ${selectedCategory}`
                    : `No ${selectedCategory} items available`
                  }
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  onAddItem={handleAddItem}
                />
              ))
            )}
          </div>

          {/* Bottom action area - now inside menu-items-container */}
          <div className="bottom-action-area">
            <button className="next-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientOrderMenuPage;
