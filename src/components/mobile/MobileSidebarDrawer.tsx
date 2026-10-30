import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

interface NavSubItem {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  subItems?: NavSubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  // Report is open by default as shown in the Azure DevFlow screenshot
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: false,
    calendar: false,
    report: true,
    'client-location': false,
    'stock-check': false,
    endpoint: false,
    wash: false,
    batch: false,
    event: false,
    order: false,
    collection: false,
  });

  const [activeSubItem, setActiveSubItem] = useState<string>('stock-info');

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const sections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutGrid',
          subItems: [
            { id: 'overview', label: 'Overview' },
            { id: 'performance', label: 'Performance' },
          ],
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: 'Calendar',
          subItems: [
            { id: 'schedule', label: 'Schedule' },
            { id: 'events', label: 'Events' },
          ],
        },
        {
          id: 'report',
          label: 'Report',
          icon: 'PieChart',
          subItems: [
            { id: 'stock-info', label: 'Stock Info' },
            { id: 'reuse-stats', label: 'Reuse Stats' },
            { id: 'container-return-rate', label: 'Container Return Rate' },
            { id: 'impact-reports', label: 'Impact Reports' },
            { id: 'golden-winner-reports', label: 'Golden Winner Reports' },
          ],
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          id: 'client-location',
          label: 'Client/Location',
          icon: 'Network',
          subItems: [
            { id: 'clients', label: 'Clients' },
            { id: 'venues', label: 'Venues' },
          ],
        },
        {
          id: 'stock-check',
          label: 'Stock Check',
          icon: 'ClipboardCheck',
          subItems: [
            { id: 'live-audit', label: 'Live Audit' },
            { id: 'audit-history', label: 'Audit History' },
          ],
        },
        {
          id: 'endpoint',
          label: 'Endpoint',
          icon: 'Cog',
          subItems: [
            { id: 'scanners', label: 'Scanners' },
            { id: 'devices', label: 'Devices' },
          ],
        },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'wash',
          label: 'Wash',
          icon: 'Sparkles',
          subItems: [
            { id: 'wash-batches', label: 'Wash Batches' },
            { id: 'sanitization', label: 'Sanitization' },
          ],
        },
        {
          id: 'batch',
          label: 'Batch',
          icon: 'Archive',
          subItems: [
            { id: 'assign-batch', label: 'Assign Batch' },
            { id: 'batch-list', label: 'All Batches' },
          ],
        },
        {
          id: 'event',
          label: 'Event',
          icon: 'Ticket',
          subItems: [
            { id: 'game-day', label: 'Game Day' },
            { id: 'festivals', label: 'Festivals' },
          ],
        },
      ],
    },
    {
      title: 'ORDERS & FINANCE',
      items: [
        {
          id: 'order',
          label: 'Order',
          icon: 'ShoppingCart',
          subItems: [
            { id: 'purchase-orders', label: 'Purchase Orders' },
            { id: 'cart', label: 'Cart' },
          ],
        },
        {
          id: 'collection',
          label: 'Collection',
          icon: 'Truck',
          subItems: [
            { id: 'pickups', label: 'Pickups' },
            { id: 'returns', label: 'Returns' },
          ],
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Off-canvas Navigation Drawer */}
      <aside className="relative w-[310px] max-w-[85%] h-full bg-white text-slate-900 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200 font-sans">
        {/* Top Header: Flow Platform logo & Close Button */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Circular Ring Flow Logo */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 28 28" fill="none">
              <circle
                cx="14"
                cy="14"
                r="9.5"
                stroke="url(#flow-logo-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="flow-logo-grad" x1="2" y1="4" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">Flow Platform</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close navigation"
          >
            <Icon name="X" size={17} strokeWidth={2.2} />
          </button>
        </div>

        {/* Scrollable Navigation Menu with Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 no-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              {/* Section Header with Accent Line */}
              <div className="flex items-center gap-2.5 pt-2 pb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  {section.title}
                </span>
                <div className="flex-1 h-[1px] bg-[#FF671B]/50" />
              </div>

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const hasSubs = (item.subItems?.length ?? 0) > 0;
                  const isExpanded = openGroups[item.id] ?? false;
                  const isReportItem = item.id === 'report';
                  const isItemActive =
                    activeTab === item.id ||
                    (isReportItem && (activeTab === 'stock-check' || activeTab === 'stock' || activeSubItem === 'stock-info'));

                  return (
                    <div key={item.id}>
                      {/* Parent Item Row */}
                      <div
                        onClick={() => {
                          if (hasSubs) {
                            toggleGroup(item.id);
                          } else {
                            onSelectTab(item.id);
                            onClose();
                          }
                        }}
                        className="flex items-center justify-between py-1.5 px-1 rounded-lg cursor-pointer select-none group transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            name={item.icon}
                            size={18}
                            className={`shrink-0 transition-colors ${
                              isItemActive
                                ? 'text-[#FF671B]'
                                : 'text-slate-500 group-hover:text-slate-700'
                            }`}
                            strokeWidth={2}
                          />
                          <span
                            className={`text-[13px] tracking-tight ${
                              isItemActive
                                ? 'text-[#FF671B] font-bold'
                                : 'text-slate-700 font-semibold group-hover:text-slate-900'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        {hasSubs && (
                          <div className="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-slate-600">
                            {isExpanded ? (
                              <span className="text-[15px] font-bold leading-none text-[#FF671B]">—</span>
                            ) : (
                              <span className="text-[15px] font-semibold leading-none text-slate-400">+</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tree View Sub-Items */}
                      {hasSubs && isExpanded && (
                        <div className="relative pl-6 py-0.5 space-y-0.5 my-0.5">
                          {/* Continuous Vertical Line */}
                          <div className="absolute left-[19px] top-1 bottom-3 w-[1.2px] bg-slate-300" />

                          {item.subItems!.map((sub, idx) => {
                            const isSubActive =
                              activeSubItem === sub.id ||
                              (sub.id === 'stock-info' && (activeTab === 'stock-check' || activeTab === 'stock'));
                            const isLast = idx === item.subItems!.length - 1;

                            return (
                              <div
                                key={sub.id}
                                onClick={() => {
                                  setActiveSubItem(sub.id);
                                  if (sub.id === 'stock-info' || sub.id === 'stock-check') {
                                    onSelectTab('stock-check');
                                  } else {
                                    onSelectTab(sub.id);
                                  }
                                  onClose();
                                }}
                                className="relative flex items-center py-1 cursor-pointer select-none group"
                              >
                                {/* Horizontal Branch Connector Line */}
                                <div
                                  className={`absolute left-[-5px] w-[13px] h-[1.2px] bg-slate-300 ${
                                    isLast ? 'rounded-bl' : ''
                                  }`}
                                />

                                <span
                                  className={`text-[12px] pl-3.5 transition-colors ${
                                    isSubActive
                                      ? 'text-[#FF671B] font-semibold'
                                      : 'text-slate-500 group-hover:text-slate-800 font-medium'
                                  }`}
                                >
                                  {sub.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-white shrink-0">
          <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors">
            {/* Left: Circulayo Admin Avatar Badge */}
            <div className="w-8.5 h-8.5 rounded-full bg-[#FF671B] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-tight shadow-xs">
              CA
            </div>

            {/* Middle Column: App name, Admin Badge, Email, Last Login */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-bold text-[12px] text-slate-900 truncate">
                  Circulayo Admin App
                </span>
                <span className="bg-[#FF671B] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none tracking-wide shrink-0">
                  ADMIN
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5 truncate">
                <Icon name="Mail" size={11} className="text-slate-400 shrink-0" />
                <span className="truncate">admin2@circulayo.com</span>
              </div>

              <div className="text-[9.5px] text-slate-400 mt-0.5">
                <span>Last Login: 7 days ago</span>
              </div>
            </div>

            {/* Right: Chevron Arrow */}
            <Icon name="ChevronRight" size={15} className="text-slate-400 shrink-0" />
          </div>
        </div>
      </aside>
    </div>
  );
};
