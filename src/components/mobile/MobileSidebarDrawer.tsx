import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    home: true,
    invoice: true,
    stock: false,
    calendar: false,
    order: false,
    batch: false,
    report: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'Home',
      iconColor: 'text-[#10b981]',
      subItems: [
        { id: 'impact-savings', label: 'Impact Savings' },
        { id: 'performance-metrics', label: 'Performance. M' },
      ],
    },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: 'FileText',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [
        { id: 'invoice-list', label: 'Invoice List' },
        { id: 'invoice-services', label: 'Services' },
      ],
    },
    {
      id: 'stock',
      label: 'Stock',
      icon: 'Layers',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [
        { id: 'current-stock', label: 'Current Stock' },
        { id: 'stock-check', label: 'Stock Check' },
      ],
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: 'Calendar',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [],
    },
    {
      id: 'order',
      label: 'Order',
      icon: 'ShoppingCart',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [
        { id: 'order-dashboard', label: 'Dashboard' },
        { id: 'order-cart', label: 'Cart' },
      ],
    },
    {
      id: 'batch',
      label: 'Batch',
      icon: 'Archive',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [
        { id: 'assign-batch', label: 'Assign Batch' },
        { id: 'collection', label: 'Collection' },
      ],
    },
    {
      id: 'report',
      label: 'Report',
      icon: 'PieChart',
      iconColor: 'text-slate-900 dark:text-white',
      subItems: [
        { id: 'reuse-statistics', label: 'Reuse Statistics' },
        { id: 'product-return-rate', label: 'Product Return Rate' },
        { id: 'impact-report', label: 'Impact Report' },
        { id: 'golden-winner', label: 'Golden Winner' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide Drawer matching Figma 1123-8991 */}
      <aside className="relative w-[320px] max-w-[85%] h-full bg-white dark:bg-[#121620] text-slate-900 dark:text-white flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-250 font-sans p-4">
        {/* Top Header: X on left, Settings on right */}
        <div className="flex items-center justify-between pt-1 pb-4">
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:opacity-75 cursor-pointer"
            title="Close navigation"
          >
            <Icon name="X" size={20} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => {}}
            className="w-7 h-7 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:opacity-75 cursor-pointer"
            title="Preferences"
          >
            <Icon name="Settings" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
          {navItems.map((group) => {
            const hasSubs = group.subItems.length > 0;
            const isOpenGroup = openGroups[group.id];
            const isGroupActive =
              activeTab === group.id || group.subItems.some((s) => s.id === activeTab);

            return (
              <div key={group.id} className="space-y-1.5">
                {/* Main Nav item row */}
                <div
                  onClick={() => {
                    if (hasSubs) {
                      toggleGroup(group.id);
                    } else {
                      onSelectTab(group.id);
                      onClose();
                    }
                  }}
                  className="flex items-center justify-between py-1 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={group.icon}
                      size={20}
                      className={
                        isGroupActive && group.id !== 'home'
                          ? 'text-[#10b981]'
                          : group.iconColor
                      }
                      strokeWidth={2.2}
                    />
                    <span
                      className={`text-[15px] font-bold tracking-tight ${
                        isGroupActive
                          ? 'text-[#10b981]'
                          : 'text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    >
                      {group.label}
                    </span>
                  </div>

                  {hasSubs && (
                    <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white px-1">
                      {isOpenGroup ? (
                        <span className="text-base font-bold leading-none">—</span>
                      ) : (
                        <span className="text-base font-bold leading-none">+</span>
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-items with curved branch connector */}
                {hasSubs && isOpenGroup && (
                  <div className="space-y-2 pt-0.5 pb-1">
                    {group.subItems.map((sub) => {
                      const isSubActive = activeTab === sub.id;

                      return (
                        <div
                          key={sub.id}
                          onClick={() => {
                            onSelectTab(sub.id);
                            onClose();
                          }}
                          className="flex items-center gap-2.5 pl-3 cursor-pointer py-0.5 group"
                        >
                          {/* L-shaped curved tree branch connector */}
                          <svg
                            className="w-3.5 h-3.5 shrink-0"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M 2 1 V 8 Q 2 12 6 12 H 13"
                              stroke={isSubActive ? '#10b981' : '#94a3b8'}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>

                          <span
                            className={`text-[13px] font-bold tracking-tight ${
                              isSubActive
                                ? 'text-[#10b981]'
                                : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
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

        {/* Bottom User Card - Exactly matching Figma 1123-8991 */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#1e1e24] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Online Status Dot */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <Icon name="User" size={16} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#1e1e24]" />
            </div>

            <div className="space-y-0.5">
              {/* Name & Admin Badge */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">User</span>
                <span className="bg-[#10b981] text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-[4px]">
                  Admin
                </span>
              </div>

              {/* Mail */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <Icon name="Mail" size={12} className="text-slate-400" />
                <span>User56@gmail.com</span>
              </div>

              {/* Last Seen */}
              <div className="text-[10px] text-slate-400">
                <span>Last Seen : </span>
                <span className="text-slate-300 font-medium">8hrs ago</span>
              </div>
            </div>
          </div>

          <Icon name="ChevronRight" size={16} className="text-slate-400" />
        </div>
      </aside>
    </div>
  );
};
