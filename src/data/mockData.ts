import { CategoryInfo, FeatureItem, UserRole, TrendDataPoint, ActivityCategorySummary } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    description: 'Track key performance metrics, telemetry, and user activity across dashboards.',
    iconName: 'BarChart3',
    badge: 'Popular',
  },
  {
    id: 'automation',
    name: 'Automated Workflows',
    description: 'Trigger multi-step automations, scheduled webhooks, and status alerts.',
    iconName: 'Workflow',
    badge: 'Essential',
  },
  {
    id: 'ai',
    name: 'AI Smart Assistance',
    description: 'Generative insights, intelligent recommendations, and copilot search.',
    iconName: 'Sparkles',
    badge: 'AI Powered',
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Shared workspaces, activity feeds, audit logs, and permission controls.',
    iconName: 'Users',
    badge: 'Core',
  },
  {
    id: 'integrations',
    name: 'Developer Hub & API',
    description: 'Connect Slack, GitHub, Figma, Webhooks, and custom data pipelines.',
    iconName: 'Plug',
    badge: 'Dev Tools',
  },
];

export const USER_ROLES: UserRole[] = [
  {
    id: 'product-lead',
    title: 'Product Manager / Lead',
    description: 'Focus on tracking features, team velocity, and high-level activity summaries.',
    iconName: 'LayoutDashboard',
    recommendedFeatures: ['feat-analytics-1', 'feat-auto-1', 'feat-collab-1', 'feat-ai-1'],
  },
  {
    id: 'developer',
    title: 'Software Engineer',
    description: 'Automate CI/CD pipelines, monitor API endpoints, and setup dev webhooks.',
    iconName: 'Code2',
    recommendedFeatures: ['feat-auto-1', 'feat-integ-1', 'feat-ai-1', 'feat-integ-2'],
  },
  {
    id: 'data-analyst',
    title: 'Data & Growth Analyst',
    description: 'Deep dive into cohort analytics, data visualizers, and automated reports.',
    iconName: 'TrendingUp',
    recommendedFeatures: ['feat-analytics-1', 'feat-analytics-2', 'feat-ai-1'],
  },
  {
    id: 'operations',
    title: 'Ops & Marketing Manager',
    description: 'Streamline cross-platform customer journeys and real-time activity alerts.',
    iconName: 'Zap',
    recommendedFeatures: ['feat-auto-1', 'feat-collab-1', 'feat-analytics-1'],
  },
];

