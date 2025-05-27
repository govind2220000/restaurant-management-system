import { useState, useEffect } from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { createTable } from '../api';

function AddTableModal({ isOpen, onClose, onTableCreated, triggerRef }) {
  const [tableName, setTableName] = useState('');
  const [capacity, setCapacity] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // Calculate modal position relative to trigger button
  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalWidth = 194; // Modal width from Figma
      const modalHeight = 253; // Modal height from Figma
      const spacing = 10; // Space between button and modal

      // Position to the right of the button, or left if not enough space
      let left = triggerRect.right + spacing;
      let top = triggerRect.top;

      // Check if modal would go off-screen to the right
      if (left + modalWidth > window.innerWidth) {
        left = triggerRect.left - modalWidth - spacing; // Position to the left
      }

      // Check if modal would go off-screen at the bottom
      if (top + modalHeight > window.innerHeight) {
        top = window.innerHeight - modalHeight - spacing;
      }

      // Ensure modal doesn't go off-screen at the top
      if (top < spacing) {
        top = spacing;
      }

      setModalPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  // Generate capacity options (1-20) with zero padding
  const generateCapacityOptions = () => {
    const options = [];
    for (let i = 1; i <= 20; i++) {
      const paddedValue = i.toString().padStart(2, '0');
      options.push(
        <option key={i} value={i}>
          {paddedValue}
        </option>
      );
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (capacity < 1 || capacity > 20) {
      setError('Capacity must be between 1 and 20');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTable = await createTable({
        capacity: capacity,
        name: tableName.trim() || undefined
      });

      // Call the callback to update the parent component
      if (onTableCreated) {
        onTableCreated(newTable);
      }

      // Reset form and close modal
      setTableName('');
      setCapacity(3);
      onClose();
    } catch (err) {
      console.error('Failed to create table:', err);
      setError(err.message || 'Failed to create table');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTableName('');
      setCapacity(3);
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div
        className="add-table-modal"
        style={{
          position: 'fixed',
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          zIndex: 1001
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Table Name Field */}
          <div className="form-field">
            <label className="form-label">Table name (optional)</label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="form-input"
              placeholder="Enter table name"
              disabled={isSubmitting}
            />
          </div>

          {/* Divider Line */}
          <div className="form-divider"></div>

          {/* Chair Capacity Field */}
          <div className="form-field">
            <label className="form-label">Chair</label>
            <div className="capacity-selector">
              <div className="capacity-display">{String(capacity).padStart(2, '0')}</div>
              <div className="capacity-controls">
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="capacity-dropdown"
                  disabled={isSubmitting}
                >
                  {generateCapacityOptions()}
                </select>
                <div className="dropdown-arrow">
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                    <path d="M3.75 2.06L8 6.31L12.25 2.06" stroke="#4E4E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            {isSubmitting ? (
              <div className="submit-loading">
                <LoadingSpinner size="small" message="Creating table..." />
              </div>
            ) : (
              <button type="submit" className="create-button">
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddTableModal;
