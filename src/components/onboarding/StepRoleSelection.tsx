import React from 'react';
import { USER_ROLES } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { motion } from 'motion/react';

interface StepRoleSelectionProps {
  selectedRole: string;
  onSelectRole: (roleId: string, recommendedFeatures: string[]) => void;
  workspaceName: string;
  onWorkspaceNameChange: (name: string) => void;
  teamSize: string;
  onTeamSizeChange: (size: string) => void;
}

export const StepRoleSelection: React.FC<StepRoleSelectionProps> = ({
  selectedRole,
  onSelectRole,
  workspaceName,
  onWorkspaceNameChange,
  teamSize,
  onTeamSizeChange,
}) => {
  const teamSizes = ['1-5 members', '6-20 members', '21-100 members', '100+ Enterprise'];

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
          <Icon name="Sparkles" size={14} /> Step 1 of 5
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Welcome to FlowPlatform
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Let's tailor your workspace and activity dashboard. Tell us about your primary role and team structure.
        </p>
      </div>

      {/* Workspace details inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/60 backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Icon name="Building2" size={16} className="text-primary" /> Workspace Name
          </label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => onWorkspaceNameChange(e.target.value)}
            placeholder="e.g. Acme Ops Workspace"
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Icon name="Users" size={16} className="text-primary" /> Team Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {teamSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onTeamSizeChange(size)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                  teamSize === size
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                    : 'border-border bg-input-background text-muted-foreground hover:bg-accent/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="UserCheck" size={20} className="text-primary" /> Select Your Primary Focus Role
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USER_ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id, role.recommendedFeatures)}
                className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md'
                    : 'border-border bg-card/80 hover:bg-card hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-foreground group-hover:bg-primary/20 group-hover:text-primary'
                    }`}
                  >
                    <Icon name={role.iconName} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                        {role.title}
                      </h4>
                      {isSelected && (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                          <Icon name="Check" size={14} />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
