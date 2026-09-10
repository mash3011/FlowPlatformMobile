import React, { useState } from 'react';
import { ALL_FEATURES, CATEGORIES } from '../../data/mockData';
import { CategoryType } from '../../types';
import { Icon } from '../ui/Icon';
import { motion } from 'motion/react';

interface StepFeatureSelectionProps {
  selectedRole: string;
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
  onSelectAllRecommended: () => void;
  onClearAll: () => void;
}

export const StepFeatureSelection: React.FC<StepFeatureSelectionProps> = ({
  selectedRole,
  selectedFeatures,
  onToggleFeature,
  onSelectAllRecommended,
  onClearAll,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFeatures = ALL_FEATURES.filter((feature) => {
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    const matchesSearch =
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border">
          <Icon name="Layers" size={14} /> Step 2 of 4 &bull; Feature Selection
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Select Your Key Features
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the features and capabilities you'd like to enable. We'll group activity data by key categories for enhanced engagement.
        </p>
      </div>

      {/* Category Filter Tabs & Search Bar */}
      <div className="p-4 rounded-xl shadcn-card space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features by keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg shadcn-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Quick Select Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onSelectAllRecommended}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="Wand2" size={14} /> Recommended
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border font-medium hover:bg-accent transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            All Categories ({ALL_FEATURES.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = ALL_FEATURES.filter((f) => f.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon name={cat.iconName} size={13} />
                <span>{cat.name}</span>
                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const isRecommended = feature.recommendedFor.includes(selectedRole);
          const catInfo = CATEGORIES.find((c) => c.id === feature.category);

          return (
            <div
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-primary ring-2 ring-ring/30 bg-card shadow-sm'
                  : 'border-border bg-card/60 hover:border-primary/50 hover:bg-card'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`p-2.5 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <Icon name={feature.iconName} size={20} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isRecommended && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Recommended
                      </span>
                    )}
                    {feature.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-foreground text-sm flex items-center justify-between">
                  <span>{feature.title}</span>
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Card Footer with Checkbox */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Icon name={catInfo?.iconName || 'Tag'} size={12} /> {catInfo?.name || feature.category}
                </span>

                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground/40 bg-transparent'
                  }`}
                >
                  {isSelected && <Icon name="Check" size={12} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
