import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
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

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder;

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Auto detect if dropdown should open upwards (dropUp) when space below is tight
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 260 && rect.top > 260) {
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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative inline-block text-left ${isOpen ? 'z-[70]' : 'z-10'} ${className}`} ref={dropdownRef}>
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

      {/* Dropdown Menu Popup with Auto Drop-Up/Down Placement */}
      {isOpen && (
        <div
          className={`absolute left-0 ${
            dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-[70] min-w-[220px] w-full bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
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
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-[#241F20] dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          )}

          {/* Options List with Divider Lines */}
          <div className="max-h-56 overflow-y-auto divide-y divide-[#EDEDED] dark:divide-slate-800/60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-[#241F20] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    } ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Icon name="CheckCircle" size={14} className="text-blue-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-4 text-center text-xs text-slate-400">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
