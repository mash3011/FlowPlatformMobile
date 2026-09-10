import React from 'react';
import { OnboardingState } from '../../types';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  state: OnboardingState;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onRestartOnboarding: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  state,
  onToggleTheme,
  onOpenSettings,
  onRestartOnboarding,
}) => {
  const handleNotifyClick = () => {
    toast.success('Workspace Synced!', {
      description: 'Your category target baselines have been updated in real-time.',
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Brand & Workspace */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
            <Icon name="Activity" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base lg:text-lg text-foreground tracking-tight">
                {state.workspaceName || 'My Workspace'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Configured for <span className="font-semibold text-foreground capitalize">{state.role.replace('-', ' ')}</span> &bull; {state.teamSize}
            </p>
          </div>
        </div>

        {/* Right Action Icons & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onRestartOnboarding}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-accent transition-colors cursor-pointer"
          >
            <Icon name="RotateCcw" size={14} /> Re-run Onboarding
          </button>

          <button
            type="button"
            onClick={handleNotifyClick}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer relative"
            title="Notifications"
          >
            <Icon name="Bell" size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {state.preferences.theme === 'dark' ? (
              <Icon name="Sun" size={18} className="text-amber-400" />
            ) : (
              <Icon name="Moon" size={18} className="text-indigo-600" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <Icon name="Settings" size={16} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
