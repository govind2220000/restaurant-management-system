import React, { useState } from 'react';
import '../styles/ClientOrderMenuPage.css';
import { PizzaIcon, BurgerIcon, DrinkIcon, FrenchFriesIcon, VeggiesIcon } from '../assets/icons/CategoryIcons';
import MenuItemCard from '../components/MenuItemCard';

function ClientOrderMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const [searchQuery, setSearchQuery] = useState('');

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
      name: 'French fries',
      icon: <FrenchFriesIcon />
    },
    {
      name: 'Veggies',
      icon: <VeggiesIcon />
    }
  ];

  const menuItems = [
    // Pizza items
    {
      id: 1,
      name: 'Pepperoni',
      price: 200,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    {
      id: 2,
      name: 'Marinara',
      price: 200,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    {
      id: 3,
      name: 'Capricciosa',
      price: 200,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    {
      id: 4,
      name: 'Sicilian',
      price: 150,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    {
      id: 5,
      name: 'Marinara Special',
      price: 90,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    {
      id: 6,
      name: 'Pepperoni Deluxe',
      price: 300,
      category: 'Pizza',
      image: '/api/placeholder/174/84'
    },
    // Burger items
    {
      id: 7,
      name: 'Classic Burger',
      price: 180,
      category: 'Burger',
      image: '/api/placeholder/174/84'
    },
    {
      id: 8,
      name: 'Cheese Burger',
      price: 220,
      category: 'Burger',
      image: '/api/placeholder/174/84'
    },
    {
      id: 9,
      name: 'Chicken Burger',
      price: 250,
      category: 'Burger',
      image: '/api/placeholder/174/84'
    },
    // Drink items
    {
      id: 10,
      name: 'Coca Cola',
      price: 50,
      category: 'Drink',
      image: '/api/placeholder/174/84'
    },
    {
      id: 11,
      name: 'Orange Juice',
      price: 80,
      category: 'Drink',
      image: '/api/placeholder/174/84'
    },
    {
      id: 12,
      name: 'Coffee',
      price: 60,
      category: 'Drink',
      image: '/api/placeholder/174/84'
    },
    // French fries items
    {
      id: 13,
      name: 'Regular Fries',
      price: 120,
      category: 'French fries',
      image: '/api/placeholder/174/84'
    },
    {
      id: 14,
      name: 'Cheese Fries',
      price: 150,
      category: 'French fries',
      image: '/api/placeholder/174/84'
    },
    // Veggies items
    {
      id: 15,
      name: 'Garden Salad',
      price: 140,
      category: 'Veggies',
      image: '/api/placeholder/174/84'
    },
    {
      id: 16,
      name: 'Grilled Vegetables',
      price: 160,
      category: 'Veggies',
      image: '/api/placeholder/174/84'
    }
  ];

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
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                onAddItem={handleAddItem}
              />
            ))}
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
