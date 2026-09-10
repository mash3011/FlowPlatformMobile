import React from 'react';
import { Icon } from '../ui/Icon';

interface FlowHeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  onOpenPreferences: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({
  onToggleDrawer,
  isDrawerOpen,
  onOpenPreferences,
}) => {
  return (
    <header className="h-14 bg-[#0d111a] text-white border-b border-slate-800 flex items-center justify-between px-4 z-40 sticky top-0 shadow-md transition-colors duration-200">
      {/* Official Brand Logo */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Flow Platform Logo"
          className="h-7 w-auto object-contain bg-black px-2 py-1 rounded-md"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4 text-slate-300">
        <button
          onClick={onToggleDrawer}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isDrawerOpen
              ? 'bg-theme-primary text-white shadow-xs'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Icon name="Sparkles" size={14} className="text-amber-300" />
          <span>Onboarding Guide</span>
        </button>

        {/* Animated Clockwise Settings Icon */}
        <button
          onClick={onOpenPreferences}
          className="hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800 group"
          title="Preferences / Settings"
        >
          <Icon name="Settings" size={18} className="animate-spin-clockwise group-hover:animate-spin-clockwise-fast" />
        </button>

        <button
          className="hover:text-white transition-colors relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
          title="Notifications"
        >
          <Icon name="Bell" size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-theme-primary" />
        </button>
        <button
          className="hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
          title="Help"
        >
          <Icon name="HelpCircle" size={18} />
        </button>
        <button
          className="hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
          title="User Profile"
        >
          <Icon name="User" size={18} />
        </button>
      </div>
    </header>
  );
};
