import React, { useState } from 'react';
import { OnboardingState, CategoryType } from '../../types';
import { CATEGORIES, ALL_FEATURES } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';

interface CategoryTabsProps {
  state: OnboardingState;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  state,
  activeCategory,
  onSelectCategory,
}) => {
  const [aiPrompts, setAiPrompts] = useState<string>('');
  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: `Hello! Based on your selected features in ${state.workspaceName}, I'm here to provide key activity insights and workflow guidance.`,
    },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const tabs = [
    { id: 'analytics', label: 'Analytics & Insights', icon: 'BarChart3' },
    { id: 'automation', label: 'Automated Workflows', icon: 'Workflow' },
    { id: 'ai', label: 'AI Smart Assistance', icon: 'Sparkles' },
    { id: 'collaboration', label: 'Team Collaboration', icon: 'Users' },
  ];

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompts.trim()) return;

    const userText = aiPrompts;
    setAiPrompts('');
    setAiChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsSimulating(true);

    setTimeout(() => {
      let aiReply = `Analyzed category query: "${userText}". Analytics activity is performing at 115% of your target goal.`;
      if (userText.toLowerCase().includes('recommend') || userText.toLowerCase().includes('feature')) {
        aiReply = `Recommendation: Enable 'Real-Time Telemetry' & 'Automated Job Execution' to increase category engagement velocity by 28%.`;
      }

      setAiChatHistory((prev) => [...prev, { role: 'ai', text: aiReply }]);
      setIsSimulating(false);
    }, 600);
  };

  const activeCategoryFeatures = ALL_FEATURES.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-card border border-border rounded-xl p-5 lg:p-6 space-y-6 shadow-xs">
      {/* Category Tab Headers */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Features & Active Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 capitalize">
            <Icon name="Layers" size={16} className="text-primary" /> Active Features in {activeCategory}
          </h3>
          <span className="text-xs font-medium text-muted-foreground">
            Target Goal: {state.targets[activeCategory as CategoryType] || 100} events/wk
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeCategoryFeatures.map((feat) => {
            const isEnabled = state.selectedFeatures.includes(feat.id);
            return (
              <div
                key={feat.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  isEnabled
                    ? 'border-primary/40 bg-primary/5 text-foreground'
                    : 'border-border bg-card/50 text-muted-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-foreground mt-0.5">
                    <Icon name={feat.iconName} size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">{feat.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{feat.description}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isEnabled
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isEnabled ? 'Active' : 'Available'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Assistance Bar */}
      {activeCategory === 'ai' && (
        <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="Sparkles" size={14} className="text-amber-400" /> Category Copilot Assistant
          </h4>

          <div className="h-36 overflow-y-auto space-y-2 p-2.5 bg-card rounded-lg border border-border">
            {aiChatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-xs max-w-[90%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted/70 text-foreground'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isSimulating && (
              <div className="p-2 text-xs text-muted-foreground animate-pulse flex items-center gap-1">
                <Icon name="Sparkles" size={12} className="text-amber-400" /> Copilot thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSendAiPrompt} className="flex gap-2">
            <input
              type="text"
              value={aiPrompts}
              onChange={(e) => setAiPrompts(e.target.value)}
              placeholder="Ask Copilot e.g., 'How do I optimize activity summaries?'"
              className="flex-1 px-3.5 py-2 rounded-lg shadcn-input text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1"
            >
              Send <Icon name="Send" size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
