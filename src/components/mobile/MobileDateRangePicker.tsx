import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';

export interface MobileDateRangePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PRESETS = [
  { label: 'All Dates', value: 'Select date range' },
  { label: 'Sep 2026 (Current)', value: 'September 2026', start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) },
  { label: 'Aug 2026', value: 'August 2026', start: new Date(2026, 7, 1), end: new Date(2026, 7, 31) },
  { label: 'Jul 2026', value: 'July 2026', start: new Date(2026, 6, 1), end: new Date(2026, 6, 31) },
  { label: 'Jun 2026', value: 'June 2026', start: new Date(2026, 5, 1), end: new Date(2026, 5, 30) },
  { label: 'Last 30 days', value: 'Last 30 days', start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) },
];

// Helper to format Date
const formatDateShort = (date: Date): string => {
  const day = date.getDate();
  const suffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  const monthAbbr = MONTH_NAMES[date.getMonth()].slice(0, 3);
  return `${day}${suffix(day)} ${monthAbbr}, ${date.getFullYear()}`;
};

export const MobileDateRangePicker: React.FC<MobileDateRangePickerProps> = ({
  value = 'Select date range',
  onChange,
  placeholder = 'Select date range',
  className = '',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month & Year state (default to September 2026)
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September
  const [currentYear, setCurrentYear] = useState<number>(2026);

  // Selected date range state
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 8, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 8, 30));
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clicked = new Date(currentYear, currentMonth, day);

    if (selectingStep === 'start' || !startDate || (startDate && endDate)) {
      setStartDate(clicked);
      setEndDate(null);
      setSelectingStep('end');
    } else {
      if (clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      setSelectingStep('start');
    }
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    if (preset.value === 'Select date range') {
      setStartDate(null);
      setEndDate(null);
      onChange('Select date range');
      setIsOpen(false);
      return;
    }
    if (preset.start && preset.end) {
      setStartDate(preset.start);
      setEndDate(preset.end);
      setCurrentMonth(preset.start.getMonth());
      setCurrentYear(preset.start.getFullYear());
      const formatted = `${formatDateShort(preset.start)} - ${formatDateShort(preset.end)}`;
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const formatted = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
      onChange(formatted);
    } else if (startDate) {
      onChange(formatDateShort(startDate));
    } else {
      onChange('Select date range');
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange('Select date range');
    setIsOpen(false);
  };

  // Generate calendar days for the current month
  // Monday start as in Figma node 537:8173 (M T W T F S S)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // JavaScript getDay(): 0 is Sunday, 1 is Monday...
  // Convert to 0 = Monday, 6 = Sunday
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Calendar cells
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
    const cellDate = new Date(currentYear, currentMonth, day);
    const time = cellDate.getTime();

    const isStart = startDate && cellDate.toDateString() === startDate.toDateString();
    const isEnd = endDate && cellDate.toDateString() === endDate.toDateString();
    const isInRange =
      startDate && endDate && time > startDate.getTime() && time < endDate.getTime();
    const isToday =
      cellDate.toDateString() === new Date(2026, 8, 18).toDateString(); // 18 Sep 2026

    let cellClass = 'w-9 h-9 text-[12px] font-semibold flex items-center justify-center transition-all cursor-pointer select-none ';

    if (isStart || isEnd) {
      cellClass += 'bg-blue-600 text-white rounded-full shadow-xs z-10';
    } else if (isInRange) {
      cellClass += 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 rounded-md';
    } else if (isToday) {
      cellClass += 'border-1.5 border-amber-400 text-amber-600 dark:text-amber-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800';
    } else {
      cellClass += 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full';
    }

    dayCells.push(
      <button
        key={`curr-${day}`}
        type="button"
        onClick={() => handleDayClick(day)}
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

  const isFiltered = value && value !== 'Select date range' && value !== 'All Dates';

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button - Clean, spacious & matching Figma */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 flex items-center justify-between gap-2.5 px-3.5 bg-white dark:bg-[#141824] border rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs transition-all cursor-pointer ${
          isOpen
            ? 'border-blue-600 ring-2 ring-blue-600/20'
            : isFiltered
            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          <Icon
            name="Calendar"
            size={15}
            className={`shrink-0 ${isFiltered ? 'text-blue-600' : 'text-slate-400'}`}
          />
          <span className="truncate">
            {isFiltered ? value : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isFiltered && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear date filter"
            >
              <Icon name="X" size={12} />
            </span>
          )}
          <Icon
            name={isOpen ? 'ChevronUp' : 'ChevronDown'}
            size={15}
            className={`text-slate-400 transition-colors ${isOpen ? 'text-blue-600' : ''}`}
          />
        </div>
      </button>

      {/* Mobile Calendar Popover - Exact match to Figma Node 537:8173 */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-[80] w-[335px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#141824] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Quick presets pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-slate-100 dark:border-slate-800">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#f1f5f9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
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
                {MONTH_NAMES[currentMonth]}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentYear}
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

          {/* Weekday Row: M T W T F S S (Figma layout) */}
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
              <span className="w-2.5 h-2.5 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-600" />
              <span>In Range</span>
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
              onClick={handleClear}
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
