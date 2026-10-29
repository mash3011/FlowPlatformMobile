import React from 'react';
import { Icon } from '../ui/Icon';
import { getNavItemById } from '../../utils/navigationRegistry';

interface BreadcrumbBarProps {
  activeTab: string;
  favorites: string[];
  onToggleFavorite: (tabId: string) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  activeTab,
  favorites,
  onToggleFavorite,
}) => {
  const currentItem = getNavItemById(activeTab);
  const isFavorite = favorites.includes(currentItem.id);

  return (
    <div className="bg-white dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-sans shadow-2xs">
      {/* Clean Breadcrumb Path & Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-semibold text-xs">{currentItem.group}</span>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span>{currentItem.label}</span>
          <button
            onClick={() => onToggleFavorite(currentItem.id)}
            className={`p-1 rounded-md transition-all cursor-pointer ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-500'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Icon name="Star" size={16} className={isFavorite ? 'fill-amber-400' : ''} />
          </button>
        </h2>
      </div>

      {/* Description tag */}
      {currentItem.description && (
        <span className="hidden md:inline text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {currentItem.description}
        </span>
      )}
    </div>
  );
};
