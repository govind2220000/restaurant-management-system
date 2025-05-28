import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuContext } from '../components/ClientLayout';
import CartItemCard from '../components/CartItemCard';
import { placeOrder, transformCartToOrder } from '../api/client';
import '../styles/ClientCartPage.css';

function ClientCartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    getTotalPrice,
    getTotalTax,
    getDeliveryCharge,
    getGrandTotal,
    clearCart
  } = useMenuContext();
  const [orderType, setOrderType] = useState('dineIn'); // 'dineIn' or 'takeAway'
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate order totals dynamically based on cart items and order type
  const itemTotal = getTotalPrice();
  const taxes = getTotalTax();
  const deliveryCharge = getDeliveryCharge(orderType);
  const grandTotal = getGrandTotal(orderType);

  // Debug logging for delivery charge
  console.log(`Order type: ${orderType}, Delivery charge: $${deliveryCharge}`);

  const handleBackToMenu = () => {
    navigate('/client/order-menu');
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return; // Prevent double submission

    setIsPlacingOrder(true);

    try {
      // For Take Away orders, we would normally collect customer info
      // For now, using placeholder data for Take Away orders
      const customerInfo = orderType === 'takeAway' ? {
        name: 'Divya Sigatapu',
        phone: '9109109109',
        address: 'Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...'
      } : null;

      // Transform cart data to order format
      const orderData = transformCartToOrder(cartItems, orderType, cookingInstructions, customerInfo,deliveryCharge);
      console.log(orderData);
      

      console.log('Placing order:', orderData);

      // Place the order via API
      const placedOrder = await placeOrder(orderData);

      console.log('Order placed successfully:', placedOrder);

      // Clear cart after successful order
      clearCart();

      // Show success message (you could implement a toast notification here)
      alert(`Order placed successfully! Order number: ${placedOrder.orderNumber}`);

      // Navigate back to menu
      navigate('/client/order-menu');

    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="client-cart-page">
        <div className="cart-empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to your cart to get started!</p>
          <button
            className="back-to-menu-btn"
            onClick={handleBackToMenu}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="client-cart-page">
      {/* Cart Items Section */}
      <div className="cart-items-section">
        {cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Cooking Instructions */}
      <div className="cooking-instructions-section">
        <input
          type="text"
          placeholder="Add cooking instructions (optional)"
          value={cookingInstructions}
          onChange={(e) => setCookingInstructions(e.target.value)}
          className="cooking-instructions-input"
        />
        <div className="instructions-underline"></div>
      </div>

      {/* Order Type Selection */}
      <div className="order-type-section">
        <div className="order-type-container">
          <button
            className={`order-type-btn ${orderType === 'dineIn' ? 'active' : ''}`}
            onClick={() => setOrderType('dineIn')}
          >
            Dine In
          </button>
          <button
            className={`order-type-btn ${orderType === 'takeAway' ? 'active' : ''}`}
            onClick={() => setOrderType('takeAway')}
          >
            Take Away
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary-section">
        <div className="order-summary-content">
          <div className="summary-row">
            <span className="summary-label">Item Total</span>
            <span className="summary-value">${itemTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Delivery Charge</span>
            <span className="summary-value">
              {deliveryCharge > 0 ? `$${deliveryCharge.toFixed(2)}` : 'Free'}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Taxes</span>
            <span className="summary-value">${taxes.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row grand-total">
            <span className="summary-label">Grand Total</span>
            <span className="summary-value">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div className="user-details-section">
        <div className="section-divider top"></div>
        <div className="user-details-content">
          <h3 className="section-title">Your details</h3>
          <p className="user-info">Divya Sigatapu, 9109109109</p>
        </div>
        <div className="section-divider bottom"></div>
      </div>

      {/* Delivery Information Section */}
      <div className="delivery-info-section">
        <div className="section-divider top"></div>
        <div className="delivery-info-content">
          <div className="delivery-status">
            <div className="status-indicator">
              <div className="status-dot active"></div>
              <div className="status-dot"></div>
            </div>
            <div className="delivery-text">
              <p className="delivery-time">Delivery in 42 mins</p>
              <p className="delivery-address">
                Delivery at Home - Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...
              </p>
            </div>
          </div>
        </div>
        <div className="section-divider bottom"></div>
      </div>

      {/* Swipe to Order Button */}
      <div className="order-action-section">
        <button
          className={`swipe-order-btn ${isPlacingOrder ? 'placing-order' : ''}`}
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <div className="swipe-btn-bg"></div>
          <div className="swipe-btn-circle">
            {isPlacingOrder ? (
              <div className="loading-spinner">⏳</div>
            ) : (
              <svg width="25" height="18" viewBox="0 0 25 18" fill="none">
                <path d="M15.75 1L24 9M24 9L15.75 17M24 9H1" stroke="#292D32" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="swipe-btn-text">
            {isPlacingOrder ? 'Placing Order...' : 'Swipe to Order'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ClientCartPage;
