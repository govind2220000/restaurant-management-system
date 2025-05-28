import React, { useState } from 'react';
import '../styles/ClientOrderMenuPage.css';
import { PizzaIcon, BurgerIcon, DrinkIcon, FrenchFriesIcon, VeggiesIcon } from '../assets/icons/CategoryIcons';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMenuContext } from '../components/ClientLayout';

function ClientOrderMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Pizza');

  // Use global menu context
  const { searchQuery, filteredMenuItems, loading, error } = useMenuContext();

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

  // Determine what items to display based on search state
  const filteredItems = searchQuery.trim()
    ? filteredMenuItems // If searching, show ALL matching items across categories
    : filteredMenuItems.filter(item => item.category === selectedCategory); // If not searching, filter by category

  // Debug logging to help verify the implementation
  console.log('Search Query:', searchQuery);
  console.log('Selected Category:', selectedCategory);
  console.log('All Menu Items:', filteredMenuItems.length);
  console.log('Final Filtered Items:', filteredItems.length);
  console.log('Is Searching:', searchQuery.trim() !== '');

  // Handle adding items to cart
  const handleAddItem = (item) => {
    console.log('Adding item to cart:', item);
    // TODO: Implement cart functionality
    // This could dispatch to a cart context, call an API, etc.
  };

  return (
    <div className="client-order-menu">
      {/* Section 1: Categories */}
      <div className="categories-section">
        <div className="categories-container">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-btn1 ${
                !searchQuery.trim() && selectedCategory === category.name ? 'active' : ''
              } ${searchQuery.trim() ? 'search-active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
              disabled={searchQuery.trim() !== ''}
            >
              <div className="category-icon">
                {category.icon}
                <span className="category-name">{category.name}</span>
              </div>

            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Menu Content (flex container that takes remaining space) */}
      <div className="menu-content-section">
        {/* Menu items container with next button */}
        <div className="menu-items-container">
          <h2 className="menu-category-title">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : selectedCategory}
          </h2>
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
                  {searchQuery.trim()
                    ? `No items found for "${searchQuery}"`
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
