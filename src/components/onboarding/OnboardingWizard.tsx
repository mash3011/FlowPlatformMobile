import React from 'react';
import { OnboardingState, CategoryType, UserPreferences } from '../../types';
import { StepRoleSelection } from './StepRoleSelection';
import { StepFeatureSelection } from './StepFeatureSelection';
import { StepActivityTargets } from './StepActivityTargets';
import { StepCompletionSummary } from './StepCompletionSummary';
import { Icon } from '../ui/Icon';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingWizardProps {
  state: OnboardingState;
  onUpdateState: (updated: Partial<OnboardingState>) => void;
  onComplete: () => void;
  onToggleTheme: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  state,
  onUpdateState,
  onComplete,
  onToggleTheme,
}) => {
  const currentStep = state.step;

  const handleNextStep = () => {
    if (currentStep < 4) {
      onUpdateState({ step: currentStep + 1 });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      onUpdateState({ step: currentStep - 1 });
    }
  };

  const handleRoleSelect = (roleId: string, recommendedFeatures: string[]) => {
    onUpdateState({
      role: roleId,
      selectedFeatures: Array.from(new Set([...state.selectedFeatures, ...recommendedFeatures])),
    });
  };

  const handleToggleFeature = (featureId: string) => {
    const isSelected = state.selectedFeatures.includes(featureId);
    const updated = isSelected
      ? state.selectedFeatures.filter((id) => id !== featureId)
      : [...state.selectedFeatures, featureId];
    onUpdateState({ selectedFeatures: updated });
  };

  const handleSelectAllRecommended = () => {
    onUpdateState({
      selectedFeatures: [
        'feat-analytics-1',
        'feat-analytics-2',
        'feat-auto-1',
        'feat-auto-2',
        'feat-ai-1',
        'feat-collab-1',
      ],
    });
  };

  const handleClearAll = () => {
    onUpdateState({ selectedFeatures: [] });
  };

  const handleUpdateTarget = (category: CategoryType, value: number) => {
    onUpdateState({
      targets: {
        ...state.targets,
        [category]: value,
      },
    });
  };

  const handleApplyPreset = (preset: 'balanced' | 'high-growth' | 'enterprise') => {
    if (preset === 'balanced') {
      onUpdateState({
        targets: { analytics: 500, automation: 150, ai: 50, collaboration: 60, integrations: 30 },
      });
    } else if (preset === 'high-growth') {
      onUpdateState({
        targets: { analytics: 900, automation: 300, ai: 100, collaboration: 120, integrations: 60 },
      });
    } else {
      onUpdateState({
        targets: { analytics: 1500, automation: 500, ai: 200, collaboration: 250, integrations: 100 },
      });
    }
  };

  const stepTitles = ['Role Setup', 'Feature Selection', 'Category Goals', 'Summary & Launch'];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 md:p-8 transition-colors">
      {/* Top Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
            <Icon name="Activity" size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-foreground">User onboarding flow</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Feature selection & activity category summary</p>
          </div>
        </div>

        {/* Right Navigation & Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {stepTitles.map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPassed = currentStep > stepNum;

              return (
                <div key={title} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground ring-4 ring-ring/20'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isPassed ? <Icon name="Check" size={12} /> : stepNum}
                  </div>
                  {idx < stepTitles.length - 1 && (
                    <div
                      className={`h-0.5 w-5 rounded transition-colors ${
                        isPassed ? 'bg-emerald-500' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {state.preferences.theme === 'dark' ? (
              <Icon name="Sun" size={16} className="text-amber-400" />
            ) : (
              <Icon name="Moon" size={16} className="text-indigo-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Step Container */}
      <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-center my-4">
        {/* Progress Line */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <StepRoleSelection
              key="step1"
              selectedRole={state.role}
              onSelectRole={handleRoleSelect}
              workspaceName={state.workspaceName}
              onWorkspaceNameChange={(name) => onUpdateState({ workspaceName: name })}
              teamSize={state.teamSize}
              onTeamSizeChange={(size) => onUpdateState({ teamSize: size })}
            />
          )}

          {currentStep === 2 && (
            <StepFeatureSelection
              key="step2"
              selectedRole={state.role}
              selectedFeatures={state.selectedFeatures}
              onToggleFeature={handleToggleFeature}
              onSelectAllRecommended={handleSelectAllRecommended}
              onClearAll={handleClearAll}
            />
          )}

          {currentStep === 3 && (
            <StepActivityTargets
              key="step3"
              targets={state.targets}
              onUpdateTarget={handleUpdateTarget}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {currentStep === 4 && (
            <StepCompletionSummary
              key="step4"
              state={state}
              onEnterDashboard={onComplete}
              onRestartWizard={() => onUpdateState({ step: 1 })}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Nav Controls */}
      {currentStep < 4 && (
        <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                : 'bg-secondary text-secondary-foreground border border-border hover:bg-accent'
            }`}
          >
            <Icon name="ArrowLeft" size={14} /> Back
          </button>

          <span className="text-xs font-medium text-muted-foreground hidden sm:block">
            Step {currentStep} of 4 &bull; {stepTitles[currentStep - 1]}
          </span>

          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Continue <Icon name="ArrowRight" size={14} />
          </button>
        </footer>
      )}
    </div>
  );
};
