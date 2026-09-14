import React from 'react';
import { OnboardingState, CategoryType } from '../../types';
import { ALL_FEATURES } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { CustomSelect } from '../ui/CustomSelect';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: OnboardingState;
  onUpdateState: (updated: Partial<OnboardingState>) => void;
  onRestartOnboarding: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  onRestartOnboarding,
}) => {
  if (!isOpen) return null;

  const handleToggleFeature = (featId: string) => {
    const isSelected = state.selectedFeatures.includes(featId);
    const updated = isSelected
      ? state.selectedFeatures.filter((id) => id !== featId)
      : [...state.selectedFeatures, featId];
    onUpdateState({ selectedFeatures: updated });
    toast.success('Feature Configuration Updated');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Icon name="Settings" size={20} className="text-primary" /> Workspace & Onboarding Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Modify active modules, target goals, or re-run setup wizard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Workspace Name & Team */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Workspace Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={state.workspaceName}
                onChange={(e) => onUpdateState({ workspaceName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Team Size Tier
              </label>
              <CustomSelect
                value={state.teamSize}
                onChange={(val) => onUpdateState({ teamSize: val })}
                options={['1-5 members', '6-20 members', '21-100 members', '100+ Enterprise']}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Active Features Quick Toggle */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Active Core Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_FEATURES.map((feat) => {
              const isSelected = state.selectedFeatures.includes(feat.id);
              return (
                <div
                  key={feat.id}
                  onClick={() => handleToggleFeature(feat.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-foreground font-semibold'
                      : 'border-border bg-card text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span className="text-xs flex items-center gap-2">
                    <Icon name={feat.iconName} size={16} className="text-primary" />
                    {feat.title}
                  </span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    {isSelected && <Icon name="Check" size={10} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRestartOnboarding();
            }}
            className="px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-bold text-xs hover:bg-destructive hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="RotateCcw" size={14} /> Restart Onboarding Flow
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
