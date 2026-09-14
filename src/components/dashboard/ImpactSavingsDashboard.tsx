import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomDateRangePicker } from '../ui/CustomDateRangePicker';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ImpactSavingsDashboardProps {
  onSelectDashboard?: (dashId: string) => void;
}

export const ImpactSavingsDashboard: React.FC<ImpactSavingsDashboardProps> = ({ onSelectDashboard }) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState('impact-savings');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'D' | 'W' | 'M' | 'Y'>('Y');
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState('Select date range');
  const [themeHexColor, setThemeHexColor] = useState('#3b82f6');

  // Read primary theme color dynamically from CSS variable
  useEffect(() => {
    const updateThemeHex = () => {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-primary')
        .trim();
      if (hex) setThemeHexColor(hex);
    };

    updateThemeHex();
    const observer = new MutationObserver(updateThemeHex);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Chart data for 0 line
  const chartData = [
    { name: 'Point 1', value: 0 },
    { name: 'Point 2', value: 0 },
    { name: 'Point 3', value: 0 },
    { name: 'Point 4', value: 0 },
    { name: 'Point 5', value: 0 },
    { name: 'Point 6', value: 0 },
    { name: 'Point 7', value: 0 },
  ];

  const kpiCards = [
    { title: 'Total Reuse Count', value: '0', icon: 'RotateCcw' },
    { title: 'Carbon Savings', value: '0', icon: 'Leaf' },
    { title: 'Plastic Savings', value: '0', icon: 'Recycle' },
    { title: 'Natural Resources Savings', value: '0', icon: 'Clover' },
    { title: 'Water Savings', value: '0', icon: 'Droplet' },
    { title: 'Returned Oil', value: '0', icon: 'Wine' },
    { title: 'Footballs Saved', value: '0', icon: 'Shuffle' },
  ];

  const dashboardTabs = [
    { id: 'impact-savings', label: 'Impact Savings' },
    { id: 'performance-metrics', label: 'Performance Metrics' },
    { id: 'tech-bin-dashboard', label: 'Tech Bin Dashboard' },
    { id: 'circulayo-connect', label: 'Circulayo Connect' },
  ];

  return (
    <div className="flex-1 p-6 space-y-5 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-y-auto transition-colors duration-200">
      {/* Single Streamlined Header Row with Interactive Title Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title Selector & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">
                Inventory /
              </span>
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <span>Impact Savings</span>
                <div className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors">
                  <Icon name="ChevronDown" size={14} className="text-slate-600 dark:text-slate-300" />
                </div>
              </button>
            </div>

            {/* Interactive Switcher Menu */}
            {isSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Dashboard
                  </div>
                  {dashboardTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setIsSwitcherOpen(false);
                        setActiveDashboardTab(tab.id);
                        if (onSelectDashboard) onSelectDashboard(tab.id);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        activeDashboardTab === tab.id
                          ? 'bg-theme-light text-theme-primary font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {activeDashboardTab === tab.id && (
                        <Icon name="Check" size={14} className="text-theme-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-300 transition-colors hidden md:flex">
            <span>Updated just now</span>
            <Icon name="RotateCcw" size={12} />
          </button>

          <button className="px-3.5 py-1.5 rounded-xl bg-[#1e232e] text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer hidden md:block">
            Customise
          </button>
        </div>

        {/* Dropdowns & Date Range */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Client Select */}
          <CustomSelect
            value={selectedClient}
            onChange={(val) => setSelectedClient(val)}
            options={['All Clients', 'Derby County Football Club', 'EcoX test partner', 'Mastercard', 'Mistolin Factory', 'Notts County', 'Organisation Default Client Test']}
            className="w-48"
          />

          {/* Location Select */}
          <CustomSelect
            value={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
            options={['All Locations', 'Pride Park Stadium', 'Derby Arena', 'Location 1', 'Location 2']}
            className="w-44"
          />

          {/* Date Range Picker Component */}
          <CustomDateRangePicker
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            align="right"
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="p-5 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-2xs hover:shadow-md transition-shadow"
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {card.value}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center transition-colors">
              <Icon name={card.icon} size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Carbon/Plastic Savings Line Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Carbon/Plastic Savings
            </h3>

            <div className="flex items-center gap-3">
              {/* Filter Pills */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
                {(['D', 'W', 'M', 'Y'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      timeFilter === t
                        ? 'bg-[#1e232e] text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icon name="MoreVertical" size={18} />
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.2)" />
                <YAxis
                  ticks={[0]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={themeHexColor}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: themeHexColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Last Event Impact Empty State (1 Col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Last Event Impact
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Icon name="MoreVertical" size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center my-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
              <Icon name="Box" size={32} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No data available
            </p>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
};
