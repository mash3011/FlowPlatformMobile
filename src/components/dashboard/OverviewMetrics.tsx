import React from 'react';
import { OnboardingState, CategoryType } from '../../types';
import { CATEGORIES, INITIAL_CATEGORY_SUMMARIES } from '../../data/mockData';
import { Icon } from '../ui/Icon';

interface OverviewMetricsProps {
  state: OnboardingState;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  state,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CATEGORIES.filter((c) => c.id !== 'integrations').map((cat) => {
        const summary = INITIAL_CATEGORY_SUMMARIES[cat.id];
        const targetGoal = state.targets[cat.id as CategoryType] || summary?.targetGoal || 100;
        const currentCount = summary?.totalEvents || 120;
        const progressPct = Math.min(100, Math.round((currentCount / targetGoal) * 100));
        const isSelected = activeCategory === cat.id;

        return (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer bg-card ${
              isSelected
                ? 'border-primary ring-2 ring-ring/30 shadow-sm scale-[1.01]'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-muted text-foreground">
                <Icon name={cat.iconName} size={20} />
              </div>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {summary?.changeRate || '+18.2%'}
              </span>
            </div>

            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {cat.name}
            </h3>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                {currentCount.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground font-medium">/ {targetGoal} events</span>
            </div>

            {/* Category Goal Progress Bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-muted-foreground">Category Goal</span>
                <span className="text-primary font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
