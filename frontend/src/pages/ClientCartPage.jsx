import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuContext } from '../components/ClientLayout';
import CartItemCard from '../components/CartItemCard';
import CookingInstructionsModal from '../components/CookingInstructionsModal';
import { placeOrder, transformCartToOrder } from '../api/client';
import '../styles/ClientCartPage.css';
import DeliveryTimeIcon from '../assets/icons/DeliveryTimeIcon';

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
  console.log(cartItems);
  
  const [orderType, setOrderType] = useState('dineIn'); // 'dineIn' or 'takeAway'
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New state for delivery info
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [deliveryInfoErrors, setDeliveryInfoErrors] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Calculate total preparation time
  const getTotalPreparationTime = () => {
    return cartItems.reduce((total, item) => {
      // Check if preparationTimeMinutes exists and is a number
      const itemPrepTime = item.preparationTimeMinutes || 0;
      console.log(`Item: ${item.name}, Prep Time: ${itemPrepTime}, Quantity: ${item.quantity}`);
      return total + (itemPrepTime * item.quantity);
    }, 0);
  };

  // Format preparation time to hours and minutes
  const formatPreparationTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''}`;
    }
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  };

  // Calculate order totals dynamically based on cart items and order type
  const itemTotal = getTotalPrice();
  const taxes = getTotalTax();
  const deliveryCharge = getDeliveryCharge(orderType);
  const grandTotal = getGrandTotal(orderType);
  const totalPreparationTime = getTotalPreparationTime();

  // Debug logging for delivery charge
  console.log(`Order type: ${orderType}, Delivery charge: $${deliveryCharge}`);

  const handleBackToMenu = () => {
    navigate('/client/order-menu');
  };

  // Validate delivery info for take away orders
  const validateDeliveryInfo = () => {
    const errors = {
      name: '',
      phone: '',
      address: ''
    };
    let isValid = true;

    // Validate name and phone for all order types
    if (!deliveryInfo.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!deliveryInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(deliveryInfo.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Validate address only for take away orders
    if (orderType === 'takeAway' && !deliveryInfo.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    setDeliveryInfoErrors(errors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return; // Prevent double submission

    // Validate delivery info for all orders
    if (!validateDeliveryInfo()) {
      alert('Please fill in all required information');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare customer info for all orders
      const customerInfo = {
        name: deliveryInfo.name.trim(),
        phone: deliveryInfo.phone.trim(),
        ...(orderType === 'takeAway' ? { address: deliveryInfo.address.trim() } : {})
      };

      // Transform cart data to order format
      const orderData = transformCartToOrder(
        cartItems,
        orderType,
        cookingInstructions.trim(),
        customerInfo,
        deliveryCharge
      );

      console.log('Placing order:', orderData);

      // Place the order via API
      const placedOrder = await placeOrder(orderData);

      console.log('Order placed successfully:', placedOrder);

      // Clear cart and delivery info after successful order
      clearCart();
      setDeliveryInfo({
        name: '',
        phone: '',
        address: ''
      });

      // Show success message
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
      <div className="cooking-instructions-section" onClick={() => setIsModalOpen(true)}>
        <input
          type="text"
          placeholder="Add cooking instructions (optional)"
          value={cookingInstructions}
          readOnly
          className="cooking-instructions-input"
        />
        <div className="instructions-underline"></div>
      </div>

      {/* Cooking Instructions Modal */}
      <CookingInstructionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(instructions) => setCookingInstructions(instructions)}
      />

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
          <div className="delivery-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                className={`form-input ${deliveryInfoErrors.name ? 'error' : ''}`}
              />
              {deliveryInfoErrors.name && (
                <span className="error-message">{deliveryInfoErrors.name}</span>
              )}
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                className={`form-input ${deliveryInfoErrors.phone ? 'error' : ''}`}
              />
              {deliveryInfoErrors.phone && (
                <span className="error-message">{deliveryInfoErrors.phone}</span>
              )}
            </div>
          </div>
        </div>
        <div className="section-divider bottom"></div>
      </div>

      {/* Delivery Information Section - Only shown for Take Away orders */}
      {orderType === 'takeAway' && (
        <div className="delivery-info-section">
          
          <div className="delivery-info-content">
            <div className="delivery-form">
              <div className="form-group">
                <textarea
                  placeholder="Delivery Address"
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                  className={`form-input address-input ${deliveryInfoErrors.address ? 'error' : ''}`}
                  rows={3}
                />
                {deliveryInfoErrors.address && <span className="error-message">{deliveryInfoErrors.address}</span>}
              </div>
            </div>
            <div className="preparation-time-info">
              <div className="time-icon">
                <DeliveryTimeIcon />
              </div>
              <p className="delivery-time-text">
                Delivery in {formatPreparationTime(totalPreparationTime)}
              </p>
            </div>
          </div>
          <div className="section-divider bottom"></div>
        </div>
      )}

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
