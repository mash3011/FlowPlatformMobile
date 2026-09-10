import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { OnboardingState } from '../../types';
import { USER_ROLES, ALL_FEATURES, CATEGORIES } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { motion } from 'motion/react';

interface StepCompletionSummaryProps {
  state: OnboardingState;
  onEnterDashboard: () => void;
  onRestartWizard: () => void;
}

export const StepCompletionSummary: React.FC<StepCompletionSummaryProps> = ({
  state,
  onEnterDashboard,
  onRestartWizard,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch (e) {
      console.log('Confetti burst', e);
    }
  }, []);

  const roleObj = USER_ROLES.find((r) => r.id === state.role) || USER_ROLES[0];
  const selectedFeatureObjs = ALL_FEATURES.filter((f) => state.selectedFeatures.includes(f.id));

  // Count active categories selected
  const selectedCategoryIds = Array.from(new Set(selectedFeatureObjs.map((f) => f.category)));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-center max-w-3xl mx-auto"
    >
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
          <Icon name="CheckCircle2" size={36} />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Step 4 of 4 &bull; Setup Complete
        </span>

        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Onboarding Complete!
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Here is your summary of activity and configured feature categories for <span className="font-bold text-foreground">{state.workspaceName || 'Your Workspace'}</span>.
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="p-6 rounded-xl shadcn-card border border-border text-left space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Profile Persona
            </span>
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Icon name={roleObj.iconName} size={20} className="text-primary" />
              {roleObj.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
              {selectedFeatureObjs.length} Features Active
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground border border-border">
              {selectedCategoryIds.length} Key Categories
            </span>
          </div>
        </div>

        {/* Selected Categories Summary Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Activity Summary by Category
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.filter((c) => selectedCategoryIds.includes(c.id)).map((cat) => {
              const featuresInCat = selectedFeatureObjs.filter((f) => f.category === cat.id);
              const targetGoal = state.targets[cat.id] || 100;

              return (
                <div key={cat.id} className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Icon name={cat.iconName} size={14} className="text-primary" />
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Goal: {targetGoal}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {featuresInCat.length} features enabled ({featuresInCat.map((f) => f.title).join(', ')})
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onEnterDashboard}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>View Live Activity Summary</span>
          <Icon name="ArrowRight" size={16} />
        </button>

        <button
          type="button"
          onClick={onRestartWizard}
          className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-secondary text-secondary-foreground border border-border font-medium text-xs hover:bg-accent transition-all cursor-pointer"
        >
          Re-configure Setup
        </button>
      </div>
    </motion.div>
  );
};
