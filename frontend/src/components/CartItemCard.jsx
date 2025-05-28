import { useMenuContext } from './ClientLayout';
import '../styles/CartItemCard.css';

function CartItemCard({ item }) {
  const { updateQuantity, removeFromCart } = useMenuContext();

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemoveItem = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="cart-item-card">
      {/* Item Image */}
      <div className="cart-item-image-container">
        <div className="cart-item-image-wrapper">
          <img
            src={item.image}
            alt={item.name}
            className="cart-item-image"
          />
        </div>

        {/* Remove Button */}
        <button
          className="cart-item-remove-btn"
          onClick={handleRemoveItem}
          aria-label="Remove item"
        >
          <div className="remove-btn-circle">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 1L8 8M8 1L1 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Item Details */}
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-size">14''</p>
        <p className="cart-item-price">$ {item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-quantity-controls">
        <button
          className="quantity-btn decrease-btn"
          onClick={handleDecreaseQuantity}
          aria-label="Decrease quantity"
        >
          <span>-</span>
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button
          className="quantity-btn increase-btn"
          onClick={handleIncreaseQuantity}
          aria-label="Increase quantity"
        >
          <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
            <path d="M4.5 0V8M0 4H9" stroke="#000000" strokeWidth="1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
