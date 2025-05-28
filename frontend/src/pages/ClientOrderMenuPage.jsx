import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ClientOrderMenuPage.css';
import { PizzaIcon, BurgerIcon, DrinkIcon, FrenchFriesIcon, VeggiesIcon } from '../assets/icons/CategoryIcons';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMenuContext } from '../components/ClientLayout';

function ClientOrderMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const navigate = useNavigate();

  // Use global menu context (now includes cart functionality)
  const {
    searchQuery,
    filteredMenuItems,
    loading,
    error,
    addToCart,
    getTotalItems
  } = useMenuContext();

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

  // Removed debug logging - keeping code clean

  // Handle adding items to cart - now uses context
  const handleAddItem = (item) => {
    addToCart(item);
  };

  // Handle navigation to cart page
  const handleNextClick = () => {
    const totalItems = getTotalItems();
    if (totalItems > 0) {
      navigate('/client/cart');
    } else {
      // Optional: Show a message that cart is empty
      alert('Please add some items to your cart first!');
    }
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
        {/* Menu items container - scrollable area */}
        <div className="menu-items-container">
          <h2 className="menu-category-title">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : selectedCategory}
          </h2>
          <div className="scrollable-menu-items-wrapper">
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
                  tax={item.tax}
                  onAddItem={handleAddItem}
                />
              ))
            )}
          </div>
        </div>

        {/* Fixed bottom action area - outside scrollable container */}
        <div className="fixed-bottom-action-area">
          <button className="next-btn" onClick={handleNextClick}>
            Next {getTotalItems() > 0 && `(${getTotalItems()})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientOrderMenuPage;
