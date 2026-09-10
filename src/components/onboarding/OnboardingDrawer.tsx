import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';

interface OnboardingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingDrawer: React.FC<OnboardingDrawerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    {
      id: 'stock',
      title: 'Stock',
      activitiesCount: '2 activities',
      icon: 'PackageCheck',
      bgColor: 'bg-blue-900',
    },
    {
      id: 'order',
      title: 'Order',
      activitiesCount: '3 activities',
      icon: 'ShoppingCart',
      bgColor: 'bg-blue-900',
    },
    {
      id: 'delivery',
      title: 'Delivery/collection',
      activitiesCount: '1 activity',
      icon: 'Truck',
      bgColor: 'bg-blue-900',
    },
    {
      id: 'invoice',
      title: 'Invoice',
      activitiesCount: '1 activity',
      icon: 'FileText',
      bgColor: 'bg-blue-900',
    },
    {
      id: 'reports',
      title: 'Impact Reports',
      activitiesCount: '1 activity',
      icon: 'PieChart',
      bgColor: 'bg-blue-900',
    },
  ];

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (title: string) => {
    toast.success(`Selected Category: ${title}`, {
      description: `Opening activity breakdown for ${title}...`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Right Drawer Container */}
      <div className="w-full max-w-md bg-white dark:bg-[#0e1420] text-slate-900 dark:text-white h-full shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto animate-slide-left border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome to Flow Platform Dashboard! ✨
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose a category to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141c2b] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories List */}
        <div className="space-y-3 flex-1">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.title)}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121927] hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1e293b] text-blue-400 flex items-center justify-center shadow-xs">
                  <Icon name={cat.icon} size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {cat.activitiesCount}
                  </p>
                </div>
              </div>

              <Icon
                name="ChevronRight"
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
