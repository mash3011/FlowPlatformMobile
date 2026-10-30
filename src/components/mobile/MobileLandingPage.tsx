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

interface MobileLandingPageProps {
  onOpenSidebar: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

// Chart dataset matching the Figma chart (Carbon vs Plastic Savings)
const chartData = [
  { month: 'Jan', carbon: 4900, plastic: 4500 },
  { month: 'Feb', carbon: 4800, plastic: 4100 },
  { month: 'Mar', carbon: 5300, plastic: 5600 },
  { month: 'Apr', carbon: 6500, plastic: 8200 },
  { month: 'May', carbon: 9000, plastic: 7600 },
  { month: 'Jun', carbon: 8500, plastic: 6800 },
  { month: 'Jul', carbon: 7900, plastic: 8100 },
  { month: 'Aug', carbon: 8800, plastic: 7800 },
  { month: 'Sep', carbon: 8000, plastic: 6500 },
  { month: 'Oct', carbon: 7000, plastic: 5900 },
  { month: 'Nov', carbon: 6300, plastic: 7200 },
  { month: 'Dec', carbon: 8100, plastic: 8500 },
];

export const MobileLandingPage: React.FC<MobileLandingPageProps> = ({
  onOpenSidebar,
  activeNavTab = 'home',
  onSelectNavTab,
}) => {
  const [timeFilter, setTimeFilter] = useState<'D' | 'W' | 'M' | 'Y'>('Y');
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0c0f17] text-slate-900 dark:text-white font-sans relative">
      {/* ========================================================================= */}
      {/* TOP BAR: Hamburger Menu | "Flow Platform" (bold centered) | 3-Dot More Menu */}
      {/* Bottom corner radius is exactly 16px (rounded-b-2xl) */}
      {/* ========================================================================= */}
      <header className="h-14 bg-[#1e1e24] text-white flex items-center justify-between px-4 shrink-0 z-30 shadow-md rounded-b-2xl relative">
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

        {/* 3-Dot More Menu Button & Dropdown matching Screenshot 1 */}
        <div className="relative">
          <button
            onClick={() => setIsThreeDotMenuOpen(!isThreeDotMenuOpen)}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            title="More Options"
          >
            <Icon name="MoreVertical" size={19} strokeWidth={2.2} />
          </button>

          {/* 3-Dot Dropdown Menu */}
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

