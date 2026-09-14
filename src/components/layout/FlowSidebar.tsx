import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

interface FlowSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  apparentTheme?: boolean;
}

export const FlowSidebar: React.FC<FlowSidebarProps> = ({
  activeTab,
  onSelectTab,
  apparentTheme = false,
}) => {
  const isSidebarDark = apparentTheme;

  // Track expanded/collapsed state for categories (collapsed by default unless selected or active)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const [navSearch, setNavSearch] = useState('');

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const navSections = [
    {
      title: 'MAIN',
      groups: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutGrid',
          subItems: [
            { id: 'impact-savings', label: 'Impact Savings' },
            { id: 'performance-metrics', label: 'Performance. M' },
            { id: 'tech-bin-dashboard', label: 'Tech Bin Dashboard' },
            { id: 'circulayo-connect', label: 'Circulayo Connect Dashboard' },
          ],
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: 'Calendar',
          subItems: [{ id: 'calendar-item', label: 'Calendar' }],
        },
        {
          id: 'report',
          label: 'Report',
          icon: 'PieChart',
          subItems: [
            { id: 'stock-info', label: 'Stock Info' },
            { id: 'reuse-stats', label: 'Reuse Stats' },
            { id: 'container-return-rate', label: 'Container Return Rate' },
            { id: 'impact-report', label: 'Impact Report' },
            { id: 'golden-winner-reports', label: 'Golden Winner Reports' },
          ],
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      groups: [
        {
          id: 'stock-check',
          label: 'Stock Check',
          icon: 'ClipboardCheck',
          subItems: [{ id: 'stock', label: 'Stock' }],
        },
        {
          id: 'client-location',
          label: 'Client/Location',
          icon: 'GitFork',
          subItems: [
            { id: 'location', label: 'Location' },
            { id: 'clients', label: 'Clients' },
            { id: 'users', label: 'Users' },
          ],
        },
        {
          id: 'product',
          label: 'Product',
          icon: 'Package',
          subItems: [
            { id: 'product-item', label: 'Product' },
            { id: 'product-category', label: 'Product Category' },
            { id: 'product-status', label: 'Product Status' },
            { id: 'product-partner', label: 'Product Partner' },
            { id: 'product-cost', label: 'Product Cost' },
          ],
        },
        {
          id: 'endpoint',
          label: 'Endpoint',
          icon: 'Settings',
          subItems: [
            { id: 'micro-edge', label: 'Micro Edge' },
            { id: '3rd-party', label: '3rd Party' },
            { id: 'endpoint-type', label: 'Endpoint Type' },
          ],
        },
      ],
    },
    {
      title: 'OPERATIONS',
      groups: [
        {
          id: 'wash',
          label: 'Wash',
          icon: 'Droplets',
          subItems: [
            { id: 'wash-dashboard', label: 'Dashboard' },
            { id: 'prewash', label: 'Prewash' },
            { id: 'wash-item', label: 'Wash' },
          ],
        },
        {
          id: 'batch',
          label: 'Batch',
          icon: 'Archive',
          subItems: [
            { id: 'batch-dashboard', label: 'Dashboard' },
            { id: 'batch-item', label: 'Batch' },
          ],
        },
        {
          id: 'events',
          label: 'Events',
          icon: 'Activity',
          subItems: [{ id: 'events-item', label: 'Events' }],
        },
      ],
    },
    {
      title: 'ORDERS & FINANCE',
      groups: [
        {
          id: 'invoice',
          label: 'Invoice',
          icon: 'FileText',
          subItems: [
            { id: 'invoice-list', label: 'Invoice List' },
            { id: 'invoice-services', label: 'Services' },
          ],
        },
        {
          id: 'order',
          label: 'Order',
          icon: 'ShoppingCart',
          subItems: [
            { id: 'order-dashboard', label: 'Dashboard' },
            { id: 'order-item', label: 'Order' },
          ],
        },
      ],
    },
    {
      title: 'SETTINGS',
      groups: [
        {
          id: 'team',
          label: 'Team',
          icon: 'Users',
          subItems: [
            { id: 'team-users', label: 'Users' },
            { id: 'team-profiles', label: 'Profiles' },
          ],
        },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 flex flex-col justify-between h-[calc(100vh-3.5rem)] overflow-y-auto text-xs font-sans selection:bg-none transition-colors duration-200 border-r ${
        isSidebarDark
          ? 'bg-[#0e1420] text-slate-300 border-slate-800'
          : 'bg-white text-slate-700 border-slate-200 dark:bg-[#0e1420] dark:text-slate-300 dark:border-slate-800'
      }`}
    >
      <div className="py-3 px-3 space-y-4">
        {/* Navigation Filter Search Input */}
        <div className="relative mb-2">
          <Icon
            name="Search"
            size={13}
            className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Filter navigation..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-[11px] font-medium border focus:outline-none transition-all ${
              isSidebarDark
                ? 'bg-[#141c2b] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                : 'bg-slate-50 dark:bg-[#141c2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500'
            }`}
          />
          {navSearch && (
            <button
              onClick={() => setNavSearch('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        {navSections.map((section) => {
          // Filter groups based on navSearch if typed
          const filteredGroups = section.groups.filter(
            (g) =>
              g.label.toLowerCase().includes(navSearch.toLowerCase()) ||
              g.subItems.some((s) => s.label.toLowerCase().includes(navSearch.toLowerCase()))
          );

          if (navSearch && filteredGroups.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header with Horizontal Line */}
              <div className="flex items-center gap-2 px-1 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>{section.title}</span>
                <span className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800/80" />
              </div>

              {/* Group List */}
              <div className="space-y-0.5">
                {filteredGroups.map((group) => {
                  const hasActiveChild = group.subItems.some((s) => s.id === activeTab);
                  const isGroupOpen = openGroups[group.id] ?? (hasActiveChild || Boolean(navSearch));

                  return (
                    <div key={group.id} className="space-y-0.5">
                      {/* Group Header Button */}
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                          hasActiveChild
                            ? 'bg-theme-light text-theme-primary border-l-3 border-theme-primary font-bold shadow-2xs'
                            : isSidebarDark
                            ? 'text-slate-300 hover:bg-slate-800/60'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            name={group.icon}
                            size={16}
                            className={
                              hasActiveChild
                                ? 'text-theme-primary'
                                : 'text-slate-500 dark:text-slate-400'
                            }
                          />
                          <span className="truncate">{group.label}</span>
                        </div>
                        <span className="text-slate-400 font-extrabold text-xs">
                          {isGroupOpen ? '−' : '+'}
                        </span>
                      </button>

                      {/* Tree Branch Sub Items with Continuous SVG Connectors */}
                      {isGroupOpen && (
                        <div className="relative pl-7 space-y-0.5 my-0.5">
                          {group.subItems.map((sub, idx) => {
                            const isSubActive = activeTab === sub.id;
                            const isLast = idx === group.subItems.length - 1;
                            const strokeColor = isSubActive
                              ? 'var(--theme-primary)'
                              : isSidebarDark
                              ? '#475569'
                              : '#cbd5e1';

                            return (
                              <button
                                key={sub.id}
                                onClick={() => onSelectTab(sub.id)}
                                className={`w-full flex items-center text-left py-1 text-[11px] transition-colors cursor-pointer relative group ${
                                  isSubActive
                                    ? 'font-bold text-theme-primary'
                                    : isSidebarDark
                                    ? 'text-slate-400 hover:text-slate-200 font-medium'
                                    : 'text-slate-500 hover:text-slate-800 font-medium'
                                }`}
                              >
                                {/* Continuous SVG Tree Branch Connector */}
                                <svg
                                  className="absolute -left-4 top-0 w-4 h-full overflow-visible pointer-events-none"
                                  viewBox="0 0 16 24"
                                  preserveAspectRatio="none"
                                >
                                  {/* Top vertical segment */}
                                  <line
                                    x1="2"
                                    y1="0"
                                    x2="2"
                                    y2="10"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                  />

                                  {/* Bottom vertical segment continuing to next subitem */}
                                  {!isLast && (
                                    <line
                                      x1="2"
                                      y1="10"
                                      x2="2"
                                      y2="24"
                                      stroke={isSidebarDark ? '#475569' : '#cbd5e1'}
                                      strokeWidth="1.5"
                                    />
                                  )}

                                  {/* Smooth 90-degree right curve pointing to label */}
                                  <path
                                    d="M 2 10 Q 2 15 7 15 H 14"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    fill="none"
                                  />
                                </svg>
                                <span className="truncate pl-1">{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 m-2 rounded-xl bg-slate-900 dark:bg-[#171d2b] text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <Icon name="User" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white">Circulayo Admin</span>
              <span className="bg-theme-primary text-white text-[8px] font-extrabold px-1 rounded">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-300 dark:text-slate-400 truncate max-w-[110px]">
              admin2@circulayo.com
            </p>
          </div>
        </div>
        <Icon name="ChevronRight" size={14} className="text-slate-400" />
      </div>
    </aside>
  );
};
