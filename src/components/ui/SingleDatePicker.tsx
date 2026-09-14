import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface SingleDatePickerProps {
  value: string; // Format: DD/MM/YYYY
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
}

// Helper to format Date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Helper to parse DD/MM/YYYY
const parseDateStr = (str: string): Date | null => {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
};

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseDateStr(value) || new Date();
  const [viewYear, setViewYear] = useState<number>(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsed.getMonth());

  // Keep view in sync when value changes
  useEffect(() => {
    const p = parseDateStr(value);
    if (p) {
      setViewYear(p.getFullYear());
      setViewMonth(p.getMonth());
    }
  }, [value]);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    onChange(formatDate(selected));
    setIsOpen(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  const selectedDateObj = parseDateStr(value);

  const dayCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(<div key={`blank-${i}`} className="w-8 h-8" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const isSelected =
      selectedDateObj &&
      selectedDateObj.getDate() === day &&
      selectedDateObj.getMonth() === viewMonth &&
      selectedDateObj.getFullYear() === viewYear;

    dayCells.push(
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => handleDaySelect(day)}
        className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-all ${
          isSelected
            ? 'bg-blue-600 text-white font-bold shadow-xs'
            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] border bg-white dark:bg-slate-900 text-xs font-medium transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-[#EDEDED] dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-[#241F20] dark:text-white'
        }`}
      >
        <span>{value || placeholder}</span>
        <Icon name="Calendar" size={16} className={`shrink-0 ${isOpen ? 'text-blue-500' : 'text-slate-800 dark:text-slate-200'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-xl shadow-2xl p-4 w-[280px] animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer font-bold text-base"
            >
              ‹
            </button>
            <span className="text-xs font-bold text-[#241F20] dark:text-white">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer font-bold text-base"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-1">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          <div className="grid grid-cols-7 gap-1">{dayCells}</div>
        </div>
      )}
    </div>
  );
};
