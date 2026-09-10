import React from 'react';
import { CategoryType } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { motion } from 'motion/react';

interface StepActivityTargetsProps {
  targets: Record<CategoryType, number>;
  onUpdateTarget: (category: CategoryType, value: number) => void;
  onApplyPreset: (preset: 'balanced' | 'high-growth' | 'enterprise') => void;
}

export const StepActivityTargets: React.FC<StepActivityTargetsProps> = ({
  targets,
  onUpdateTarget,
  onApplyPreset,
}) => {
  const configs: {
    key: CategoryType;
    label: string;
    description: string;
    icon: string;
    unit: string;
    min: number;
    max: number;
    step: number;
  }[] = [
    {
      key: 'analytics',
      label: 'Analytics & Telemetry Queries',
      description: 'Expected weekly data points and telemetry queries tracked in dashboards.',
      icon: 'BarChart3',
      unit: 'queries / wk',
      min: 50,
      max: 1500,
      step: 50,
    },
    {
      key: 'automation',
      label: 'Automated Workflow Runs',
      description: 'Scheduled jobs and automated trigger executions across integrations.',
      icon: 'Workflow',
      unit: 'runs / wk',
      min: 10,
      max: 500,
      step: 10,
    },
    {
      key: 'ai',
      label: 'AI Smart Prompt Invocations',
      description: 'Generative insights, recommendations, and anomaly detection requests.',
      icon: 'Sparkles',
      unit: 'prompts / wk',
      min: 5,
      max: 200,
      step: 5,
    },
    {
      key: 'collaboration',
      label: 'Team Activity Events',
      description: 'Member interactions, audit events, and shared workspace updates.',
      icon: 'Users',
      unit: 'events / wk',
      min: 10,
      max: 300,
      step: 10,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border">
          <Icon name="Target" size={14} /> Step 3 of 4 &bull; Activity Category Goals
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Set Category Target Baselines
        </h2>
        <p className="text-sm text-muted-foreground">
          Define baseline activity targets for key categories. We'll track your engagement velocity against these goals in your live summary.
        </p>
      </div>

      {/* Preset Action Bar */}
      <div className="p-4 rounded-xl shadcn-card flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Icon name="Wand2" size={14} className="text-primary" /> Target Presets:
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onApplyPreset('balanced')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent border border-border transition-all cursor-pointer"
          >
            Balanced Baseline
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('high-growth')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent border border-border transition-all cursor-pointer"
          >
            High Growth
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('enterprise')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            Enterprise Scale
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config) => {
          const val = targets[config.key] || config.min;
          const percentage = Math.round(((val - config.min) / (config.max - config.min)) * 100);

          return (
            <div
              key={config.key}
              className="p-5 rounded-xl shadcn-card space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted text-foreground">
                    <Icon name={config.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{config.label}</h4>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Target Velocity</span>
                  <span className="font-bold text-foreground bg-primary/10 px-2.5 py-0.5 rounded text-primary">
                    {val.toLocaleString()} {config.unit}
                  </span>
                </div>

                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={val}
                  onChange={(e) => onUpdateTarget(config.key, Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                />

                <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Min ({config.min})</span>
                  <span>{percentage}% scale</span>
                  <span>Max ({config.max})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
