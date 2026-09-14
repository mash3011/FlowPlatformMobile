import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface SingleDatePickerProps {
  value: string; // Format: DD/MM/YYYY
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
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
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseDateStr(value) || new Date();
  const [viewYear, setViewYear] = useState<number>(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsed.getMonth());

  // Auto detect if popover should open upwards when space below is tight
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 320 && rect.top > 300) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [isOpen]);

  // Keep view in sync when value changes
  useEffect(() => {
    const p = parseDateStr(value);
    if (p) {
      setViewYear(p.getFullYear());
      setViewMonth(p.getMonth());
    }
  }, [value]);

  // Close popover on click outside cleanly
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
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

  const handleSelectToday = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange(formatDate(today));
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
        className={`w-8 h-8 rounded-[6px] text-xs flex items-center justify-center cursor-pointer transition-all font-medium ${
          isSelected
            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
            : 'text-[#1a2333] dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400'
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
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-[#EDEDED] dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-[#241F20] dark:text-white'
        } ${buttonClassName}`}
      >
        <span>{value || placeholder}</span>
        <Icon name="Calendar" size={14} className={`shrink-0 ${isOpen ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } z-[90] bg-white dark:bg-[#0d131f] border border-[#EDEDED] dark:border-slate-800 rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-4 w-[280px] animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Header Month Navigation */}
          <div className="flex items-center justify-between mb-3 px-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <span className="text-sm font-bold text-[#1E293B] dark:text-slate-100 tracking-tight">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          {/* Weekday Row Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>SU</div>
            <div>MO</div>
            <div>TU</div>
            <div>WE</div>
            <div>TH</div>
            <div>FR</div>
            <div>SA</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">{dayCells}</div>

          {/* Quick Action Footer */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleSelectToday}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Select Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
