export type CategoryType = 'analytics' | 'automation' | 'ai' | 'collaboration' | 'integrations';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  description: string;
  iconName: string;
  badge: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  iconName: string;
  badge?: string;
  recommendedFor: string[];
  defaultSelected?: boolean;
}

export interface UserRole {
  id: string;
  title: string;
  description: string;
  iconName: string;
  recommendedFeatures: string[];
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  emailNotifications: boolean;
  weeklySummary: boolean;
  aiAutoSuggestions: boolean;
  defaultView: 'wizard' | 'summary';
}

export interface OnboardingState {
  step: number;
  role: string;
  workspaceName: string;
  teamSize: string;
  selectedFeatures: string[];
  preferences: UserPreferences;
  targets: Record<CategoryType, number>;
  isCompleted: boolean;
}

export interface ActivityCategorySummary {
  category: CategoryType;
  name: string;
  iconName: string;
  totalEvents: number;
  targetGoal: number;
  percentComplete: number;
  changeRate: string;
  color: string;
  details: string[];
}

export interface TrendDataPoint {
  day: string;
  analytics: number;
  automation: number;
  ai: number;
  collaboration: number;
}
