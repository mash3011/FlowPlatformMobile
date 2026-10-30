import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface MobileImpactSavingsViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

const savingsChartData = [
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 0 },
  { month: 'Mar', value: 0 },
  { month: 'Apr', value: 0 },
  { month: 'May', value: 0 },
  { month: 'Jun', value: 0 },
  { month: 'Jul', value: 0 },
  { month: 'Aug', value: 0 },
  { month: 'Sep', value: 0 },
  { month: 'Oct', value: 0 },
  { month: 'Nov', value: 0 },
  { month: 'Dec', value: 0 },
];

export const MobileImpactSavingsView: React.FC<MobileImpactSavingsViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'impact-savings',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');
  const [timePeriod, setTimePeriod] = useState<'D' | 'W' | 'M' | 'Y'>('Y');

  // 7 Metric cards matching Image 2 in Green Theme
  const impactCards = [
    { id: 1, side: 'left' as const, label: 'Total Reuse Count', value: '105', icon: 'RotateCcw' },
    { id: 2, side: 'right' as const, label: 'Carbon Savings', value: '8 Kg', icon: 'Leaf' },
    { id: 3, side: 'left' as const, label: 'Plastic Savings', value: '2 Kg', icon: 'Recycle' },
    { id: 4, side: 'right' as const, label: 'Natural Resources Savings', value: '0', icon: 'Clover' },
    { id: 5, side: 'left' as const, label: 'Water Savings', value: '2 L', icon: 'Droplets' },
    { id: 6, side: 'right' as const, label: 'Returned Oil', value: '16', icon: 'FlaskConical' },
    { id: 7, side: 'left' as const, label: 'Cocktail Shaker Saved', value: '7 Cocktail Shaker', icon: 'Maximize2' },
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
        {/* Title Bar: Impact Savings + Updated 2 min ago pill + Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Impact Savings
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-slate-200 text-[10.5px] font-semibold text-slate-600 shadow-2xs">
              <span>Updated 2 min ago</span>
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

        {/* 2-Column Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {impactCards.map((item) => {
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
                  <div className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Icon name={item.icon} size={16} strokeWidth={2.2} />
                  </div>

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

        {/* Chart Card: Carbon/Plastic Savings */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-bold text-slate-900 tracking-tight">
              Carbon/Plastic Savings
            </h3>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <Icon name="MoreVertical" size={15} />
            </button>
          </div>

          {/* D W M Y Pill Selector */}
          <div className="inline-flex bg-[#f1f4f6] p-0.5 rounded-lg border border-slate-200/60">
            {(['D', 'W', 'M', 'Y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                  timePeriod === period
                    ? 'bg-[#164e3f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Line Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 10]} ticks={[0]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2e7d5b"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#2e7d5b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1f2937] text-white flex items-center justify-around px-2 z-30 shadow-2xl rounded-t-2xl">
        <button
          onClick={() => onSelectNavTab?.('impact-savings')}
          className="flex flex-col items-center justify-center gap-0.5 text-[#10b981] font-bold cursor-pointer py-1"
        >
          <Icon name="Home" size={18} />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onSelectNavTab?.('stock-check')}
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
