import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';
import { CustomSelect } from '../ui/CustomSelect';

interface CirculayoConnectDashboardProps {
  onSelectDashboard: (dashId: string) => void;
}

export const CirculayoConnectDashboard: React.FC<CirculayoConnectDashboardProps> = ({
  onSelectDashboard,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const dashboardTabs = [
    { id: 'impact-savings', label: 'Impact Savings' },
    { id: 'performance-metrics', label: 'Performance Metrics' },
    { id: 'tech-bin-dashboard', label: 'Tech Bin Dashboard' },
    { id: 'circulayo-connect', label: 'Circulayo Connect' },
  ];

  const scanAnalytics = [
    { name: 'Derby County Football Club', count: 227 },
    { name: 'Mastercard', count: 26 },
    { name: 'Notts County', count: 23 },
    { name: 'Organisation', count: 307 },
    { name: 'Pavestone Ralley', count: 238 },
  ];

  const clickAnalytics = [
    { name: 'Derby County Football Club', count: 6 },
    { name: 'Notts County', count: 4 },
    { name: 'Organisation', count: 8 },
    { name: 'Pavestone Ralley', count: 17 },
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
                <span>Circulayo Connect Dashboard</span>
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
                        tab.id === 'circulayo-connect'
                          ? 'bg-theme-light text-theme-primary font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.id === 'circulayo-connect' && (
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

          {/* Date Picker Button */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl font-medium cursor-pointer shadow-2xs">
            <Icon name="Calendar" size={14} />
            <span>Select date range</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid (Left Mobile Preview + Right Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: CIRCULAYO CONNECT PREVIEW */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            CIRCULAYO CONNECT PREVIEW
          </div>

          {/* Mobile Phone Mockup Frame */}
          <div className="w-64 h-[480px] rounded-[36px] border-4 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 relative flex flex-col justify-between shadow-xl my-4">
            {/* Camera Notch */}
            <div className="w-20 h-4 bg-slate-900 dark:bg-slate-700 rounded-full mx-auto mb-2" />

            {/* Inner Mobile Screen Content */}
            <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-blue-500/20 rounded" />
                <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-xl my-2 flex items-center justify-center text-slate-400 text-xs font-semibold">
                  Live Preview Content
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold text-center">
                Circulayo Action
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-24 h-1 bg-slate-900 dark:bg-slate-700 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* Right Column: 4 KPI Cards + 2 Tables + Bottom Banner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upper 4 KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SCAN
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white text-right">
                821
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CLICK THROUGH
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white text-right">
                35
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                <Icon name="Smartphone" size={14} />
                <span>ANDROID</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white text-right">
                798
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                <Icon name="Smartphone" size={14} />
                <span>APPLE</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white text-right">
                23
              </div>
            </div>
          </div>

          {/* Middle 2 Analytics Table Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: SCAN ANALYTICS */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                CIRCULAYO CONNECT SCAN ANALYTICS
              </h3>

              <div className="space-y-2 text-xs">
                {scanAnalytics.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {item.count}
                      </span>
                      <button className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-500 hover:bg-blue-100 transition-colors">
                        <Icon name="Search" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: CARD CLICKS ANALYTICS */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                CARD CLICKS ANALYTICS
              </h3>

              <div className="space-y-2 text-xs">
                {clickAnalytics.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {item.count}
                      </span>
                      <button className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-500 hover:bg-blue-100 transition-colors">
                        <Icon name="Search" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Banner Card: UPDATE CIRCULAYO CONNECT */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111723] border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-3 flex-1">
              <h3 className="font-extrabold text-sm text-amber-500 uppercase tracking-wider">
                UPDATE CIRCULAYO CONNECT
              </h3>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                Take full control of your Circulayo Connect. Adjust layouts, update messaging, and push live changes instantly using the Content Management System.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Open the Content Management app to manage pages, media, and releases from a single dashboard.
              </p>

              <button
                onClick={() => toast.info('Opening Content Management System...')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
              >
                Open CMS
              </button>
            </div>

            {/* Mobile Stack Artwork Graphic */}
            <div className="w-36 h-28 flex items-center justify-center relative">
              <div className="w-20 h-24 rounded-xl bg-blue-600 text-white p-2 shadow-md transform -rotate-12 border border-blue-400">
                <div className="h-2 w-10 bg-white/40 rounded mb-1" />
                <div className="h-1.5 w-8 bg-white/30 rounded" />
              </div>
              <div className="w-20 h-24 rounded-xl bg-slate-900 text-white p-2 shadow-xl absolute transform rotate-6 border border-slate-700">
                <div className="h-2 w-10 bg-blue-400/60 rounded mb-1" />
                <div className="h-1.5 w-8 bg-slate-600 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
