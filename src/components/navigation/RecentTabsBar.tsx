import React from 'react';
import { Icon } from '../ui/Icon';
import { getNavItemById } from '../../utils/navigationRegistry';

interface RecentTabsBarProps {
  activeTab: string;
  recentTabs: string[];
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenCommandPalette: () => void;
}

export const RecentTabsBar: React.FC<RecentTabsBarProps> = ({
  activeTab,
  recentTabs,
  onSelectTab,
  onCloseTab,
  onOpenCommandPalette,
}) => {
  if (!recentTabs || recentTabs.length === 0) return null;

  return (
    <div className="bg-slate-100/90 dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none font-sans">
      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pr-1 border-r border-slate-200 dark:border-slate-800">
        <Icon name="Layers" size={13} />
        <span>Tabs:</span>
      </div>

      {recentTabs.map((tabId) => {
        const item = getNavItemById(tabId);
        const isActive = tabId === activeTab;

        return (
          <div
            key={tabId}
            onClick={() => onSelectTab(tabId)}
            className={`group px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all border shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Icon
              name={item.groupIcon}
              size={13}
              className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}
            />
            <span className="truncate max-w-[120px]">{item.label}</span>

            {/* Close Tab Button (Only show if more than 1 tab open) */}
            {recentTabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tabId);
                }}
                className={`p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                  isActive ? 'hover:bg-blue-700 text-blue-100' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Close Tab"
              >
                <Icon name="X" size={11} />
              </button>
            )}
          </div>
        );
      })}

      {/* Add Tab / Search Launcher */}
      <button
        onClick={onOpenCommandPalette}
        className="px-2 py-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 flex items-center gap-1 transition-all cursor-pointer text-xs font-semibold shrink-0"
        title="Open Page Launcher (Cmd+K)"
      >
        <Icon name="Plus" size={13} />
        <span>New Tab</span>
      </button>
    </div>
  );
};
