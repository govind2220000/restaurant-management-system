import AddButtonIcon from '../assets/icons/AddButtonIcon';
import '../styles/MenuItemCard.css';

const MenuItemCard = ({ id, name, price, image, onAddItem }) => {
  const handleAddClick = () => {
    onAddItem({ id, name, price, image });
  };

  return (
    <div className="menu-item-card" onClick={handleAddClick}>
      {/* Top Section (50% height) - Image only */}
      <div className="menu-item-image-section">
        <img src={`${image}?auto=compress&cs=tinysrgb&w=612&h=612`} alt={name} />
      </div>

      {/* Bottom Section (50% height) - Content area */}
      <div className="menu-item-content-section">
        {/* Item name at the top */}
        <h3 className="menu-item-name">{name}</h3>

        {/* Bottom row with price and add button */}
        <div className="menu-item-bottom-row">
          <p className="menu-item-price">$ {price}</p>
          <button
            className="add-item-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleAddClick();
            }}
            aria-label={`Add ${name} to cart`}
          >
            <AddButtonIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
