import React, { useState } from 'react';
import '../styles/CookingInstructionsModal.css';

const CookingInstructionsModal = ({ isOpen, onClose, onSave }) => {
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(instructions);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="cooking-instructions-modal">
        {/* Close button */}
        <div className="modal-close-btn" onClick={onClose}>
          <div className="close-circle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Modal content */}
        <div className="modal-content">
          <h2>Add Cooking instructions</h2>
          
          <div className="instructions-input-container">
            <textarea
              placeholder="Add your cooking instructions here..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="instructions-textarea"
            />
          </div>

          <p className="instructions-note">
            The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won't be possible
          </p>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-next" onClick={handleSubmit}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingInstructionsModal; 