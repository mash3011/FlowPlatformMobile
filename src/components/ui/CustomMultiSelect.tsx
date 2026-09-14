import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomMultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  values = [],
  onChange,
  options,
  placeholder = 'Select locations...',
  searchable = true,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropUp, setDropUp] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options array into SelectOption objects
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // All values check
  const allValues = normalizedOptions.map((o) => o.value);
  const isAllSelected = allValues.length > 0 && allValues.every((v) => values.includes(v));

  // Display label formatting
  let displayLabel = placeholder;
  if (isAllSelected) {
    displayLabel = `All (${allValues.length})`;
  } else if (values.length === 1) {
    const found = normalizedOptions.find((o) => o.value === values[0]);
    displayLabel = found ? found.label : values[0];
  } else if (values.length > 1) {
    const firstFound = normalizedOptions.find((o) => o.value === values[0]);
    const firstLabel = firstFound ? firstFound.label : values[0];
    displayLabel = `${firstLabel} (+${values.length - 1})`;
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto detect dropUp
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 280 && rect.top > 280) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  const handleToggleOption = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(allValues);
    }
  };

  return (
    <div
      className={`relative inline-block text-left ${isOpen ? 'z-[70]' : 'z-10'} ${className}`}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm font-medium text-[#241F20] dark:text-slate-200 bg-white dark:bg-[#0d131f] border rounded-lg shadow-2xs transition-all cursor-pointer ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500'
            : 'border-[#EDEDED] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className={`shrink-0 text-slate-400 transition-colors ${
            isOpen ? 'text-blue-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`absolute left-0 ${
            dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-[70] min-w-[240px] w-full bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          {/* Top Search Header */}
          {searchable && (
            <div className="bg-[#F7F7F8] dark:bg-slate-900/90 border-b border-[#EDEDED] dark:border-slate-800 p-2.5 flex items-center gap-2">
              <Icon name="Search" size={15} className="text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search locations..."
                className="w-full bg-transparent text-sm text-[#241F20] dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          )}

          {/* Select All Header */}
          <div className="px-3.5 py-2 bg-slate-50/70 dark:bg-slate-900/40 border-b border-[#EDEDED] dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {values.length} of {allValues.length} Selected
            </span>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Options List with Checkboxes */}
          <div className="max-h-56 overflow-y-auto divide-y divide-[#EDEDED] dark:divide-slate-800/60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleToggleOption(option.value)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-[#241F20] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    } ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <Icon name="Check" size={12} className="stroke-[3]" />}
                      </div>
                      <span className="truncate">{option.label}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-4 text-center text-xs text-slate-400">
                No matching locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
