import React from 'react';
import { UserPreferences } from '../../types';
import { Icon } from '../ui/Icon';
import { motion } from 'motion/react';

interface StepPreferencesProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
          <Icon name="Settings2" size={14} /> Step 3 of 5
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Preferences & Interface Setup
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Customize theme appearance, notification channels, and automated AI assistance.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="bg-card/70 backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Palette" size={18} className="text-primary" /> Workspace Theme Mode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onUpdatePreferences({ theme: 'dark' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              preferences.theme === 'dark'
                ? 'border-primary ring-2 ring-primary/30 bg-slate-900 text-white'
                : 'border-border bg-slate-950/80 text-slate-300 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Moon" size={20} className="text-indigo-400" />
                <span className="font-bold text-sm">Dark Slate Theme (Recommended)</span>
              </div>
              {preferences.theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                  <Icon name="Check" size={12} />
                </span>
              )}
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50 space-y-2">
              <div className="h-2.5 w-2/3 bg-indigo-500/40 rounded"></div>
              <div className="h-2 w-full bg-slate-700 rounded"></div>
              <div className="h-2 w-4/5 bg-slate-700 rounded"></div>
            </div>
          </div>

          <div
            onClick={() => onUpdatePreferences({ theme: 'light' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              preferences.theme === 'light'
                ? 'border-primary ring-2 ring-primary/30 bg-slate-50 text-slate-900'
                : 'border-border bg-slate-100/80 text-slate-700 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Sun" size={20} className="text-amber-500" />
                <span className="font-bold text-sm">Clean Light Theme</span>
              </div>
              {preferences.theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                  <Icon name="Check" size={12} />
                </span>
              )}
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="h-2.5 w-2/3 bg-indigo-500/40 rounded"></div>
              <div className="h-2 w-full bg-slate-200 rounded"></div>
              <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle 1: Email Notifications */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <Icon name="Mail" size={16} className="text-primary" /> Email Digests
            </div>
            <p className="text-xs text-muted-foreground">
              Receive weekly activity category digests & critical alerts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onUpdatePreferences({ emailNotifications: !preferences.emailNotifications })}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              preferences.emailNotifications ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: AI Auto Suggestions */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <Icon name="Bot" size={16} className="text-primary" /> AI Smart Copilot
            </div>
            <p className="text-xs text-muted-foreground">
              Allow AI to auto-suggest workflow optimizations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onUpdatePreferences({ aiAutoSuggestions: !preferences.aiAutoSuggestions })}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              preferences.aiAutoSuggestions ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                preferences.aiAutoSuggestions ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Default Landing Tab */}
      <div className="bg-card border border-border p-5 rounded-2xl">
        <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <Icon name="Layout" size={16} className="text-primary" /> Default Dashboard Landing View
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'overview', label: 'Overall Summary', icon: 'LayoutDashboard' },
            { id: 'workflows', label: 'Workflows', icon: 'Workflow' },
            { id: 'analytics', label: 'Analytics Board', icon: 'BarChart' },
            { id: 'ai', label: 'AI Copilot Hub', icon: 'Sparkles' },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => onUpdatePreferences({ defaultView: view.id as any })}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                preferences.defaultView === view.id
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border bg-input-background text-muted-foreground hover:bg-accent/40'
              }`}
            >
              <Icon name={view.icon} size={16} />
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
