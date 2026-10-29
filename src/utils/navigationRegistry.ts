export interface NavItem {
  id: string;
  label: string;
  section: string;
  group: string;
  groupIcon: string;
  shortcut?: string;
  description?: string;
}

export const ALL_NAV_ITEMS: NavItem[] = [
  // Dashboards
  { id: 'impact-savings', label: 'Impact Savings', section: 'MAIN', group: 'Dashboard', groupIcon: 'LayoutGrid', description: 'Overview of environmental & cost savings' },
  { id: 'performance-metrics', label: 'Performance Metrics', section: 'MAIN', group: 'Dashboard', groupIcon: 'LayoutGrid', description: 'Operational KPIs & throughput analytics' },
  { id: 'tech-bin-dashboard', label: 'Tech Bin Dashboard', section: 'MAIN', group: 'Dashboard', groupIcon: 'LayoutGrid', description: 'Real-time smart bin statuses & fill levels' },
  { id: 'circulayo-connect', label: 'Circulayo Connect Dashboard', section: 'MAIN', group: 'Dashboard', groupIcon: 'LayoutGrid', description: 'Connected partner network overview' },

  // Calendar
  { id: 'calendar-item', label: 'Calendar View', section: 'MAIN', group: 'Calendar', groupIcon: 'Calendar', description: 'Scheduled events & collection deadlines' },

  // Reports
  { id: 'stock-info', label: 'Stock Info Report', section: 'MAIN', group: 'Report', groupIcon: 'PieChart', description: 'Container inventory status report' },
  { id: 'reuse-stats', label: 'Reuse Stats Report', section: 'MAIN', group: 'Report', groupIcon: 'PieChart', description: 'Reuse cycles & lifespan stats' },
  { id: 'container-return-rate', label: 'Container Return Rate', section: 'MAIN', group: 'Report', groupIcon: 'PieChart', description: 'Return rates by venue & client' },
  { id: 'impact-report', label: 'Impact Report', section: 'MAIN', group: 'Report', groupIcon: 'PieChart', description: 'Carbon footprint & waste reduction report' },
  { id: 'golden-winner-reports', label: 'Golden Winner Reports', section: 'MAIN', group: 'Report', groupIcon: 'PieChart', description: 'Top performing accounts & locations' },

  // Management
  { id: 'stock', label: 'Stock Check', section: 'MANAGEMENT', group: 'Stock Check', groupIcon: 'ClipboardCheck', description: 'Audit physical container inventory' },
  { id: 'location', label: 'Locations', section: 'MANAGEMENT', group: 'Client/Location', groupIcon: 'GitFork', description: 'Manage client sites & drop points' },
  { id: 'clients', label: 'Clients', section: 'MANAGEMENT', group: 'Client/Location', groupIcon: 'GitFork', description: 'Client organization accounts' },
  { id: 'users', label: 'Users Directory', section: 'MANAGEMENT', group: 'Client/Location', groupIcon: 'GitFork', description: 'System & client user profiles' },
  { id: 'product-item', label: 'Product Catalog', section: 'MANAGEMENT', group: 'Product', groupIcon: 'Package', description: 'Manage container products & SKUs' },
  { id: 'product-category', label: 'Product Categories', section: 'MANAGEMENT', group: 'Product', groupIcon: 'Package', description: 'Organize products into categories' },
  { id: 'product-status', label: 'Product Statuses', section: 'MANAGEMENT', group: 'Product', groupIcon: 'Package', description: 'Track product lifecycle states' },
  { id: 'product-partner', label: 'Product Partners', section: 'MANAGEMENT', group: 'Product', groupIcon: 'Package', description: 'Manage partner supplier profiles' },
  { id: 'product-cost', label: 'Product Costs', section: 'MANAGEMENT', group: 'Product', groupIcon: 'Package', description: 'Unit pricing & deposit structures' },
  { id: 'micro-edge', label: 'Micro Edge Endpoints', section: 'MANAGEMENT', group: 'Endpoint', groupIcon: 'Settings', description: 'Edge hardware node management' },

  // Operations
  { id: 'wash-dashboard', label: 'Wash Dashboard', section: 'OPERATIONS', group: 'Wash', groupIcon: 'Droplets', description: 'Washing facility metrics & queue' },
  { id: 'prewash', label: 'Prewash Operations', section: 'OPERATIONS', group: 'Wash', groupIcon: 'Droplets', description: 'Sorting & prewash staging' },
  { id: 'wash-item', label: 'Wash Cycle Logs', section: 'OPERATIONS', group: 'Wash', groupIcon: 'Droplets', description: 'Sterilization & wash run logs' },
  { id: 'batch-dashboard', label: 'Batch Dashboard', section: 'OPERATIONS', group: 'Batch', groupIcon: 'Archive', description: 'Batch tracking overview' },
  { id: 'batch-item', label: 'Batch Records', section: 'OPERATIONS', group: 'Batch', groupIcon: 'Archive', description: 'Batch logs & container serials' },
  { id: 'events-item', label: 'Event Operations', section: 'OPERATIONS', group: 'Events', groupIcon: 'Activity', description: 'Live event container operations' },

  // Orders & Finance
  { id: 'invoice-list', label: 'Invoice List', section: 'ORDERS & FINANCE', group: 'Invoice', groupIcon: 'FileText', description: 'Billing invoices & payment statuses' },
  { id: 'invoice-services', label: 'Services Billing', section: 'ORDERS & FINANCE', group: 'Invoice', groupIcon: 'FileText', description: 'Billable activities & service logs' },
  { id: 'order-dashboard', label: 'Order Dashboard', section: 'ORDERS & FINANCE', group: 'Order', groupIcon: 'ShoppingCart', description: 'Orders & fulfillment overview' },
  { id: 'order-item', label: 'Orders List', section: 'ORDERS & FINANCE', group: 'Order', groupIcon: 'ShoppingCart', description: 'Client orders & delivery slips' },

  // Settings
  { id: 'team-users', label: 'Team Users', section: 'SETTINGS', group: 'Team', groupIcon: 'Users', description: 'Manage internal team access' },
  { id: 'team-profiles', label: 'Permission Profiles', section: 'SETTINGS', group: 'Team', groupIcon: 'Users', description: 'Role-based security permissions' },
];

export const getNavItemById = (id: string): NavItem => {
  const normalizedId = id === 'calendar' ? 'calendar-item' : id === 'invoice' ? 'invoice-list' : id === 'services' ? 'invoice-services' : id;
  return ALL_NAV_ITEMS.find((item) => item.id === normalizedId) || ALL_NAV_ITEMS[0];
};

export const getGroupSiblings = (groupId: string): NavItem[] => {
  return ALL_NAV_ITEMS.filter((item) => item.group.toLowerCase() === groupId.toLowerCase());
};

export const getSectionSiblings = (sectionName: string): NavItem[] => {
  return ALL_NAV_ITEMS.filter((item) => item.section.toLowerCase() === sectionName.toLowerCase());
};
