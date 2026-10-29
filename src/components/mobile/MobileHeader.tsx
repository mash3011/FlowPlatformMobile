import React from 'react';
import { Icon } from '../ui/Icon';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  onNewInvoice?: () => void;
  unreadCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenSidebar,
  title = 'Invoices',
  onNewInvoice,
  unreadCount = 2,
}) => {
  return (
    <header className="h-13 bg-[#0d111a] text-white border-b border-slate-800 flex items-center justify-between px-3.5 shrink-0 z-40 sticky top-0 shadow-md">
      {/* Left: Hamburger Menu + Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          title="Open Navigation Menu"
        >
          <Icon name="Menu" size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          <img
            src="/logo.png"
            alt="Flow Platform"
            className="h-6 w-auto object-contain bg-black px-1.5 py-0.5 rounded"
          />
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 text-slate-300">
        {onNewInvoice && (
          <button
            onClick={onNewInvoice}
            className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Icon name="Plus" size={12} />
            <span>New</span>
          </button>
        )}

        <button
          className="relative p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Notifications"
        >
          <Icon name="Bell" size={16} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
};
