import React, { useState } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ title, formula, description, variables }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-container">
      <button
        className="info-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
        title="Show calculation details"
      >
        ℹ️
      </button>
      
      {isVisible && (
        <div className="tooltip-content">
          <div className="tooltip-header">
            <h4>{title}</h4>
          </div>
          
          <div className="tooltip-body">
            <div className="formula-section">
              <strong>Formula:</strong>
              <div className="formula">{formula}</div>
            </div>
            
            {description && (
              <div className="description-section">
                <strong>Description:</strong>
                <p>{description}</p>
              </div>
            )}
            
            {variables && variables.length > 0 && (
              <div className="variables-section">
                <strong>Variables:</strong>
                <ul>
                  {variables.map((variable, index) => (
                    <li key={index}>
                      <strong>{variable.name}:</strong> {variable.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
