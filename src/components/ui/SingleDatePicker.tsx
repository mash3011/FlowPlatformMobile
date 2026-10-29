import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface SingleDatePickerProps {
  value: string; // Format: DD/MM/YYYY
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

  const parsed = parseDateStr(value) || new Date(2026, 8, 14);
  const [viewYear, setViewYear] = useState<number>(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsed.getMonth());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(parseDateStr(value));

  // Auto detect if popover should open upwards when space below is tight
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 380 && rect.top > 320) {
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
      setTempSelectedDate(p);
    } else {
      setTempSelectedDate(null);
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
    setTempSelectedDate(selected);
  };

  const handleApply = () => {
    if (tempSelectedDate) {
      onChange(formatDate(tempSelectedDate));
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const handlePresetSelect = (presetDaysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + presetDaysOffset);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setTempSelectedDate(target);
    onChange(formatDate(target));
    setIsOpen(false);
  };

  // Generate calendar days with Monday start (M T W T F S S)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Convert getDay(): 0 = Sun -> 0 = Mon, 6 = Sun
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const dayCells = [];

  // Prev month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    dayCells.push(
      <div
        key={`prev-${dayNum}`}
        className="w-9 h-9 flex items-center justify-center text-[12px] font-medium text-slate-300 dark:text-slate-600 select-none"
      >
        {String(dayNum).padStart(2, '0')}
      </div>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const cellDate = new Date(viewYear, viewMonth, day);
    const isSelected =
      tempSelectedDate &&
      tempSelectedDate.getDate() === day &&
      tempSelectedDate.getMonth() === viewMonth &&
      tempSelectedDate.getFullYear() === viewYear;

    const isToday =
      cellDate.toDateString() === new Date(2026, 8, 18).toDateString(); // Default mock system date

    let cellClass =
      'w-9 h-9 text-[12px] font-semibold flex items-center justify-center transition-all cursor-pointer select-none rounded-full ';

    if (isSelected) {
      cellClass += 'bg-blue-600 text-white font-bold shadow-xs z-10';
    } else if (isToday) {
      cellClass += 'border-1.5 border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    } else {
      cellClass += 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
    }

    dayCells.push(
      <button
        key={`curr-${day}`}
        type="button"
        onClick={() => handleDaySelect(day)}
        className={cellClass}
      >
        {String(day).padStart(2, '0')}
      </button>
    );
  }

  // Next month padding to fill out 35 or 42 cells
  const remainingCells = (7 - (dayCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    dayCells.push(
      <div
        key={`next-${d}`}
        className="w-9 h-9 flex items-center justify-center text-[12px] font-medium text-slate-300 dark:text-slate-600 select-none"
      >
        {String(d).padStart(2, '0')}
      </div>
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
        <Icon
          name="Calendar"
          size={14}
          className={`shrink-0 ${isOpen ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0 z-[95] w-[335px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-150`}
        >
          {/* Quick presets pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handlePresetSelect(0)}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(1)}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(7)}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              In 7 Days
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect(30)}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              In 30 Days
            </button>
          </div>

          {/* Month & Year Navigation matching Figma */}
          <div className="flex items-center justify-between pt-3 pb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Previous Month"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Next Month"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          {/* Weekday Row: M T W T F S S */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 py-2 justify-items-center">
            {dayCells}
          </div>

          {/* Legend Row matching Figma */}
          <div className="flex items-center justify-center gap-4 py-2 text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-400" />
              <span>Today</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