      {/* Preferences Modal matching Screenshot 2 */}
      <MobilePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      {/* ========================================================================= */}
      {/* SCROLLABLE SCREEN CONTENT (EXACT FIGMA 1123-8536 LAYOUT) */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
        {/* Title Header: "Impact Savings" + Edit Icon + Filter Icon */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Impact Savings
          </h2>

          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit"
            >
              <Icon name="Edit3" size={18} strokeWidth={2} />
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Filter"
            >
              <Icon name="Filter" size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 STAT CARDS (2x2 GRID) */}
        {/* Light mint green background (#f0fdf4 / #f2faf5) with emerald icons */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Carbon Savings */}
          <div className="bg-[#f0fbf5] dark:bg-[#142322] rounded-2xl p-3.5 flex flex-col justify-between h-[116px] shadow-2xs border border-[#e2f5eb] dark:border-emerald-950/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Carbon savings
              </span>
              <span className="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 block">
                46,212 kg+
              </span>
            </div>
            <div className="flex justify-end">
              <Icon name="Leaf" size={22} className="text-[#10b981] fill-[#10b981]" />
            </div>
          </div>

          {/* Card 2: Plastic Savings */}
          <div className="bg-[#f0fbf5] dark:bg-[#142322] rounded-2xl p-3.5 flex flex-col justify-between h-[116px] shadow-2xs border border-[#e2f5eb] dark:border-emerald-950/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Plastic savings
              </span>
              <span className="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 block">
                12,360 kg+
              </span>
            </div>
            <div className="flex justify-end">
              <Icon name="Recycle" size={22} className="text-[#10b981]" strokeWidth={2.4} />
            </div>
          </div>

          {/* Card 3: Total Reuse Count */}
          <div className="bg-[#f0fbf5] dark:bg-[#142322] rounded-2xl p-3.5 flex flex-col justify-between h-[116px] shadow-2xs border border-[#e2f5eb] dark:border-emerald-950/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Total reuse count
              </span>
              <span className="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 block">
                15,643
              </span>
            </div>
            <div className="flex justify-end">
              <Icon name="RotateCcw" size={22} className="text-[#10b981]" strokeWidth={2.4} />
            </div>
          </div>

          {/* Card 4: Footballs Saved */}
          <div className="bg-[#f0fbf5] dark:bg-[#142322] rounded-2xl p-3.5 flex flex-col justify-between h-[116px] shadow-2xs border border-[#e2f5eb] dark:border-emerald-950/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Footballs saved
              </span>
              <span className="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 block">
                200
              </span>
            </div>
            <div className="flex justify-end">
              <Icon name="CircleDot" size={22} className="text-[#10b981]" strokeWidth={2.4} />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CHART CARD: Carbon/Plastic savings + D W M Y Pill */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#141824] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Carbon/Plastic savings
            </h3>

            {/* D W M Y Time Period Filter Pill */}
            <div className="flex items-center bg-[#f1f3f6] dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              {(['D', 'W', 'M', 'Y'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                    timeFilter === filter
                      ? 'bg-[#1e1e24] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  domain={[0, 10000]}
                  ticks={[2000, 4000, 6000, 8000, 10000]}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e24',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                {/* Blue solid line */}
                <Line
                  type="monotone"
                  dataKey="carbon"
                  stroke="#3b82f6"
                  strokeWidth={2.2}
                  dot={false}
                />
                {/* Green dashed line */}
                <Line
                  type="monotone"
                  dataKey="plastic"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAST EVENT IMPACT SECTION */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#141824] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Last Event Impact
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
            {/* Event 1 */}
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Derby County...
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Leaf" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Recycle" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                03 Sep, 2025
              </span>
            </div>

            {/* Event 2 */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Electric Daisy
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Leaf" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Recycle" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                11 Oct, 2025
              </span>
            </div>

            {/* Event 3 */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Notts County...
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Icon name="Leaf" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Recycle" size={11} className="text-[#10b981]" />
                    <span>156 kg</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                9 Nov, 2025
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LATEST IMPACT REPORTS SECTION */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#141824] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Latest Impact Reports
            </h3>
            <button className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
            {/* Report 1 */}
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Q1 2025 Impact Report
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Notts County Football Club
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                30th Sep, 2025
              </span>
            </div>

            {/* Report 2 */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  April 2025 Impact Report
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Derby County Football Club
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                15th Sep, 2025
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM NAV BAR (EXACT FIGMA 1123-8727 DESIGN) */}
      {/* Dark bar with Home, Stock Check, Center Floating Plus Button (+), Calendar, Batch */}
      {/* ========================================================================= */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1e1e24] text-slate-400 flex items-center justify-around px-2 z-30 shadow-2xl">
        {/* Home */}
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('home')}
          className="flex flex-col items-center justify-center gap-0.5 text-[#10b981] cursor-pointer flex-1"
        >
          <Icon name="Home" size={18} strokeWidth={2.4} />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Stock Check */}
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('stock-check')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Layers" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Stock Check</span>
        </button>

        {/* Center Floating Plus (+) Action Button */}
        <div className="relative -top-5 flex items-center justify-center px-2">
          <button
            onClick={() => onSelectNavTab && onSelectNavTab('add')}
            className="w-13 h-13 rounded-full bg-[#10b981] hover:bg-[#059669] text-white border-4 border-[#1e1e24] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Create New"
          >
            <Icon name="Plus" size={26} strokeWidth={2.8} />
          </button>
        </div>

        {/* Calendar */}
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('calendar')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Calendar" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Calendar</span>
        </button>

        {/* Batch */}
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('batch')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Archive" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Batch</span>
        </button>
      </nav>
    </div>
  );
};
