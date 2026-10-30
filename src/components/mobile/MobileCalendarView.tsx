import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobileCalendarViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

export const MobileCalendarView: React.FC<MobileCalendarViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'calendar',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');
  const [selectedDay, setSelectedDay] = useState<number>(30);

  // October 2026 Calendar days matching Image 5
  // Days of week: S M T W T F S
  // Sep 27-30 preceding, Oct 1-31
  const daysHeader = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarRows = [
    [
      { d: 27, currentMonth: false },
      { d: 28, currentMonth: false },
      { d: 29, currentMonth: false },
      { d: 30, currentMonth: false },
      { d: 1, currentMonth: true },
      { d: 2, currentMonth: true },
      { d: 3, currentMonth: true },
    ],
    [
      { d: 4, currentMonth: true },
      { d: 5, currentMonth: true },
      { d: 6, currentMonth: true },
      { d: 7, currentMonth: true },
      { d: 8, currentMonth: true },
      { d: 9, currentMonth: true },
      { d: 10, currentMonth: true },
    ],
    [
      { d: 11, currentMonth: true },
      { d: 12, currentMonth: true },
      { d: 13, currentMonth: true },
      { d: 14, currentMonth: true },
      { d: 15, currentMonth: true },
      { d: 16, currentMonth: true },
      { d: 17, currentMonth: true },
    ],
    [
      { d: 18, currentMonth: true },
      { d: 19, currentMonth: true },
      { d: 20, currentMonth: true },
      { d: 21, currentMonth: true },
      { d: 22, currentMonth: true },
      { d: 23, currentMonth: true },
      { d: 24, currentMonth: true },
    ],
    [
      { d: 25, currentMonth: true },
      { d: 26, currentMonth: true },
      { d: 27, currentMonth: true },
      { d: 28, currentMonth: true },
      { d: 29, currentMonth: true },
      { d: 30, currentMonth: true, isToday: true },
      { d: 31, currentMonth: true },
    ],
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7f6] text-slate-900 font-sans relative select-none">
      {/* Header */}
      <header className="h-14 bg-[#1f2937] text-white flex items-center justify-between px-4 shrink-0 z-30 shadow-md rounded-b-2xl relative">
        <button
          onClick={onOpenSidebar}
          className="p-1 rounded-lg text-white hover:text-slate-300 transition-colors cursor-pointer"
          title="Open Navigation Menu"
        >
          <Icon name="Menu" size={22} strokeWidth={2.2} />
        </button>

        <h1 className="text-[17px] font-bold tracking-tight text-white select-none">
          Flow Platform
        </h1>

        <div className="relative">
          <button
            onClick={() => setIsThreeDotMenuOpen(!isThreeDotMenuOpen)}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            title="More Options"
          >
            <Icon name="MoreVertical" size={19} strokeWidth={2.2} />
          </button>

          {isThreeDotMenuOpen && (
            <div className="absolute top-[42px] right-0 w-44 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  setIsPreferencesOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="Settings" size={15} className="text-slate-400" />
                <span>Preferences</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.info('No new notifications');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="Bell" size={15} className="text-slate-400" />
                <span>Notifications</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.info('Help center: support@flowplatform.com');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="HelpCircle" size={15} className="text-slate-400" />
                <span>Help</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.success('Logged out successfully');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-red-50 transition-colors cursor-pointer text-xs font-semibold text-red-600"
              >
                <Icon name="LogOut" size={15} className="text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Preferences Drawer */}
      <MobilePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={(th) => setCurrentTheme(th)}
      />

      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4 no-scrollbar">
        {/* Title Bar: Calendar + Updated just now pill + Filter Sliders + 3-Dot More */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Calendar
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-slate-200 text-[10.5px] font-semibold text-slate-600 shadow-2xs">
              <span>Updated just now</span>
              <Icon name="RefreshCw" size={11} className="text-[#2e7d5b]" />
            </div>
            <button
              onClick={() => toast.info('Filters applied')}
              className="p-1 rounded-lg text-[#2e7d5b] hover:bg-[#e7eee9] transition-colors cursor-pointer"
              title="Filter"
            >
              <Icon name="SlidersHorizontal" size={18} strokeWidth={2.2} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <Icon name="MoreVertical" size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Month Card matching Image 5 (Green Theme) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 space-y-3">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between px-2">
            <button className="p-1 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer">
              <Icon name="ChevronLeft" size={16} />
            </button>
            <span className="text-[14px] font-bold text-slate-800">October 2026</span>
            <button className="p-1 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer">
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 text-center">
            {daysHeader.map((d, i) => (
              <span key={i} className="text-[11px] font-semibold text-slate-400">
                {d}
              </span>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="space-y-1">
            {calendarRows.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-7 text-center">
                {row.map((cell, cIdx) => {
                  const isCurrent = cell.currentMonth;
                  const isSelected = isCurrent && cell.d === selectedDay;
                  return (
                    <div key={cIdx} className="h-8 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (isCurrent) setSelectedDay(cell.d);
                        }}
                        className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          !isCurrent
                            ? 'text-slate-300'
                            : isSelected
                            ? 'border-2 border-[#2e7d5b] text-[#2e7d5b] font-bold bg-[#f0fbf5]'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cell.d}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 my-2" />

          {/* Dots Legend matching Image 5 */}
          <div className="flex items-center justify-center gap-3 text-[10.5px] font-medium text-slate-600 flex-wrap pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2e7d5b]" />
              <span>Delivered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e11d48]" />
              <span>Collection Request</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* 2x2 Summary Metric Cards (Consistent Card Design) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Delivered */}
          <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
              <Icon name="Truck" size={20} strokeWidth={2.2} />
            </div>
            <div className="pl-10">
              <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                Delivered
              </h3>
            </div>
            <div className="self-end">
              <span className="text-2xl font-extrabold leading-none text-slate-900">
                0
              </span>
            </div>
          </div>

          {/* Card 2: Collected */}
          <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 right-0 w-11 h-11 bg-[#166050] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
              <Icon name="Truck" size={20} strokeWidth={2.2} />
            </div>
            <div className="pr-10">
              <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                Collected
              </h3>
            </div>
            <div className="self-start">
              <span className="text-2xl font-extrabold leading-none text-slate-900">
                0
              </span>
            </div>
          </div>

          {/* Card 3: Collection Request */}
          <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
              <Icon name="Truck" size={20} strokeWidth={2.2} />
            </div>
            <div className="pl-10">
              <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                Collection Request
              </h3>
            </div>
            <div className="self-end">
              <span className="text-2xl font-extrabold leading-none text-slate-900">
                0
              </span>
            </div>
          </div>

          {/* Card 4: Unverified */}
          <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 right-0 w-11 h-11 bg-[#166050] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
              <Icon name="HelpCircle" size={20} strokeWidth={2.2} />
            </div>
            <div className="pr-10">
              <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">
                Unverified
              </h3>
            </div>
            <div className="self-start">
              <span className="text-2xl font-extrabold leading-none text-slate-900">
                0
              </span>
            </div>
          </div>
        </div>

        {/* Deliveries Section matching Image 5 */}
        <div className="space-y-2.5">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Deliveries
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 rounded-full bg-[#2e7d5b] text-white text-xs font-bold shadow-xs cursor-pointer">
              All
            </button>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 flex items-center justify-center text-center shadow-xs">
            <span className="text-xs font-semibold text-slate-400">
              No data available
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar with Calendar Active */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1f2937] text-white flex items-center justify-around px-2 z-30 shadow-2xl rounded-t-2xl">
        <button
          onClick={() => onSelectNavTab?.('impact-savings')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <Icon name="Home" size={18} />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => onSelectNavTab?.('stock-info')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <Icon name="ClipboardCheck" size={18} />
          <span className="text-[10px] font-bold">Stock</span>
        </button>

        {/* Center Green FAB Plus Button */}
        <div className="relative -top-5">
          <button
            onClick={() => onOpenSidebar()}
            className="w-13 h-13 rounded-full bg-[#2e7d5b] hover:bg-[#25664a] text-white flex items-center justify-center shadow-lg border-4 border-[#1f2937] active:scale-95 transition-transform cursor-pointer"
            title="Add / Actions"
          >
            <Icon name="Plus" size={22} strokeWidth={3} />
          </button>
        </div>

        <button
          onClick={() => onSelectNavTab?.('calendar')}
          className="flex flex-col items-center justify-center gap-0.5 text-[#10b981] font-bold cursor-pointer py-1"
        >
          <Icon name="Calendar" size={18} />
          <span className="text-[10px]">Calendar</span>
        </button>

        <button
          onClick={() => onSelectNavTab?.('tech-bin-dashboard')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <Icon name="Archive" size={18} />
          <span className="text-[10px] font-bold">Batch</span>
        </button>
      </nav>
    </div>
  );
};
