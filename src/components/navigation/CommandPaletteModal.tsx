import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { ALL_NAV_ITEMS, NavItem } from '../../utils/navigationRegistry';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  favorites: string[];
  onToggleFavorite: (tabId: string) => void;
  recentTabs: string[];
  onOpenPreferences: () => void;
  onToggleDrawer: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  favorites,
  onToggleFavorite,
  recentTabs,
  onOpenPreferences,
  onToggleDrawer,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = ALL_NAV_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectTab(filteredItems[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelectTab, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-16 md:pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Icon name="Search" size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, reports, invoicing, stock, settings... (Use ↑ ↓ Enter)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <span className="text-[11px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Modal Body: Search Results & Quick Actions */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          
          {/* Quick Actions Shortcuts (Shown when query is empty) */}
          {!query && (
            <div className="p-2 space-y-1 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Quick Actions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => {
                    onSelectTab('invoice-list');
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700/60 transition-all text-left group"
                >
                  <Icon name="Plus" size={14} className="text-blue-500 group-hover:text-white" />
                  <span>Go to Invoices</span>
                </button>
                <button
                  onClick={() => {
                    onToggleDrawer();
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700/60 transition-all text-left group"
                >
                  <Icon name="Sparkles" size={14} className="text-amber-500 group-hover:text-white" />
                  <span>Onboarding Guide</span>
                </button>
                <button
                  onClick={() => {
                    onOpenPreferences();
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700/60 transition-all text-left group"
                >
                  <Icon name="Settings" size={14} className="text-purple-500 group-hover:text-white" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{query ? `Search Results (${filteredItems.length})` : 'All Pages & Views'}</span>
            <span>Use ↑ ↓ to navigate</span>
          </div>

          {/* List of Navigation Items */}
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Icon name="SearchX" size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold">No pages matching "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isFav = favorites.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700'
                        }`}
                      >
                        <Icon name={item.groupIcon} size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs truncate">{item.label}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {item.section} &gt; {item.group}
                          </span>
                        </div>
                        {item.description && (
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav
                            ? 'text-amber-400 hover:text-amber-300'
                            : isSelected
                            ? 'text-blue-200 hover:text-white'
                            : 'text-slate-300 hover:text-amber-400 dark:text-slate-600'
                        }`}
                        title={isFav ? 'Unstar page' : 'Star page'}
                      >
                        <Icon name="Star" size={15} className={isFav ? 'fill-amber-400' : ''} />
                      </button>
                      <Icon
                        name="ChevronRight"
                        size={16}
                        className={isSelected ? 'text-white' : 'text-slate-300 dark:text-slate-600'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-bold">↵ Enter</kbd> to open</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-bold">⭐ Star</kbd> to pin</span>
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400">Cmd + K Global Search</span>
        </div>

      </div>
    </div>
  );
};
