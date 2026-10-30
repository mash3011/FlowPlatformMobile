import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobileTechBinViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

export const MobileTechBinView: React.FC<MobileTechBinViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'tech-bin-dashboard',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');

  // 9 Metric cards matching Image 3 exactly in Green Theme
  const techBinCards = [
    { id: 1, side: 'left' as const, label: 'Today Deposit Returned', value: '0', icon: 'RotateCcw' },
    { id: 2, side: 'right' as const, label: 'Total Deposit Returned', value: '14', icon: 'RotateCcw' },
    { id: 3, side: 'left' as const, label: 'Total Deposited', value: '0', icon: 'RotateCcw' },
    { id: 4, side: 'right' as const, label: 'Total Money Attached', value: '0', icon: 'RotateCcw' },
    { id: 5, side: 'left' as const, label: 'Today Refilled', value: '0', icon: 'RotateCcw' },
    { id: 6, side: 'right' as const, label: 'Total Refilled', value: '9', icon: 'RotateCcw' },
    { id: 7, side: 'left' as const, label: 'Items in Bin', value: '77', icon: 'RotateCcw' },
    { id: 8, side: 'right' as const, label: 'Active Bins', value: '2', icon: 'RotateCcw' },
    { id: 9, side: 'left' as const, label: 'returned Without Deposit', value: '0', icon: 'RotateCcw' },
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
        {/* Title Bar: Tech Bin + Updated just now pill + Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Tech Bin
          </h2>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* 2-Column Metric Cards Grid (Consistent Card Design) */}
        <div className="grid grid-cols-2 gap-3">
          {techBinCards.map((item) => {
            const isLeft = item.side === 'left';
            const isFullWidth = item.id === 9;
            return (
              <div
                key={item.id}
                className={`relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs ${
                  isFullWidth ? 'col-span-2' : ''
                }`}
              >
                {/* Corner Badge */}
                <div
                  className={`absolute top-0 w-11 h-11 flex items-center justify-center text-white shadow-xs ${
                    isLeft
                      ? 'left-0 rounded-tl-2xl rounded-br-2xl bg-[#006891]'
                      : 'right-0 rounded-tr-2xl rounded-bl-2xl bg-[#166050]'
                  }`}
                >
                  <Icon name={item.icon} size={20} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <div className={isLeft ? 'pl-10' : 'pr-10'}>
                  <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {item.label}
                  </h3>
                </div>

                {/* Value */}
                <div className={isLeft ? 'self-end' : 'self-start'}>
                  <span className="text-2xl font-extrabold leading-none text-slate-900">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bin Activity Table Section matching Image 3 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 space-y-3">
          <h3 className="text-[13.5px] font-bold text-slate-900 tracking-tight">
            Bin Activity
          </h3>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-bold">
                  <th className="pb-2.5 pr-2 font-bold">Location</th>
                  <th className="pb-2.5 px-2 font-bold">Client</th>
                  <th className="pb-2.5 px-2 font-bold">Identifier</th>
                  <th className="pb-2.5 pl-2 font-bold text-right">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-2 text-slate-900 font-bold">Kop Container</td>
                  <td className="py-3 px-2 text-slate-600">Notts County</td>
                  <td className="py-3 px-2 font-mono text-[10px] text-slate-500">16013348</td>
                  <td className="py-3 pl-2 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-[#e7eee9] text-[#164e3f] font-bold text-[10px]">
                      SBN
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-2 text-slate-900 font-bold">dcfc new</td>
                  <td className="py-3 px-2 text-slate-600 leading-tight">
                    Derby County Football Club
                  </td>
                  <td className="py-3 px-2 font-mono text-[9.5px] text-slate-500">
                    A62C11BBT5E00105
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-[#e7eee9] text-[#164e3f] font-bold text-[10px]">
                      SBN
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
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
          className="flex flex-col items-center justify-center gap-0.5 text-[#10b981] font-bold cursor-pointer py-1"
        >
          <Icon name="Archive" size={18} />
          <span className="text-[10px]">Batch</span>
        </button>
      </nav>
    </div>
  );
};
