import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobileCirculayoAppViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

export const MobileCirculayoAppView: React.FC<MobileCirculayoAppViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'circulayo-app-dashboard',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');
  const [selectedClient, setSelectedClient] = useState('');

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
        {/* Title Bar: Circulayo App + Filter Sliders */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            Circulayo App
          </h2>
          <button
            onClick={() => toast.info('Filters applied')}
            className="p-1 rounded-lg text-[#2e7d5b] hover:bg-[#e7eee9] transition-colors cursor-pointer"
            title="Filter"
          >
            <Icon name="SlidersHorizontal" size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* 2x2 Solid Color Metric Cards (Styled in Rich Forest & Sage Greens) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Top-Left: Total Scans */}
          <div className="bg-[#2e7d5b] text-white rounded-2xl p-3.5 flex flex-col justify-between h-[96px] shadow-sm relative overflow-hidden">
            <span className="text-[26px] font-black tracking-tight leading-none">838</span>
            <span className="text-[11px] font-bold text-white/90 text-right leading-none">Total Scans</span>
          </div>

          {/* Top-Right: Card Clicks */}
          <div className="bg-[#3e946f] text-white rounded-2xl p-3.5 flex flex-col justify-between h-[96px] shadow-sm relative overflow-hidden">
            <span className="text-[26px] font-black tracking-tight leading-none">35</span>
            <span className="text-[11px] font-bold text-white/90 text-right leading-none">Card Clicks</span>
          </div>

          {/* Bottom-Left: Android */}
          <div className="bg-[#164e3f] text-white rounded-2xl p-3.5 flex flex-col justify-between h-[96px] shadow-sm relative overflow-hidden">
            <span className="text-[26px] font-black tracking-tight leading-none">815</span>
            <span className="text-[11px] font-bold text-white/90 text-right leading-none">Android</span>
          </div>

          {/* Bottom-Right: Apple */}
          <div className="bg-[#52ad83] text-white rounded-2xl p-3.5 flex flex-col justify-between h-[96px] shadow-sm relative overflow-hidden">
            <span className="text-[26px] font-black tracking-tight leading-none">23</span>
            <span className="text-[11px] font-bold text-white/90 text-right leading-none">Apple</span>
          </div>
        </div>

        {/* Analytic Card 1: Circulayo App Scan Analytics */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              CIRCULAYO APP SCAN ANALYTICS
            </span>
            <span className="text-[24px] font-black text-slate-900 tracking-tight leading-none block mb-1">
              838
            </span>
            <span className="text-[11.5px] font-semibold text-slate-500">
              Successful Scans
            </span>
          </div>
          <button className="w-11 h-11 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#25664a] transition-colors">
            <Icon name="BarChart2" size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* Analytic Card 2: Card Scans Analytics */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              CARD SCANS ANALYTICS
            </span>
            <span className="text-[24px] font-black text-slate-900 tracking-tight leading-none block mb-1">
              35
            </span>
            <span className="text-[11.5px] font-semibold text-slate-500">
              Card Interactions
            </span>
          </div>
          <button className="w-11 h-11 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#25664a] transition-colors">
            <Icon name="BarChart2" size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* Select Client Dropdown & Device Preview Mockup */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
              SELECT CLIENT
            </label>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 appearance-none outline-none cursor-pointer focus:border-[#2e7d5b]"
              >
                <option value="">Select Client</option>
                <option value="delaware">Delaware North UK</option>
                <option value="compass">Compass Group / Levy</option>
                <option value="elior">Elior UK Sports</option>
              </select>
              <Icon
                name="ChevronDown"
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Smartphone Simulator Mockup matching Image 4 */}
          <div className="w-full max-w-[260px] mx-auto border-[3px] border-[#1e293b] rounded-t-[34px] h-48 bg-white p-2 relative shadow-inner">
            {/* Dynamic Island Notch */}
            <div className="w-24 h-4.5 bg-[#0f172a] rounded-full mx-auto flex items-center justify-center gap-1.5 shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-red-950/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Inner App Screen Placeholder */}
            <div className="mt-4 flex flex-col items-center justify-center text-center p-3">
              <div className="w-9 h-9 rounded-full bg-[#e7eee9] text-[#164e3f] flex items-center justify-center mb-1.5">
                <Icon name="Smartphone" size={17} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">App Screen Preview</span>
              <span className="text-[9.5px] text-slate-400">Scan to interact</span>
            </div>
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
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <Icon name="Archive" size={18} />
          <span className="text-[10px] font-bold">Batch</span>
        </button>
      </nav>
    </div>
  );
};