export const ALL_FEATURES: FeatureItem[] = [
  // Analytics
  {
    id: 'feat-analytics-1',
    title: 'Real-Time Telemetry Dashboard',
    description: 'Monitor active session events, request throughput, and live error rates.',
    category: 'analytics',
    iconName: 'Activity',
    badge: 'Essential',
    recommendedFor: ['product-lead', 'data-analyst', 'developer'],
    defaultSelected: true,
  },
  {
    id: 'feat-analytics-2',
    title: 'Category Activity Digests',
    description: 'Group activity logs by key categories with automatic weekly trend analysis.',
    category: 'analytics',
    iconName: 'PieChart',
    recommendedFor: ['data-analyst', 'product-lead'],
    defaultSelected: true,
  },

  // Automation
  {
    id: 'feat-auto-1',
    title: 'No-Code Event Triggers',
    description: 'Create multi-step automated actions triggered by specific user interactions.',
    category: 'automation',
    iconName: 'Workflow',
    badge: 'Popular',
    recommendedFor: ['product-lead', 'developer', 'operations'],
    defaultSelected: true,
  },
  {
    id: 'feat-auto-2',
    title: 'Scheduled Job Execution',
    description: 'Run recurring data aggregations, nightly reports, and cleanup tasks automatically.',
    category: 'automation',
    iconName: 'Clock',
    recommendedFor: ['developer', 'operations'],
  },

  // AI
  {
    id: 'feat-ai-1',
    title: 'AI Smart Copilot & Insights',
    description: 'Generative summaries, auto-detected anomalies, and workflow optimization prompts.',
    category: 'ai',
    iconName: 'Sparkles',
    badge: 'AI Powered',
    recommendedFor: ['product-lead', 'developer', 'data-analyst'],
    defaultSelected: true,
  },
  {
    id: 'feat-ai-2',
    title: 'Automated Insight Digest',
    description: 'Smart recommendations delivered when activity anomalies occur in key categories.',
    category: 'ai',
    iconName: 'BrainCircuit',
    recommendedFor: ['product-lead', 'data-analyst'],
  },

  // Collaboration
  {
    id: 'feat-collab-1',
    title: 'Team Activity Feed',
    description: 'Shared audit log displaying member actions, role changes, and feature updates.',
    category: 'collaboration',
    iconName: 'Users',
    recommendedFor: ['product-lead', 'operations'],
    defaultSelected: true,
  },
  {
    id: 'feat-collab-2',
    title: 'Role-Based Access Control',
    description: 'Granular permissions for workspace members with custom admin policy rules.',
    category: 'collaboration',
    iconName: 'ShieldCheck',
    recommendedFor: ['product-lead', 'operations'],
  },

  // Integrations
  {
    id: 'feat-integ-1',
    title: 'Webhook & Slack Notifications',
    description: 'Instant event alerts sent directly to dedicated Slack channels or custom APIs.',
    category: 'integrations',
    iconName: 'Send',
    recommendedFor: ['developer', 'operations'],
  },
  {
    id: 'feat-integ-2',
    title: 'GitHub & Figma Webhook Sync',
    description: 'Sync pull requests, commit deploys, and Figma design comments seamlessly.',
    category: 'integrations',
    iconName: 'GitBranch',
    recommendedFor: ['developer', 'product-lead'],
  },
];

export const MOCK_TRENDS: TrendDataPoint[] = [
  { day: 'Mon', analytics: 140, automation: 45, ai: 20, collaboration: 35 },
  { day: 'Tue', analytics: 220, automation: 70, ai: 38, collaboration: 50 },
  { day: 'Wed', analytics: 310, automation: 110, ai: 62, collaboration: 65 },
  { day: 'Thu', analytics: 420, automation: 150, ai: 85, collaboration: 90 },
  { day: 'Fri', analytics: 510, automation: 195, ai: 110, collaboration: 115 },
  { day: 'Sat', analytics: 340, automation: 120, ai: 65, collaboration: 45 },
  { day: 'Sun', analytics: 260, automation: 90, ai: 48, collaboration: 30 },
];

export const INITIAL_CATEGORY_SUMMARIES: Record<string, ActivityCategorySummary> = {
  analytics: {
    category: 'analytics',
    name: 'Analytics & Insights',
    iconName: 'BarChart3',
    totalEvents: 510,
    targetGoal: 600,
    percentComplete: 85,
    changeRate: '+24.5%',
    color: '#6366f1',
    details: ['1,420 queries executed', 'Real-time telemetry uptime: 99.99%', '3 active custom boards'],
  },
  automation: {
    category: 'automation',
    name: 'Automated Workflows',
    iconName: 'Workflow',
    totalEvents: 195,
    targetGoal: 200,
    percentComplete: 97,
    changeRate: '+32.1%',
    color: '#10b981',
    details: ['195 trigger executions', '99.4% execution success rate', 'Saved ~16.5 hours this week'],
  },
  ai: {
    category: 'ai',
    name: 'AI Smart Assistance',
    iconName: 'Sparkles',
    totalEvents: 110,
    targetGoal: 120,
    percentComplete: 91,
    changeRate: '+40.8%',
    color: '#f59e0b',
    details: ['110 prompt responses', '4 high-impact suggestions applied', 'Automated anomaly detection active'],
  },
  collaboration: {
    category: 'collaboration',
    name: 'Team Collaboration',
    iconName: 'Users',
    totalEvents: 115,
    targetGoal: 150,
    percentComplete: 76,
    changeRate: '+12.4%',
    color: '#a78bfa',
    details: ['6 active workspace members', '115 audit feed events logged', '3 delegated admin roles'],
  },
};
