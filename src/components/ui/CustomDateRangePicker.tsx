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
  align?: 'left' | 'right';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showPresets?: boolean;
}

const PRESET_OPTIONS = [
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
  align = 'right',
  isOpen: controlledIsOpen,
  onOpenChange,
  showPresets = true,
}) => {
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

  // Auto detect if popover should open upwards when space below is tight
  useEffect(() => {
    if (isPopoverOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 380 && rect.top > 320) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [isPopoverOpen]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Sync display value when prop changes
  const displayLabel = typeof value === 'string' ? value : value?.label || `${value.startDate} - ${value.endDate}`;

  // Handle Preset Button Click
  const handleSelectPreset = (preset: string) => {
    setSelectedPreset(preset);
    const today = new Date(2026, 8, 14); // September 14, 2026

    let start = new Date(today);
    let end = new Date(today);

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

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const dayCells = [];
    // Leading blank slots
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`blank-${i}`} className="w-[33px] h-[32px]" />);
    }

    // Days 1..totalDays
    for (let day = 1; day <= totalDays; day++) {
      const { isStart, isEnd, isInRange } = getDateState(year, month, day);

      let cellClass =
        'w-[33px] h-[32px] rounded-[6px] text-[12px] flex items-center justify-center cursor-pointer transition-all font-normal ';

      if (isStart || isEnd) {
        cellClass += 'bg-blue-600 text-white font-bold shadow-xs';
      } else if (isInRange) {
        cellClass += 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold rounded-[2px]';
      } else {
        cellClass += 'text-[#1a2333] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
      }

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => handleDayClick(year, month, day)}
          className={cellClass}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="flex-1 flex flex-col gap-2 min-w-[240px]">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between relative py-1 px-1">
          <button
            type="button"
            onClick={onPrev}
            className="w-6 h-6 rounded-[4px] text-[#8b95a7] hover:text-[#1a2333] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-lg leading-none cursor-pointer"
          >
            ‹
          </button>
          <div className="text-[15px] font-semibold text-[#1a2333] dark:text-slate-100">
            {monthNames[month]} {year}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="w-6 h-6 rounded-[4px] text-[#8b95a7] hover:text-[#1a2333] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-lg leading-none cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[12px] text-[#8b95a7] font-normal">
          <div className="w-[33px] h-[32px] flex items-center justify-center">Su</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">Mo</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">Tu</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">We</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">Th</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">Fr</div>
          <div className="w-[33px] h-[32px] flex items-center justify-center">Sa</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-0.5 pt-1">{dayCells}</div>
      </div>
    );
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
        }`}
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
          } z-[90] bg-white dark:bg-[#0d131f] border border-[#e5e7eb] dark:border-slate-800 rounded-[12px] shadow-2xl drop-shadow-[0px_18px_24px_rgba(0,0,0,0.22)] p-5 flex flex-col md:flex-row gap-5 ${
            showPresets ? 'min-w-[700px]' : 'min-w-[530px]'
          } animate-in fade-in-50 zoom-in-95 duration-150`}
        >
          {/* LEFT SIDEBAR: PRESET PERIODS (CONDITIONALLY RENDERED) */}
          {showPresets && (
            <div className="w-full md:w-[170px] border-r border-[#e5e7eb] dark:border-slate-800 pr-4 shrink-0 space-y-3">
              <h4 className="text-[14px] font-semibold text-[#1a2333] dark:text-slate-100">
                Preset Periods
              </h4>
              <div className="space-y-1">
                {PRESET_OPTIONS.map((preset) => {
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
              {renderMonthCalendar(
                rightYear,
                rightMonth,
                handleRightPrevMonth,
                handleRightNextMonth
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-1.5 rounded-[6px] border border-[#e5e7eb] dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
