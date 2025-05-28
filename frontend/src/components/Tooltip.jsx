import React, { useState } from 'react';
import '../styles/Tooltip.css';

function Tooltip({ children, text, position = 'right' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {text}
          <div className={`tooltip-arrow tooltip-arrow-${position}`}></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
