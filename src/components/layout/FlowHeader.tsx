import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';

interface FlowHeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  onOpenPreferences: () => void;
  onOpenCommandPalette?: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({
  onToggleDrawer,
  isDrawerOpen,
  onOpenPreferences,
  onOpenCommandPalette,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'none' | 'notifications' | 'help' | 'profile'>('none');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
        setActiveSubModal('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationsList = [
    { id: 1, title: 'Invoice INV-0042 Generated', time: '10m ago', unread: true },
    { id: 2, title: 'New Service Created', time: '1h ago', unread: true },
    { id: 3, title: 'Monthly Target Reached', time: '3h ago', unread: false },
  ];

  return (
    <header className="h-14 bg-[#0d111a] text-white border-b border-slate-800 flex items-center justify-between px-4 z-40 sticky top-0 shadow-md transition-colors duration-200">
      {/* Official Brand Logo & Global Search Pill */}
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="Flow Platform Logo"
          className="h-7 w-auto object-contain bg-black px-2 py-1 rounded-md"
        />

        {/* Global Search Bar (Cmd+K Launcher Trigger) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs transition-all cursor-pointer shadow-2xs group w-64 justify-between"
            title="Global Navigation Search (Cmd+K)"
          >
            <div className="flex items-center gap-2">
              <Icon name="Search" size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Search pages or actions...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 text-slate-300">
        {/* Onboarding Guide Button (Restored to Header Bar) */}
        <button
          onClick={onToggleDrawer}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
            isDrawerOpen
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
          }`}
          title="Toggle Onboarding Guide"
        >
          <Icon name="Sparkles" size={14} className={isDrawerOpen ? 'text-white' : 'text-amber-400'} />
          <span>Onboarding Guide</span>
        </button>

        {/* Standalone Settings Icon (Explicitly NOT inside profile group) */}
        <button
          onClick={onOpenPreferences}
          className="hover:text-white transition-colors cursor-pointer p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 group shadow-xs"
          title="Preferences / Settings"
        >
          <Icon name="Settings" size={17} className="animate-spin-clockwise group-hover:animate-spin-clockwise-fast" />
        </button>

        {/* Grouped Profile Dropdown Container */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold shadow-xs ${
              isProfileMenuOpen
                ? 'bg-slate-800 border-blue-500/50 text-white ring-2 ring-blue-500/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
            }`}
            title="User Profile & Quick Actions"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[11px] shadow-xs">
              U
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0d111a]" />
            </div>
            <span className="hidden sm:inline font-bold">User</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin
            </span>
            <Icon
              name="ChevronDown"
              size={14}
              className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`}
            />
          </button>

          {/* Profile Dropdown Popover (Light Mode) */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
              {/* Profile Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                    U
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">User Name</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">user56@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Grouped Actions Inside Profile */}
              <div className="p-2 space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Notifications & Assistance
                </div>

                {/* Notifications */}
                <button
                  onClick={() => setActiveSubModal(activeSubModal === 'notifications' ? 'none' : 'notifications')}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 relative">
                      <Icon name="Bell" size={15} />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                    <span>Notifications</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    3 New
                  </span>
                </button>

                {/* Sub Panel for Notifications */}
                {activeSubModal === 'notifications' && (
                  <div className="mx-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200">
                      <span>Recent Alerts</span>
                      <span className="text-[10px] text-blue-600 cursor-pointer hover:underline font-semibold">Mark all read</span>
                    </div>
                    {notificationsList.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-white hover:bg-slate-100/80 text-[11px] space-y-0.5 border border-slate-200/60 shadow-2xs">
                        <div className="font-semibold text-slate-800 flex items-center justify-between">
                          <span>{n.title}</span>
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Help & Support */}
                <button
                  onClick={() => setActiveSubModal(activeSubModal === 'help' ? 'none' : 'help')}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                      <Icon name="HelpCircle" size={15} />
                    </div>
                    <span>Help & Support</span>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-slate-400" />
                </button>

                {/* Sub Panel for Help */}
                {activeSubModal === 'help' && (
                  <div className="mx-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-700 animate-in fade-in duration-150">
                    <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                      <Icon name="BookOpen" size={13} className="text-purple-600" />
                      <span>Documentation & Help</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs border border-slate-200/60 shadow-2xs">
                      <span>User Guide & FAQs</span>
                      <Icon name="ExternalLink" size={12} className="text-slate-400" />
                    </div>
                    <div className="p-2 rounded-lg bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs border border-slate-200/60 shadow-2xs">
                      <span>Contact Support</span>
                      <Icon name="Mail" size={12} className="text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Account Options */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1">
                <button
                  onClick={() => {
                    setActiveSubModal(activeSubModal === 'profile' ? 'none' : 'profile');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="User" size={15} className="text-slate-400" />
                    <span>View Profile</span>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-slate-400" />
                </button>

                {/* Sub Panel for Profile Details */}
                {activeSubModal === 'profile' && (
                  <div className="mx-2 p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-700 shadow-2xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Role:</span>
                      <span className="font-bold text-slate-900">Administrator</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Workspace:</span>
                      <span className="font-bold text-slate-900">Flow Platform</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Email:</span>
                      <span className="font-semibold text-blue-600 truncate max-w-[140px]">user56@gmail.com</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  <Icon name="LogOut" size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
