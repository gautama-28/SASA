import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option", 
  label, 
  disabled = false,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="absolute left-3 -top-2 z-[1] bg-white px-2 text-xs text-gray-600">
          {label}
        </label>
      )}
      
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-left
          focus:border-[#0D3157] focus:ring-2 focus:ring-[#0D3157]/20 focus:outline-none transition
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'text-gray-900 hover:border-gray-400'}
          ${isOpen ? 'border-[#0D3157] ring-2 ring-[#0D3157]/20' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm hover:bg-[#f5f5f5] hover:text-[#0D3157] 
                  transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                  ${value === option.value ? 'bg-[#0D3157] text-white' : 'text-gray-900'}
                `}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;