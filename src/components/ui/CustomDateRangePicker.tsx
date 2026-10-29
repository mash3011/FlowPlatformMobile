import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface DateRangeValue {
  startDate: string; // DD/MM/YYYY or YYYY-MM-DD
  endDate: string;
  label?: string;
}

export interface CustomDateRangePickerProps {
  value?: string | DateRangeValue;
  onChange: (value: string, range?: DateRangeValue) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showPresets?: boolean;
  presetMode?: 'default' | 'months';
}

const DEFAULT_PRESETS = [
  'Today',
  'Yesterday',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'Last 12 months',
  'Last week',
  'Last month',
  'Custom',
];

const MONTH_PRESETS = [
  'September 2026 (Current)',
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
  'March 2026',
  'February 2026',
  'January 2026',
  'Custom',
];

// Helper to format Date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Helper to parse DD/MM/YYYY to Date object
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

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  value = 'Select date range',
  onChange,
  placeholder = 'Select date range',
  className = '',
  buttonClassName = '',
  align = 'right',
  isOpen: controlledIsOpen,
  onOpenChange,
  showPresets = true,
  presetMode = 'default',
}) => {
  const presetOptions = presetMode === 'months' ? MONTH_PRESETS : DEFAULT_PRESETS;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isPopoverOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    setInternalIsOpen(open);
  };

  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');

  // Currently shown reference year/month for Left and Right Calendars
  // Default to September 2026 & October 2026 as in Figma
  const [leftMonth, setLeftMonth] = useState<number>(8); // 0-indexed: 8 = September
  const [leftYear, setLeftYear] = useState<number>(2026);

  const [rightMonth, setRightMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [rightYear, setRightYear] = useState<number>(2026);

  // Active start and end dates (DD/MM/YYYY string)
  const [startDateInput, setStartDateInput] = useState<string>('01/09/2026');
  const [endDateInput, setEndDateInput] = useState<string>('30/09/2026');

  // Selection flow state (picking start date vs end date on calendar)
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');
  const [dropUp, setDropUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto detect if popover should open upwards when space below is tight AND ample space exists above
  useEffect(() => {
    if (isPopoverOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Only dropUp if space below is less than 400 AND space above is at least 480px so top doesn't get cut off
      if (spaceBelow < 400 && rect.top >= 480) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [isPopoverOpen]);

  // Close popover when clicking outside cleanly
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (isPopoverOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isPopoverOpen]);

  // Sync display value when prop changes
  const displayLabel = typeof value === 'string' ? value : value?.label || `${value.startDate} - ${value.endDate}`;

  // Handle Preset Button Click
  const handleSelectPreset = (preset: string) => {
    setSelectedPreset(preset);
    const today = new Date(2026, 8, 14); // September 14, 2026

    let start = new Date(today);
    let end = new Date(today);

    // Month presets handling
    if (preset.includes('September 2026')) {
      start = new Date(2026, 8, 1);
      end = new Date(2026, 8, 30);
    } else if (preset === 'August 2026') {
      start = new Date(2026, 7, 1);
      end = new Date(2026, 7, 31);
    } else if (preset === 'July 2026') {
      start = new Date(2026, 6, 1);
      end = new Date(2026, 6, 31);
    } else if (preset === 'June 2026') {
      start = new Date(2026, 5, 1);
      end = new Date(2026, 5, 30);
    } else if (preset === 'May 2026') {
      start = new Date(2026, 4, 1);
      end = new Date(2026, 4, 31);
    } else if (preset === 'April 2026') {
      start = new Date(2026, 3, 1);
      end = new Date(2026, 3, 30);
    } else if (preset === 'March 2026') {
      start = new Date(2026, 2, 1);
      end = new Date(2026, 2, 31);
    } else if (preset === 'February 2026') {
      start = new Date(2026, 1, 1);
      end = new Date(2026, 1, 28);
    } else if (preset === 'January 2026') {
      start = new Date(2026, 0, 1);
      end = new Date(2026, 0, 31);
    } else {
      switch (preset) {
        case 'Today':
          break;
        case 'Yesterday':
          start.setDate(today.getDate() - 1);
          end.setDate(today.getDate() - 1);
          break;
        case 'Last 7 days':
          start.setDate(today.getDate() - 6);
          break;
        case 'Last 30 days':
          start.setDate(today.getDate() - 29);
          break;
        case 'Last 90 days':
          start.setDate(today.getDate() - 89);
          break;
        case 'Last 12 months':
          start.setFullYear(today.getFullYear() - 1);
          break;
        case 'Last week':
          start.setDate(today.getDate() - today.getDay() - 7);
          end.setDate(start.getDate() + 6);
          break;
        case 'Last month':
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
        case 'Custom':
        default:
          return;
      }
    }

    const startStr = formatDate(start);
    const endStr = formatDate(end);
    setStartDateInput(startStr);
    setEndDateInput(endStr);

    // Sync month views
    setLeftMonth(start.getMonth());
    setLeftYear(start.getFullYear());

    let rMonth = start.getMonth() + 1;
    let rYear = start.getFullYear();
    if (rMonth > 11) {
      rMonth = 0;
      rYear += 1;
    }
    setRightMonth(rMonth);
    setRightYear(rYear);
  };

  // Nav month handlers
  const handleLeftPrevMonth = () => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear((y) => y - 1);
    } else {
      setLeftMonth((m) => m - 1);
    }
  };

  const handleLeftNextMonth = () => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear((y) => y + 1);
    } else {
      setLeftMonth((m) => m + 1);
    }
  };

  const handleRightPrevMonth = () => {
    if (rightMonth === 0) {
      setRightMonth(11);
      setRightYear((y) => y - 1);
    } else {
      setRightMonth((m) => m - 1);
    }
  };

  const handleRightNextMonth = () => {
    if (rightMonth === 11) {
      setRightMonth(0);
      setRightYear((y) => y + 1);
    } else {
      setRightMonth((m) => m + 1);
    }
  };

  // Handle Day Click on Calendar Grid
  const handleDayClick = (year: number, month: number, day: number) => {
    const clickedDate = new Date(year, month, day);
    const formatted = formatDate(clickedDate);

    if (selectingStep === 'start') {
      setStartDateInput(formatted);
      setEndDateInput('');
      setSelectingStep('end');
      setSelectedPreset('Custom');
    } else {
      const startDateObj = parseDateStr(startDateInput);
      if (startDateObj && clickedDate < startDateObj) {
        setStartDateInput(formatted);
        setEndDateInput('');
        setSelectingStep('end');
      } else {
        setEndDateInput(formatted);
        setSelectingStep('start');
      }
      setSelectedPreset('Custom');
    }
  };

  // Check if a date is start date, end date, or in range
  const getDateState = (year: number, month: number, day: number) => {
    const current = new Date(year, month, day).getTime();
    const sObj = parseDateStr(startDateInput);
    const eObj = parseDateStr(endDateInput);

    const sTime = sObj ? sObj.getTime() : null;
    const eTime = eObj ? eObj.getTime() : null;

    const isStart = sTime !== null && current === sTime;
    const isEnd = eTime !== null && current === eTime;
    const isInRange = sTime !== null && eTime !== null && current > sTime && current < eTime;

    return { isStart, isEnd, isInRange };
  };

  // Helper to render days grid for a given month/year
  const renderMonthCalendar = (
    year: number,
    month: number,
    onPrev: () => void,
    onNext: () => void
  ) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Monday start: 0 = Mon, 6 = Sun
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const dayCells = [];

    // Prev month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      dayCells.push(
        <div
          key={`prev-${dayNum}`}
          className="w-[34px] h-[34px] flex items-center justify-center text-[12px] font-medium text-slate-300 dark:text-slate-600 select-none"
        >
          {String(dayNum).padStart(2, '0')}
        </div>
      );
    }

    // Days 1..totalDays
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const { isStart, isEnd, isInRange } = getDateState(year, month, day);
      const isToday =
        new Date(year, month, day).toDateString() === new Date(2026, 8, 18).toDateString();

      let cellClass =
        'w-[34px] h-[34px] text-[12px] font-semibold flex items-center justify-center cursor-pointer transition-all select-none ';

      if (isStart || isEnd) {
        cellClass += 'bg-blue-600 text-white font-bold rounded-full shadow-xs z-10';
      } else if (isInRange) {
        cellClass += 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold rounded-xl';
      } else if (isToday) {
        cellClass += 'border-1.5 border-amber-400 text-amber-600 dark:text-amber-400 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800';
      } else {
        cellClass += 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-semibold';
      }

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => handleDayClick(year, month, day)}
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
          className="w-[34px] h-[34px] flex items-center justify-center text-[12px] font-medium text-slate-300 dark:text-slate-600 select-none"
        >
          {String(d).padStart(2, '0')}
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between relative py-1 px-1">
          <button
            type="button"
            onClick={onPrev}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
            title="Previous Month"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {monthNames[month]}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {year}
            </span>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
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

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 py-1 justify-items-center">
          {dayCells}
        </div>
      </div>
    );
  };

  const handleClear = () => {
    setStartDateInput('');
    setEndDateInput('');
    onChange('Select date range', {
      startDate: '',
      endDate: '',
      label: 'Select date range',
    });
    setOpen(false);
  };

  const handleApply = () => {
    const formattedRange = `${startDateInput} - ${endDateInput}`;
    onChange(formattedRange, {
      startDate: startDateInput,
      endDate: endDateInput,
      label: formattedRange,
    });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button matching CustomSelect styling */}
      <button
        type="button"
        onClick={() => setOpen(!isPopoverOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm font-medium text-[#241F20] dark:text-slate-200 bg-white dark:bg-[#0d131f] border rounded-lg shadow-2xs transition-all cursor-pointer ${
          isPopoverOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500'
            : 'border-[#EDEDED] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          <Icon name="Calendar" size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">{displayLabel}</span>
        </div>
        <Icon
          name={isPopoverOpen ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className={`shrink-0 text-slate-400 transition-colors ${
            isPopoverOpen ? 'text-blue-500' : ''
          }`}
        />
      </button>

      {/* Date Range Picker Popover Dropdown matching Figma node 1042-10611 */}
      {isPopoverOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } z-[90] bg-white dark:bg-[#0d131f] border border-[#e5e7eb] dark:border-slate-800 rounded-[12px] shadow-2xl drop-shadow-[0px_18px_24px_rgba(0,0,0,0.22)] p-4 sm:p-5 flex flex-col md:flex-row gap-5 ${
            showPresets
              ? 'w-[calc(100vw-32px)] max-w-[340px] md:max-w-none md:w-auto md:min-w-[700px]'
              : 'w-[calc(100vw-32px)] max-w-[340px] md:max-w-none md:w-auto md:min-w-[530px]'
          } max-h-[calc(100vh-100px)] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150`}
        >
          {/* LEFT SIDEBAR: PRESET PERIODS (CONDITIONALLY RENDERED) */}
          {showPresets && (
            <div className="w-full md:w-[170px] border-r border-[#e5e7eb] dark:border-slate-800 pr-4 shrink-0 space-y-3">
              <h4 className="text-[14px] font-semibold text-[#1a2333] dark:text-slate-100">
                {presetMode === 'months' ? 'Months' : 'Preset Periods'}
              </h4>
              <div className="space-y-1">
                {presetOptions.map((preset) => {
                  const isActive = selectedPreset === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-[6px] border text-[12px] transition-all cursor-pointer ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#6c757d] dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT PANEL: CUSTOM RANGE & CALENDARS */}
          <div className="flex-1 flex flex-col gap-4">
            <h4 className="text-[14px] font-semibold text-[#1a2333] dark:text-slate-100">
              Custom Range
            </h4>

            {/* Inputs Row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Start date (DD/MM/YYYY)"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-[4px] border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1a2333] dark:text-slate-100 text-xs placeholder-[#8b95a7] focus:outline-none focus:border-blue-500 font-sans"
              />
              <span className="text-[#8b95a7] font-bold text-sm">→</span>
              <input
                type="text"
                placeholder="End date (DD/MM/YYYY)"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-[4px] border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1a2333] dark:text-slate-100 text-xs placeholder-[#8b95a7] focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* Dual Calendars Side-by-Side */}
            <div className="flex flex-col sm:flex-row gap-6 pt-1">
              {renderMonthCalendar(
                leftYear,
                leftMonth,
                handleLeftPrevMonth,
                handleLeftNextMonth
              )}
              <div className="hidden sm:block">
                {renderMonthCalendar(
                  rightYear,
                  rightMonth,
                  handleRightPrevMonth,
                  handleRightNextMonth
                )}
              </div>
            </div>

            {/* Legend Row matching Figma */}
            <div className="flex items-center justify-center gap-5 py-2 text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
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

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Reset
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
