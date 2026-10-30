import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobileStockCheckAuditViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  activeNavTab?: string;
}

export const MobileStockCheckAuditView: React.FC<MobileStockCheckAuditViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  activeNavTab = 'stock-check-mgmt',
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');
  const [auditFilter, setAuditFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Stock Check Audits list under Management
  const audits = [
    {
      id: 'audit-1',
      title: 'Derby County FC - Main Bar',
      date: 'Today, 30 Oct 2026',
      status: 'In Progress',
      checkedItems: 142,
      totalItems: 150,
      auditor: 'Admin',
    },
    {
      id: 'audit-2',
      title: 'Notts County - South Stand Kiosk',
      date: '28 Oct 2026',
      status: 'Verified',
      checkedItems: 98,
      totalItems: 98,
      auditor: 'John D.',
    },
    {
      id: 'audit-3',
      title: 'Delaware North - Warehouse B',
      date: '25 Oct 2026',
      status: 'Verified',
      checkedItems: 466,
      totalItems: 466,
      auditor: 'Admin',
    },
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
        {/* Title Bar: Stock Check Management */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
              Stock Check
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              Management & Audits
            </p>
          </div>
          <button
            onClick={() => toast.info('Filters applied')}
            className="p-1 rounded-lg text-[#2e7d5b] hover:bg-[#e7eee9] transition-colors cursor-pointer"
            title="Filter"
          >
            <Icon name="SlidersHorizontal" size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Start New Stock Audit Action Card */}
        <div className="bg-gradient-to-br from-[#164e3f] to-[#2e7d5b] text-white rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">
                AUDIT WORKFLOW
              </span>
              <h3 className="text-base font-extrabold tracking-tight mt-0.5">
                Start Stock Check
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white">
              <Icon name="QrCode" size={20} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Scan barcodes, count batches, or perform a manual physical audit.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => toast.success('Barcode scanner initiated')}
              className="flex-1 py-2 rounded-xl bg-white text-[#164e3f] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Icon name="Scan" size={14} />
              <span>Scan Barcode</span>
            </button>
            <button
              onClick={() => toast.success('Manual count initiated')}
              className="flex-1 py-2 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/30 transition-colors"
            >
              <Icon name="Plus" size={14} strokeWidth={2.5} />
              <span>Manual Count</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl p-2.5 text-center border border-slate-200/90 shadow-2xs">
            <span className="text-lg font-black text-slate-900 block leading-none">2</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Scheduled</span>
          </div>
          <div className="bg-white rounded-2xl p-2.5 text-center border border-slate-200/90 shadow-2xs">
            <span className="text-lg font-black text-[#2e7d5b] block leading-none">14</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Completed</span>
          </div>
          <div className="bg-white rounded-2xl p-2.5 text-center border border-slate-200/90 shadow-2xs">
            <span className="text-lg font-black text-slate-900 block leading-none">0</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Discrepancies</span>
          </div>
        </div>

        {/* Audits List Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Audits
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {(['all', 'in-progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    auditFilter === f
                      ? 'bg-[#2e7d5b] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f === 'in-progress' ? 'Active' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {audits.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2 hover:border-[#2e7d5b] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[10.5px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    Audited: <strong className="text-slate-900">{item.checkedItems}</strong> / {item.totalItems} items
                  </span>
                  <span className="text-slate-400 font-semibold">{item.auditor}</span>
                </div>
              </div>
            ))}
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
          <span className="text-[10px] font-bold">Stock Info</span>
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
