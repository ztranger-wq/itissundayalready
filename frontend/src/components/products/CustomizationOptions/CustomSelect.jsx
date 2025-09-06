import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ options, selectedValue, onChange, label, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <label htmlFor={id} className="custom-select-label">{label}</label>
      <div
        className={`custom-select-display ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        id={id}
      >
        {selectedOption ? (
          <>
            {selectedOption.image && <img src={selectedOption.image} alt={selectedOption.label} className="custom-select-image" />}
            <span className="custom-select-text">{selectedOption.label}</span>
          </>
        ) : (
          <span className="custom-select-placeholder">Select {label}</span>
        )}
        <span className="custom-select-arrow">&#9662;</span>
      </div>
      {isOpen && (
        <ul className="custom-select-options" role="listbox" aria-labelledby={id}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-select-option ${option.value === selectedValue ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option.value === selectedValue}
              tabIndex={-1}
            >
              {option.image && <img src={option.image} alt={option.label} className="custom-select-image" />}
              <span className="custom-select-text">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
