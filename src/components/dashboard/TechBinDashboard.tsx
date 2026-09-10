import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

interface TechBinDashboardProps {
  onSelectDashboard: (dashId: string) => void;
}

export const TechBinDashboard: React.FC<TechBinDashboardProps> = ({ onSelectDashboard }) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const kpiCards = [
    { title: 'Today Deposit Returned', value: '0' },
    { title: 'Total Deposit Returned', value: '0' },
    { title: 'Total Deposited', value: '0' },
    { title: 'Total Money Attached', value: '0' },
    { title: 'Today Refilled', value: '0' },
    { title: 'Total Refilled', value: '0' },
    { title: 'Items In Bin', value: '0' },
    { title: 'Active Bins', value: '0' },
    { title: 'Returned Without Deposit', value: '0' },
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
                <span>Tech Bin Dashboard</span>
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
                        if (onSelectDashboard) onSelectDashboard(tab.id);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        tab.id === 'tech-bin-dashboard'
                          ? 'bg-theme-light text-theme-primary font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.id === 'tech-bin-dashboard' && (
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

          <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer shadow-xs hidden md:block">
            Customise
          </button>
        </div>

        {/* Dropdowns & Date Range */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Client Select */}
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="appearance-none bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="All Clients">All Clients</option>
              <option value="Client A">Client A</option>
              <option value="Client B">Client B</option>
            </select>
            <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Location Select */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="All Locations">All Locations</option>
              <option value="Location 1">Location 1</option>
              <option value="Location 2">Location 2</option>
            </select>
            <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Picker Button */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl font-medium cursor-pointer shadow-2xs">
            <Icon name="Calendar" size={14} />
            <span>Select date range</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (9 Total Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <div
            key={`${card.title}-${idx}`}
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

            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
              <Icon name="RotateCcw" size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom 3 Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {[
          { title: 'Bin Activity' },
          { title: 'Total Amount Returned' },
          { title: 'Activity List' },
        ].map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shadow-2xs min-h-[220px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {item.title}
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center my-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
                <Icon name="Box" size={28} />
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No data available
              </p>
            </div>
            <div />
          </div>
        ))}
      </div>
    </div>
  );
};
