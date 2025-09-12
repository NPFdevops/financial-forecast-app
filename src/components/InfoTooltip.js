import React, { useState, useRef, useEffect } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ title, formula, description, variables }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = triggerRect.bottom + 8;
    let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

    // Adjust if tooltip goes off-screen horizontally
    if (left < 8) {
      left = 8;
    } else if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }

    // Adjust if tooltip goes off-screen vertically
    if (top + tooltipRect.height > viewport.height - 8) {
      top = triggerRect.top - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is updated
      setTimeout(updatePosition, 10);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      // Close tooltip when clicking outside
      const handleClickOutside = (event) => {
        if (
          triggerRef.current && 
          !triggerRef.current.contains(event.target) &&
          tooltipRef.current && 
          !tooltipRef.current.contains(event.target)
        ) {
          setIsVisible(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="info-tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`Show calculation details for ${title}`}
        aria-expanded={isVisible}
        aria-describedby={isVisible ? `tooltip-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
        </svg>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="info-tooltip-portal"
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 10000
          }}
          id={`tooltip-${title.replace(/\s+/g, '-').toLowerCase()}`}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="tooltip-content">
            <div className="tooltip-header">
              <h4 className="tooltip-title">{title}</h4>
            </div>
            
            <div className="tooltip-body">
              <div className="tooltip-section">
                <div className="section-label">Formula:</div>
                <div className="formula-display">{formula}</div>
              </div>
              
              {description && (
                <div className="tooltip-section">
                  <div className="section-label">Description:</div>
                  <p className="description-text">{description}</p>
                </div>
              )}
              
              {variables && variables.length > 0 && (
                <div className="tooltip-section">
                  <div className="section-label">Variables:</div>
                  <ul className="variables-list">
                    {variables.map((variable, index) => (
                      <li key={index} className="variable-item">
                        <span className="variable-name">{variable.name}:</span>
                        <span className="variable-description">{variable.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
