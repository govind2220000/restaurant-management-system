import React from 'react';

function LoadingSpinner({ message = 'Loading...', size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="spinner-circle"></div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

export default LoadingSpinner;
