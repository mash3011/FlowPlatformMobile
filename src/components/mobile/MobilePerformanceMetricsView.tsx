import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobilePerformanceMetricsViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

export const MobilePerformanceMetricsView: React.FC<MobilePerformanceMetricsViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'performance-metrics',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');

  // 16 Metric Cards matching Image 1 exactly in Green Theme
  const metrics = [
    { id: 1, side: 'left' as const, label: 'Stock number', value: '0', icon: 'Store' },
    { id: 2, side: 'right' as const, label: 'Return rate', value: '0', icon: 'RefreshCw' },
    { id: 3, side: 'left' as const, label: 'Total tote count', value: '0', icon: 'Package' },
    { id: 4, side: 'right' as const, label: 'In circulation', value: '0', icon: 'UserCheck' },
    { id: 5, side: 'left' as const, label: 'Reused Count', value: '0', icon: 'RotateCcw' },
    { id: 6, side: 'right' as const, label: 'Damaged reusables', value: '0', icon: 'Trash2' },
    { id: 7, side: 'left' as const, label: 'Returned oil count', value: '0', icon: 'FlaskConical' },
    { id: 8, side: 'right' as const, label: 'Bin activity', value: '0', icon: 'Trash2' },
    { id: 9, side: 'left' as const, label: 'Circulayo Connect activity', value: '0', icon: 'QrCode' },
    { id: 10, side: 'right' as const, label: 'Total Washed', value: '0', icon: 'Waves' },
    { id: 11, side: 'left' as const, label: 'Refill count', value: '0', icon: 'Droplet' },
    { id: 12, side: 'right' as const, label: 'Total Unverified Returned', value: '0', icon: 'Droplet' },
    { id: 13, side: 'left' as const, label: 'Total Supplied', value: '0', icon: 'Truck' },
    { id: 14, side: 'right' as const, label: 'Available Stock', value: '0', icon: 'Store' },
    { id: 15, side: 'left' as const, label: 'Circulayo Connect', value: '0', icon: 'QrCode' },
    { id: 16, side: 'right' as const, label: 'Unused Returned', value: '0', icon: 'RotateCcw' },
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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3.5 no-scrollbar">
        {/* Title Bar: Performance Metrics + Filter Sliders */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Performance Metrics
          </h2>
          <button
            onClick={() => toast.info('Filters applied')}
            className="p-1 rounded-lg text-[#2e7d5b] hover:bg-[#e7eee9] transition-colors cursor-pointer"
            title="Filter metrics"
          >
            <Icon name="SlidersHorizontal" size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* 2-Column Metric Cards Grid (Exact corner badge layout in Green Theme) */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((item) => {
            const isLeft = item.side === 'left';
            return (
              <div
                key={item.id}
                className="bg-[#f0fbf5] border border-[#d3ece0] rounded-2xl p-2.5 min-h-[92px] flex flex-col justify-between shadow-2xs relative"
              >
                {/* Top Row: Corner Badge + Label */}
                <div
                  className={`flex items-start justify-between gap-1.5 ${
                    isLeft ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Themed Green Corner Badge Box */}
                  <div className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Icon name={item.icon} size={16} strokeWidth={2.2} />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11.5px] font-bold text-slate-700 leading-tight ${
                      isLeft ? 'text-right' : 'text-left'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Bottom Row: Number Value */}
                <div className={`mt-2 ${isLeft ? 'text-right' : 'text-left'}`}>
                  <span className="text-[18px] font-extrabold text-[#2e7d5b] tracking-tight">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Bar with Theme Green Floating Center Plus Button */}
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
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <Icon name="Calendar" size={18} />
          <span className="text-[10px] font-bold">Calendar</span>
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
