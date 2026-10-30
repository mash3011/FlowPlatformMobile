import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { MobilePreferencesModal } from './MobilePreferencesModal';
import { toast } from 'sonner';

interface MobileStockCheckViewProps {
  onOpenSidebar: () => void;
  onSelectNavTab?: (tab: string) => void;
  persona?: 'circulayo-teams' | 'clients-view';
  onPersonaChange?: (p: 'circulayo-teams' | 'clients-view') => void;
}

export type StockCheckVariation =
  | 'circulayo-teams'
  | 'clients-view'
  | 'figma-exact'
  | 'dual-filter'
  | 'accordion-venues'
  | 'left-rail'
  | 'swipe-carousel'
  | 'capsule-search'
  | 'stat-chips'
  | 'venue-sheet'
  | 'compact-floor';

// =========================================================================
// DATA MODELS FOR CIRCULAYO TEAMS & CLIENTS VIEWS
// =========================================================================
export interface VenueLocation {
  id: string;
  name: string;
  shortName: string;
  areas: string[];
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
  categories: number;
}

export interface ClientAccount {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  badgeBg: string;
  locations: VenueLocation[];
}

export const getLocationInitials = (name: string): string => {
  if (!name || name === 'All Locations' || name.toLowerCase() === 'all') return 'AL';
  const locMatch = name.match(/location\s*(\d+)/i);
  if (locMatch) return `L${locMatch[1]}`;
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const CustomerLogo: React.FC<{
  clientId: string;
  size?: number;
  className?: string;
}> = ({ clientId, size = 22, className = '' }) => {
  if (clientId === 'delaware-north') {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-md bg-[#004f32] flex items-center justify-center shrink-0 shadow-xs border border-emerald-900/30 overflow-hidden ${className}`}
        title="Delaware North UK"
      >
        <span className="text-[10px] font-black tracking-tighter text-white flex items-center">
          D<span className="text-amber-400">N</span>
        </span>
      </div>
    );
  }

  if (clientId === 'compass-group') {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-md bg-[#002d62] flex items-center justify-center shrink-0 shadow-xs border border-blue-900/30 overflow-hidden ${className}`}
        title="Compass Group / Levy"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[75%] h-[75%]">
          <circle cx="12" cy="12" r="9" stroke="#00a3e0" strokeWidth="2" />
          <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" fill="#ffffff" />
          <circle cx="12" cy="12" r="2" fill="#c41230" />
        </svg>
      </div>
    );
  }

  if (clientId === 'elior-uk') {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-md bg-[#5c1d3f] flex items-center justify-center shrink-0 shadow-xs border border-purple-900/30 overflow-hidden ${className}`}
        title="Elior UK"
      >
        <span className="text-[9px] font-black tracking-tight text-amber-300">
          elior
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-md bg-emerald-800 text-white font-black text-[10px] flex items-center justify-center shrink-0 ${className}`}
    >
      {clientId.slice(0, 2).toUpperCase()}
    </div>
  );
};

export interface StockProductItem {
  id: string;
  title: string;
  count: number;
  badgeColor: string;
  badgePosition: 'top-left' | 'top-right';
  icon: string;
  status: 'Available' | 'Low Stock';
  clientId: string;
  locationId: string;
  area: string;
  category: string;
}

const CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'delaware-north',
    name: 'Delaware North UK',
    shortName: 'Delaware North',
    badge: 'DN',
    badgeBg: 'bg-emerald-700',
    locations: [
      {
        id: 'loc-1',
        name: 'Location 1',
        shortName: 'Location 1',
        areas: ['All Locations', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
        totalItems: 385,
        availableItems: 376,
        lowStockItems: 9,
        categories: 4,
      },
      {
        id: 'loc-2',
        name: 'Location 2',
        shortName: 'Location 2',
        areas: ['All Locations', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
        totalItems: 9,
        availableItems: 9,
        lowStockItems: 0,
        categories: 1,
      },
      {
        id: 'loc-3',
        name: 'Location 3',
        shortName: 'Location 3',
        areas: ['All Locations', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
        totalItems: 42,
        availableItems: 42,
        lowStockItems: 0,
        categories: 1,
      },
      {
        id: 'loc-4',
        name: 'Location 4',
        shortName: 'Location 4',
        areas: ['All Locations', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
        totalItems: 18,
        availableItems: 18,
        lowStockItems: 0,
        categories: 1,
      },
      {
        id: 'loc-5',
        name: 'Location 5',
        shortName: 'Location 5',
        areas: ['All Locations', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
        totalItems: 12,
        availableItems: 12,
        lowStockItems: 0,
        categories: 1,
      },
    ],
  },
  {
    id: 'compass-group',
    name: 'Compass Group / Levy UK',
    shortName: 'Compass / Levy',
    badge: 'CG',
    badgeBg: 'bg-blue-700',
    locations: [
      {
        id: 'aston-villa',
        name: 'Villa Park Stadium (Aston Villa FC)',
        shortName: 'Villa Park',
        areas: ['All Areas', 'Holte End Bar', 'Trinity Concourse', 'Lorne Street Lounge', 'McGregor’s Bar'],
        totalItems: 340,
        availableItems: 328,
        lowStockItems: 12,
        categories: 4,
      },
      {
        id: 'leicester-tigers',
        name: 'Mattioli Woods Welford Road Stadium',
        shortName: 'Leicester Tigers',
        areas: ['All Areas', 'Crumbie Concourse', '1880 Clubhouse Bar', 'Robin Hood Stand'],
        totalItems: 215,
        availableItems: 208,
        lowStockItems: 7,
        categories: 3,
      },
    ],
  },
  {
    id: 'elior-uk',
    name: 'Elior UK Sports & Stadia',
    shortName: 'Elior UK',
    badge: 'EL',
    badgeBg: 'bg-indigo-700',
    locations: [
      {
        id: 'southampton-fc',
        name: "St Mary's Stadium (Southampton FC)",
        shortName: 'St Mary’s Stadium',
        areas: ['All Areas', 'Kingsland Stand Bar', 'Markus Liebherr Lounge', 'Chapel Stand Kiosk'],
        totalItems: 290,
        availableItems: 290,
        lowStockItems: 0,
        categories: 4,
      },
      {
        id: 'rangers-fc',
        name: 'Ibrox Stadium (Rangers FC)',
        shortName: 'Ibrox Stadium',
        areas: ['All Areas', 'Club Deck Bar', 'Bar 72 Concourse', 'Bill Struth Main Stand'],
        totalItems: 380,
        availableItems: 362,
        lowStockItems: 18,
        categories: 5,
      },
    ],
  },
  {
    id: 'sodexo-live',
    name: 'Sodexo Live! UK',
    shortName: 'Sodexo Live',
    badge: 'SL',
    badgeBg: 'bg-amber-700',
    locations: [
      {
        id: 'brighton-fc',
        name: 'Amex Stadium (Brighton & Hove Albion)',
        shortName: 'Amex Stadium',
        areas: ['All Areas', 'East Concourse Bar', '1901 Platinum Club', 'Dick’s Bar'],
        totalItems: 310,
        availableItems: 302,
        lowStockItems: 8,
        categories: 4,
      },
      {
        id: 'hampden-park',
        name: 'Hampden Park National Stadium',
        shortName: 'Hampden Park',
        areas: ['All Areas', 'South Stand Concourse', 'Superbox Hospitality', 'Millennium Bar'],
        totalItems: 440,
        availableItems: 422,
        lowStockItems: 18,
        categories: 5,
      },
    ],
  },
];

// Product master list with venue mapping
const SAMPLE_PRODUCTS_CATALOG: StockProductItem[] = [
  // Derby County FC (Delaware North)
  {
    id: 'p1',
    title: 'Strongbow Original Cider Can',
    count: 100,
    badgeColor: '#006891',
    badgePosition: 'top-left',
    icon: 'DollarSign',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'loc-1',
    area: 'Main Bar - Concourse East',
    category: 'Cider',
  },
  {
    id: 'p2',
    title: 'Coors Light 24x330ml Bottles',
    count: 240,
    badgeColor: '#1d7566',
    badgePosition: 'top-right',
    icon: 'Wine',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'loc-1',
    area: 'South Stand Cellar',
    category: 'Beer',
  },
  {
    id: 'p3',
    title: 'Heineken 0.0% 24x330ml Bottles',
    count: 36,
    badgeColor: '#35393d',
    badgePosition: 'top-left',
    icon: 'Coffee',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'loc-1',
    area: 'West Stand Concourse',
    category: 'Low Alcohol',
  },
  {
    id: 'p4',
    title: 'Pravha Keg 50L',
    count: 0,
    badgeColor: '#1d7566',
    badgePosition: 'top-right',
    icon: 'Layers',
    status: 'Low Stock',
    clientId: 'delaware-north',
    locationId: 'loc-1',
    area: 'South Stand Cellar',
    category: 'Kegs',
  },
  {
    id: 'p5',
    title: 'Pint GG',
    count: 9,
    badgeColor: '#006891',
    badgePosition: 'top-left',
    icon: 'CupSoda',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'loc-1',
    area: 'Main Bar - Concourse East',
    category: 'Reusable Cups',
  },
  // London Stadium (Delaware North)
  {
    id: 'p6',
    title: 'Amstel Lager 50L Keg',
    count: 180,
    badgeColor: '#1e878e',
    badgePosition: 'top-right',
    icon: 'Layers',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'london-stadium',
    area: 'Hospitality Concourse',
    category: 'Kegs',
  },
  {
    id: 'p7',
    title: 'Birra Moretti 24x330ml',
    count: 140,
    badgeColor: '#1d7566',
    badgePosition: 'top-left',
    icon: 'Wine',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'london-stadium',
    area: 'Arnold Hills Lounge',
    category: 'Beer',
  },
  {
    id: 'p8',
    title: 'Guinness Extra Cold Keg 50L',
    count: 0,
    badgeColor: '#35393d',
    badgePosition: 'top-right',
    icon: 'Layers',
    status: 'Low Stock',
    clientId: 'delaware-north',
    locationId: 'london-stadium',
    area: 'Island Bar North',
    category: 'Kegs',
  },
  {
    id: 'p9',
    title: 'Pint GG',
    count: 14,
    badgeColor: '#006891',
    badgePosition: 'top-left',
    icon: 'CupSoda',
    status: 'Available',
    clientId: 'delaware-north',
    locationId: 'london-stadium',
    area: 'Hospitality Concourse',
    category: 'Reusable Cups',
  },
  // Aston Villa (Compass Group)
  {
    id: 'p10',
    title: 'Carling Draught 50L Keg',
    count: 220,
    badgeColor: '#1d7566',
    badgePosition: 'top-left',
    icon: 'Layers',
    status: 'Available',
    clientId: 'compass-group',
    locationId: 'aston-villa',
    area: 'Holte End Bar',
    category: 'Kegs',
  },
  {
    id: 'p11',
    title: 'Madrí Excepcional Bottles',
    count: 108,
    badgeColor: '#1e878e',
    badgePosition: 'top-right',
    icon: 'Wine',
    status: 'Available',
    clientId: 'compass-group',
    locationId: 'aston-villa',
    area: 'Trinity Concourse',
    category: 'Beer',
  },
  {
    id: 'p12',
    title: 'Thatchers Gold Cider Keg',
    count: 0,
    badgeColor: '#35393d',
    badgePosition: 'top-left',
    icon: 'DollarSign',
    status: 'Low Stock',
    clientId: 'compass-group',
    locationId: 'aston-villa',
    area: 'Lorne Street Lounge',
    category: 'Cider',
  },
  {
    id: 'p13',
    title: 'Pint GG',
    count: 12,
    badgeColor: '#006891',
    badgePosition: 'top-left',
    icon: 'CupSoda',
    status: 'Available',
    clientId: 'compass-group',
    locationId: 'aston-villa',
    area: 'Holte End Bar',
    category: 'Reusable Cups',
  },
];

export const MobileStockCheckView: React.FC<MobileStockCheckViewProps> = ({
  onOpenSidebar,
  onSelectNavTab,
  persona,
  onPersonaChange,
}) => {
  const [variation, setVariation] = useState<StockCheckVariation>(persona || 'circulayo-teams');

  useEffect(() => {
    if (persona) {
      setVariation(persona);
    }
  }, [persona]);

  // =========================================================================
  // 1. CIRCULAYO TEAMS VIEW STATE
  // Merged All & Location + Client Filter (No status / low stock)
  // =========================================================================
  const [ctClient, setCtClient] = useState<string>('delaware-north');
  const [isCtClientOpen, setIsCtClientOpen] = useState(false);
  const [ctLocation, setCtLocation] = useState<string>('all');
  const [isCtLocationOpen, setIsCtLocationOpen] = useState(false);
  const [ctSearchQuery, setCtSearchQuery] = useState('');

  // Filter Bottom Sheet State (Opened via Filter icon beside Stock Check)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState<string>('Derby County FC');
  const [isFilterCustomerOpen, setIsFilterCustomerOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>('Select Location');
  const [isFilterLocationOpen, setIsFilterLocationOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Current Stock');

  // Favorite Locations State
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>(['Location 1']);
  const [isCtOnlyFavorites, setIsCtOnlyFavorites] = useState(false);
  const [isClientOnlyFavorites, setIsClientOnlyFavorites] = useState(false);
  const toggleFavoriteLocation = (locName: string) => {
    setFavoriteLocations((prev) =>
      prev.includes(locName) ? prev.filter((l) => l !== locName) : [...prev, locName]
    );
  };

  // =========================================================================
  // 2. CLIENTS VIEW STATE
  // Merged All & Location Dropdown (No separate status / low stock)
  // =========================================================================
  const [clientLocation, setClientLocation] = useState<string>('All Locations');
  const [isClientLocationOpen, setIsClientLocationOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  // Customer Org Simulator (Allows previewing different client accounts)
  const [activeCustomerOrgId, setActiveCustomerOrgId] = useState<string>('derby-fc');
  const [isCustomerOrgPickerOpen, setIsCustomerOrgPickerOpen] = useState(false);

  // 3-Dot More Menu & Preferences Modal state
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('green');

  // Close all open popovers
  const closeAllPopovers = () => {
    setIsCtClientOpen(false);
    setIsCtLocationOpen(false);
    setIsClientLocationOpen(false);
    setIsCustomerOrgPickerOpen(false);
    setIsThreeDotMenuOpen(false);
  };

    // Filters
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeVenueFilter, setActiveVenueFilter] = useState('Derby County FC');
  const [activeLeftRailVenue, setActiveLeftRailVenue] = useState('DC');
  const [leftRailStockFilter, setLeftRailStockFilter] = useState<'all' | 'available' | 'low-stock'>('all');
  const [isLeftRailOpen, setIsLeftRailOpen] = useState(true);

  // Accordion state
  const [expandedVenues, setExpandedVenues] = useState<Record<string, boolean>>({
    'Derby County FC': true,
    'Notts County': false,
    'Venue 4': false,
    'Venue 5': false,
  });

  const toggleVenueAccordion = (venue: string) => {
    setExpandedVenues((prev) => ({
      ...prev,
      [venue]: !prev[venue],
    }));
  };

  // Variation 5: Swipe Carousel Collapsible Venues state
  const [expandedCarouselVenues, setExpandedCarouselVenues] = useState<Record<string, boolean>>({
    'Derby County FC': true,
    'Notts County': false,
    'Venue 4': false,
    'Venue 5': false,
  });

  const toggleCarouselVenue = (venue: string) => {
    setExpandedCarouselVenues((prev) => ({
      ...prev,
      [venue]: !prev[venue],
    }));
  };

  // Variation 6: Capsule Dropdown & Location Search state
  const [capsuleStatusFilter, setCapsuleStatusFilter] = useState<'All' | 'Available' | 'Low Stock'>('All');
  const [isCapsuleDropdownOpen, setIsCapsuleDropdownOpen] = useState(false);
  const [capsuleLocationSearch, setCapsuleLocationSearch] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [capsuleSelectedVenue, setCapsuleSelectedVenue] = useState<string>('Derby County FC');
  const [venueSearchQuery, setVenueSearchQuery] = useState('');

  // Variation 7: Interactive Stat Chips state
  const [statChipFilter, setStatChipFilter] = useState<'all' | 'categories' | 'low-stock'>('all');
  const [statChipSearch, setStatChipSearch] = useState('');
  const [statChipVenue, setStatChipVenue] = useState('Derby County FC');
  const [isStatChipVenueOpen, setIsStatChipVenueOpen] = useState(false);

  // Variation 8: Venue Sheet & Native Capsule state
  const [isVenueSheetOpen, setIsVenueSheetOpen] = useState(false);
  const [sheetSelectedVenue, setSheetSelectedVenue] = useState('Derby County FC');
  const [sheetStatusFilter, setSheetStatusFilter] = useState<'all' | 'available' | 'low-stock'>('all');
  const [sheetSearch, setSheetSearch] = useState('');

  // Variation 9: Compact Floor / Field Mode state
  const [compactStatus, setCompactStatus] = useState<'All' | 'Available' | 'Low Stock'>('All');
  const [isCompactStatusOpen, setIsCompactStatusOpen] = useState(false);
  const [compactSearch, setCompactSearch] = useState('');
  const [compactVenue, setCompactVenue] = useState('Derby County FC');
  const [isCompactVenueOpen, setIsCompactVenueOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7f6] text-slate-900 font-sans relative select-none">
      {/* ========================================================================= */}
      {/* TOP HEADER BAR: Hamburger Menu | "Flow Platform" | 3-Dot More Menu */}
      {/* ========================================================================= */}
      <header className="h-14 bg-[#1f2937] text-white flex items-center justify-between px-4 shrink-0 z-30 shadow-md rounded-b-2xl relative">
        <button
          onClick={onOpenSidebar}
          className="p-1 rounded-lg text-white hover:text-slate-300 transition-colors cursor-pointer"
          title="Open Navigation Menu"
        >
          <Icon name="Menu" size={22} strokeWidth={2.2} />
        </button>

        <h1 className="text-[17px] font-bold tracking-tight text-white select-none">
          Flow Platform
        </h1>

        {/* 3-Dot More Menu Button & Dropdown matching Screenshot 1 */}
        <div className="relative">
          <button
            onClick={() => setIsThreeDotMenuOpen(!isThreeDotMenuOpen)}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            title="More Options"
          >
            <Icon name="MoreVertical" size={19} strokeWidth={2.2} />
          </button>

          {/* 3-Dot Dropdown Menu */}
          {isThreeDotMenuOpen && (
            <div className="absolute top-[42px] right-0 w-44 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  setIsPreferencesOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="Settings" size={15} className="text-slate-400" />
                <span>Preferences</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.info('No new notifications');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="Bell" size={15} className="text-slate-400" />
                <span>Notifications</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.info('Help center: support@flowplatform.com');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700"
              >
                <Icon name="HelpCircle" size={15} className="text-slate-400" />
                <span>Help</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setIsThreeDotMenuOpen(false);
                  toast.success('Logged out successfully');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-red-50 transition-colors cursor-pointer text-xs font-semibold text-red-600"
              >
                <Icon name="LogOut" size={15} className="text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Preferences Modal matching Screenshot 2 */}
      <MobilePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={(th) => setCurrentTheme(th)}
      />

      {/* ========================================================================= */}
      {/* DYNAMIC VARIATION CONTENT BODY */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* ========================================================================= */}
        {/* 1. CIRCULAYO TEAMS VIEW */}
        {/* Merged All & Location + Client Filter (No low stock) */}
        {variation === 'circulayo-teams' && (() => {
          const currentClientObj = CLIENT_ACCOUNTS.find((c) => c.id === ctClient) || CLIENT_ACCOUNTS[0];
          const availableLocations = currentClientObj.locations;
          const isAllLocations = ctLocation === 'all';
          const currentLocationObj = isAllLocations ? null : (availableLocations.find((l) => l.id === ctLocation) || availableLocations[0]);

          // Compute filtered products (no low stock or status filtering)
          const clientProducts = SAMPLE_PRODUCTS_CATALOG.filter((p) => {
            if (p.clientId !== currentClientObj.id) return false;
            if (!isAllLocations && p.locationId !== currentLocationObj?.id) return false;
            if (ctSearchQuery) {
              const q = ctSearchQuery.toLowerCase();
              return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
            }
            return true;
          });

          const totalStockCount = isAllLocations
            ? availableLocations.reduce((sum, l) => sum + l.totalItems, 0)
            : (currentLocationObj?.totalItems || 0);

          return (
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3.5">

              {/* Title & Role Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Stock Check
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {(ctClient !== 'delaware-north' || ctLocation !== 'all' || ctSearchQuery) && (
                    <button
                      onClick={() => {
                        setCtClient('delaware-north');
                        setCtLocation('all');
                        setCtSearchQuery('');
                        closeAllPopovers();
                      }}
                      className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => {
                      closeAllPopovers();
                      setIsFilterSheetOpen(true);
                    }}
                    className="w-9 h-9 rounded-full bg-[#e7eee9] hover:bg-[#d8e6df] active:scale-95 transition-all text-[#164e3f] cursor-pointer flex items-center justify-center shadow-xs"
                    title="Filters"
                    aria-label="Filters"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#164e3f"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3.5 2 3.5 10 12.5 10 20.5 14 20.5 14 12.5 22 3.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* CAPSULE CONTROLS: Side by Side (Client Selector + Merged Location & All) */}
              {/* ========================================================================= */}
              <div className="flex items-center gap-2 relative">
                {/* Capsule 1: Client Selector */}
                <div className="relative flex-1 min-w-0">
                  <div
                    onClick={() => {
                      const next = !isCtClientOpen;
                      closeAllPopovers();
                      setIsCtClientOpen(next);
                    }}
                    className="h-11 px-3 sm:px-4 rounded-full bg-white border border-[#c4dcce] flex items-center justify-between gap-1.5 sm:gap-2 shadow-xs cursor-pointer hover:border-emerald-600 transition-all"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CustomerLogo clientId={currentClientObj.id} size={22} />
                      <span className="text-[13px] sm:text-[14px] font-bold text-[#244e3f] truncate">
                        {currentClientObj.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCtClient('delaware-north');
                        setCtLocation('all');
                        closeAllPopovers();
                      }}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#164e3f] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer shrink-0"
                      title="Reset Client"
                    >
                      <Icon name="X" size={15} strokeWidth={2.4} />
                    </button>
                  </div>

                  {/* Client Picker Dropdown Popover */}
                  {isCtClientOpen && (
                    <div className="absolute top-[48px] left-0 w-[285px] sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-1 py-1 mb-1.5 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Client
                        </span>
                        <button
                          onClick={() => {
                            setIsCtClientOpen(false);
                            setCtSearchQuery('');
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      {/* Integrated Client Search Bar */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f7f6] rounded-xl border border-slate-200/80 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
                          <Icon name="Search" size={14} className="text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={ctSearchQuery}
                            onChange={(e) => setCtSearchQuery(e.target.value)}
                            placeholder="Search clients..."
                            className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
                            autoFocus
                          />
                          {ctSearchQuery && (
                            <button
                              onClick={() => setCtSearchQuery('')}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Icon name="X" size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Clients List */}
                      <div className="max-h-56 overflow-y-auto space-y-1 no-scrollbar">
                        {CLIENT_ACCOUNTS.filter((c) =>
                          c.name.toLowerCase().includes(ctSearchQuery.toLowerCase()) ||
                          c.shortName.toLowerCase().includes(ctSearchQuery.toLowerCase())
                        ).map((c) => {
                          const isSelected = ctClient === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                setCtClient(c.id);
                                setCtLocation('all');
                                setIsCtClientOpen(false);
                                setCtSearchQuery('');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#e7eee9] text-[#164e3f] font-bold shadow-xs'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <CustomerLogo clientId={c.id} size={20} />
                                <span className="text-xs">{c.name}</span>
                              </div>
                              <span className={`text-[10px] ${isSelected ? 'text-[#164e3f] font-bold' : 'text-slate-400 font-medium'}`}>
                                {c.locations.length} locations
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Capsule 2: Location Selector */}
                <div className="relative flex-1 min-w-0">
                  <div
                    onClick={() => {
                      const next = !isCtLocationOpen;
                      closeAllPopovers();
                      setIsCtLocationOpen(next);
                    }}
                    className="h-11 px-3 sm:px-4 rounded-full bg-white border border-[#c4dcce] flex items-center justify-between gap-1.5 sm:gap-2 shadow-xs cursor-pointer hover:border-emerald-600 transition-all"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#164e3f] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 tracking-tight shadow-xs">
                        {getLocationInitials(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))}
                      </div>
                      <span className="text-[13px] sm:text-[14px] font-bold text-[#244e3f] truncate">
                        {isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1')}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteLocation(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'));
                        }}
                        className="p-0.5 hover:scale-115 active:scale-95 transition-transform shrink-0 cursor-pointer"
                        title={
                          favoriteLocations.includes(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))
                            ? 'Remove from favourites'
                            : 'Add to favourites'
                        }
                      >
                        <Icon
                          name="Star"
                          size={13}
                          className={
                            favoriteLocations.includes(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 hover:text-amber-400'
                          }
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                    {!isAllLocations ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCtLocation('all');
                          closeAllPopovers();
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#164e3f] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer shrink-0"
                        title="Reset to All Locations"
                      >
                        <Icon name="X" size={15} strokeWidth={2.4} />
                      </button>
                    ) : (
                      <Icon
                        name={isCtLocationOpen ? 'ChevronUp' : 'ChevronDown'}
                        size={15}
                        strokeWidth={2.6}
                        className="text-[#164e3f] shrink-0"
                      />
                    )}
                  </div>

                  {/* Location Picker Dropdown Popover */}
                  {isCtLocationOpen && (
                    <div className="absolute top-[48px] right-0 w-[285px] sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-1 py-1 mb-1.5 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Venue
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsCtOnlyFavorites(!isCtOnlyFavorites)}
                            className={`p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                              isCtOnlyFavorites
                                ? 'bg-amber-50 text-amber-500 ring-1 ring-amber-300'
                                : 'text-slate-400 hover:text-amber-500'
                            }`}
                            title={isCtOnlyFavorites ? 'Showing favorites only (tap to show all)' : 'Filter favorites only'}
                          >
                            <Icon
                              name="Star"
                              size={14}
                              className={isCtOnlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}
                              strokeWidth={2}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setIsCtLocationOpen(false);
                              setCtSearchQuery('');
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Integrated Venue Search Bar */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f7f6] rounded-xl border border-emerald-600 bg-white ring-2 ring-emerald-600/10 transition-all">
                          <Icon name="Search" size={14} className="text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={ctSearchQuery}
                            onChange={(e) => setCtSearchQuery(e.target.value)}
                            placeholder="Search venues..."
                            className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
                            autoFocus
                          />
                          {ctSearchQuery && (
                            <button
                              onClick={() => setCtSearchQuery('')}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Icon name="X" size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Venue Options */}
                      <div className="max-h-56 overflow-y-auto space-y-1 no-scrollbar">
                        {/* Option 1: All Locations (only if not filtering favorites OR All Locations is favorited) */}
                        {(!isCtOnlyFavorites || favoriteLocations.includes('All Locations')) &&
                          ('all locations'.includes(ctSearchQuery.toLowerCase()) || !ctSearchQuery) && (
                          <button
                            onClick={() => {
                              setCtLocation('all');
                              setIsCtLocationOpen(false);
                              setCtSearchQuery('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                              isAllLocations
                                ? 'bg-[#e7eee9] text-[#164e3f] font-bold shadow-xs'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 tracking-tight transition-all ${
                                  isAllLocations
                                    ? 'bg-[#164e3f] text-white shadow-xs'
                                    : 'bg-[#d8e6df] text-[#164e3f]'
                                }`}
                              >
                                AL
                              </div>
                              <span className="text-xs">All Locations</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavoriteLocation('All Locations');
                                }}
                                className="p-0.5 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                                title={favoriteLocations.includes('All Locations') ? 'Remove from favourites' : 'Add to favourites'}
                              >
                                <Icon
                                  name="Star"
                                  size={12}
                                  className={
                                    favoriteLocations.includes('All Locations')
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300 hover:text-amber-400'
                                  }
                                  strokeWidth={2}
                                />
                              </button>
                            </div>
                            <span className={`text-[10px] ${isAllLocations ? 'text-[#164e3f] font-bold' : 'text-slate-400 font-medium'}`}>
                              {availableLocations.reduce((sum, l) => sum + l.totalItems, 0)} items
                            </span>
                          </button>
                        )}

                        {/* Specific Locations */}
                        {availableLocations
                          .filter((v) => {
                            const matchesSearch =
                              v.name.toLowerCase().includes(ctSearchQuery.toLowerCase()) ||
                              v.shortName.toLowerCase().includes(ctSearchQuery.toLowerCase());
                            const matchesFav = !isCtOnlyFavorites || favoriteLocations.includes(v.name);
                            return matchesSearch && matchesFav;
                          })
                          .map((v) => {
                            const isSelected = ctLocation === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => {
                                  setCtLocation(v.id);
                                  setIsCtLocationOpen(false);
                                  setCtSearchQuery('');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#e7eee9] text-[#164e3f] font-bold shadow-xs'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 tracking-tight transition-all ${
                                      isSelected
                                        ? 'bg-[#164e3f] text-white shadow-xs'
                                        : 'bg-[#d8e6df] text-[#164e3f]'
                                    }`}
                                  >
                                    {getLocationInitials(v.name)}
                                  </div>
                                  <span className="text-xs">{v.name}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavoriteLocation(v.name);
                                    }}
                                    className="p-0.5 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                                    title={favoriteLocations.includes(v.name) ? 'Remove from favourites' : 'Add to favourites'}
                                  >
                                    <Icon
                                      name="Star"
                                      size={12}
                                      className={
                                        favoriteLocations.includes(v.name)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-300 hover:text-amber-400'
                                      }
                                      strokeWidth={2}
                                    />
                                  </button>
                                </div>
                                <span className={`text-[10px] ${isSelected ? 'text-[#164e3f] font-bold' : 'text-slate-400 font-medium'}`}>
                                  {v.categories} {v.categories === 1 ? 'category' : 'categories'} • {v.totalItems} items
                                </span>
                              </button>
                            );
                          })}

                        {/* Empty State when no favorites match */}
                        {((!(!isCtOnlyFavorites || favoriteLocations.includes('All Locations')) || (!('all locations'.includes(ctSearchQuery.toLowerCase()) || !ctSearchQuery))) &&
                          availableLocations.filter((v) => {
                            const matchesSearch =
                              v.name.toLowerCase().includes(ctSearchQuery.toLowerCase()) ||
                              v.shortName.toLowerCase().includes(ctSearchQuery.toLowerCase());
                            const matchesFav = !isCtOnlyFavorites || favoriteLocations.includes(v.name);
                            return matchesSearch && matchesFav;
                          }).length === 0) && (
                          <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5">
                            <Icon name="Star" size={18} className="text-slate-300" />
                            <span>{isCtOnlyFavorites ? 'No favorite venues found' : 'No venues match search'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#a3c9bd] block">
                      Total Items
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block leading-none">
                      {totalStockCount}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3c9bd]">
                    <Icon name="Archive" size={18} strokeWidth={2.2} />
                  </div>
                </div>

                <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#a3c9bd] block">
                      Categories
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block leading-none">
                      {isAllLocations ? 4 : (currentLocationObj?.categories || 1)}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3c9bd]">
                    <Icon name="LayoutGrid" size={18} strokeWidth={2.2} />
                  </div>
                </div>
              </div>

              {/* Feed Subtitle */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span>
                    {isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1')}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavoriteLocation(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))
                    }
                    className="hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                    title={
                      favoriteLocations.includes(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))
                        ? 'Remove from favourites'
                        : 'Add to favourites'
                    }
                  >
                    <Icon
                      name="Star"
                      size={13}
                      className={
                        favoriteLocations.includes(isAllLocations ? 'All Locations' : (currentLocationObj?.name || 'Location 1'))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 hover:text-amber-400'
                      }
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>

              {/* Cards Grid (2 columns + full-width 5th card) */}
              <div className="grid grid-cols-2 gap-3">
                {clientProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs"
                  >
                    <div
                      className={`absolute top-0 w-11 h-11 flex items-center justify-center text-white shadow-xs ${
                        p.badgePosition === 'top-left'
                          ? 'left-0 rounded-tl-2xl rounded-br-2xl'
                          : 'right-0 rounded-tr-2xl rounded-bl-2xl'
                      }`}
                      style={{ backgroundColor: p.badgeColor }}
                    >
                      <Icon name={p.icon} size={20} strokeWidth={2.2} />
                    </div>

                    <div className={p.badgePosition === 'top-left' ? 'pl-10' : 'pr-10'}>
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    <div className={p.badgePosition === 'top-left' ? 'self-end' : 'self-start'}>
                      <span className={`text-2xl font-extrabold leading-none ${p.status === 'Low Stock' && p.count === 0 ? 'text-amber-800' : 'text-slate-900'}`}>
                        {p.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5th Card: Full-width Pint GG */}
              {clientProducts.length >= 5 && (
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                  <div
                    className="absolute top-0 left-0 w-11 h-11 rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: clientProducts[4].badgeColor }}
                  >
                    <Icon name={clientProducts[4].icon} size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                      {clientProducts[4].title}
                    </h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      {clientProducts[4].count}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 2. CLIENTS VIEW (Customer View) */}
        {/* Merged All & Location into ONE unified dropdown (No low stock) */}
        {variation === 'clients-view' && (() => {
          const customerAreas = [
            { name: 'All Locations', count: '150 items' },
            { name: 'Location 1', count: '4 categories • 385 items' },
            { name: 'Location 2', count: '1 category • 9 items' },
            { name: 'Location 3', count: '1 category • 42 items' },
            { name: 'Location 4', count: '1 category • 18 items' },
            { name: 'Location 5', count: '1 category • 12 items' },
          ];

          const isAll = clientLocation === 'All Locations';

          const customerProducts = SAMPLE_PRODUCTS_CATALOG.filter((p) => {
            if (!isAll && clientLocation !== 'Location 1' && p.locationId !== 'loc-1') return false;
            if (clientSearchQuery) {
              const q = clientSearchQuery.toLowerCase();
              return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
            }
            return true;
          });

          const totalStockCount = isAll
            ? 150
            : clientLocation === 'Location 2'
            ? 9
            : clientLocation === 'Location 3'
            ? 42
            : clientLocation === 'Location 4'
            ? 18
            : clientLocation === 'Location 5'
            ? 12
            : 385;

          return (
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3.5">

              {/* Customer Header Row */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Stock Check
                  </h2>
                </div>
                <button
                  onClick={() => {
                    closeAllPopovers();
                    setIsFilterSheetOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-[#e7eee9] hover:bg-[#d8e6df] active:scale-95 transition-all text-[#164e3f] cursor-pointer flex items-center justify-center shadow-xs"
                  title="Filters"
                  aria-label="Filters"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#164e3f"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3.5 2 3.5 10 12.5 10 20.5 14 20.5 14 12.5 22 3.5" />
                  </svg>
                </button>
              </div>

              {/* ========================================================================= */}
              {/* MERGED ALL & LOCATION CAPSULE (1:1 UNIFIED DROPDOWN) */}
              {/* [ 📍 Location 1 ✕ ] or [ 📍 All Locations ▾ ] */}
              {/* ========================================================================= */}
              <div className="relative">
                <div
                  onClick={() => {
                    const next = !isClientLocationOpen;
                    closeAllPopovers();
                    setIsClientLocationOpen(next);
                  }}
                  className="h-11 px-4 rounded-full bg-white border border-[#c4dcce] flex items-center justify-between gap-2 shadow-xs cursor-pointer hover:border-emerald-600 transition-all"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-6 h-6 rounded-full bg-[#164e3f] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 tracking-tight shadow-xs">
                      {getLocationInitials(clientLocation || 'All Locations')}
                    </div>
                    <span className="text-[14px] font-bold text-[#244e3f] truncate">
                      {clientLocation || 'All Locations'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteLocation(clientLocation || 'All Locations');
                      }}
                      className="p-0.5 hover:scale-115 active:scale-95 transition-transform shrink-0 cursor-pointer"
                      title={
                        favoriteLocations.includes(clientLocation || 'All Locations')
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                    >
                      <Icon
                        name="Star"
                        size={13}
                        className={
                          favoriteLocations.includes(clientLocation || 'All Locations')
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 hover:text-amber-400'
                        }
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                  {!isAll ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientLocation('All Locations');
                        closeAllPopovers();
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#164e3f] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer shrink-0"
                      title="Reset to All Locations"
                    >
                      <Icon name="X" size={17} strokeWidth={2.4} />
                    </button>
                  ) : (
                    <Icon
                      name={isClientLocationOpen ? 'ChevronUp' : 'ChevronDown'}
                      size={16}
                      strokeWidth={2.6}
                      className="text-[#164e3f] shrink-0"
                    />
                  )}
                </div>

                {/* Location Picker Dropdown (EXACT SCREENSHOT MATCH) */}
                {isClientLocationOpen && (
                  <div className="absolute top-[48px] left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-1 py-1 mb-1.5 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Venue
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsClientOnlyFavorites(!isClientOnlyFavorites)}
                          className={`p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                            isClientOnlyFavorites
                              ? 'bg-amber-50 text-amber-500 ring-1 ring-amber-300'
                              : 'text-slate-400 hover:text-amber-500'
                          }`}
                          title={isClientOnlyFavorites ? 'Showing favorites only (tap to show all)' : 'Filter favorites only'}
                        >
                          <Icon
                            name="Star"
                            size={14}
                            className={isClientOnlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}
                            strokeWidth={2}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setIsClientLocationOpen(false);
                            setClientSearchQuery('');
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    {/* Integrated Venue Search Bar with emerald border ring */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f7f6] rounded-xl border border-emerald-600 bg-white ring-2 ring-emerald-600/10 transition-all">
                        <Icon name="Search" size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={clientSearchQuery}
                          onChange={(e) => setClientSearchQuery(e.target.value)}
                          placeholder="Search venues..."
                          className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
                          autoFocus
                        />
                        {clientSearchQuery && (
                          <button
                            onClick={() => setClientSearchQuery('')}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Icon name="X" size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Venue Options */}
                    <div className="max-h-56 overflow-y-auto space-y-1 no-scrollbar">
                      {customerAreas
                        .filter((v) => {
                          const matchesSearch = v.name.toLowerCase().includes(clientSearchQuery.toLowerCase());
                          const matchesFav = !isClientOnlyFavorites || favoriteLocations.includes(v.name);
                          return matchesSearch && matchesFav;
                        })
                        .map((v) => {
                          const isSelected = clientLocation === v.name;
                          return (
                            <button
                              key={v.name}
                              onClick={() => {
                                setClientLocation(v.name);
                                setIsClientLocationOpen(false);
                                setClientSearchQuery('');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#e7eee9] text-[#164e3f] font-bold shadow-xs'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 tracking-tight transition-all ${
                                    isSelected
                                      ? 'bg-[#164e3f] text-white shadow-xs'
                                      : 'bg-[#d8e6df] text-[#164e3f]'
                                  }`}
                                >
                                  {getLocationInitials(v.name)}
                                </div>
                                <span className="text-xs">{v.name}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavoriteLocation(v.name);
                                  }}
                                  className="p-0.5 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                                  title={favoriteLocations.includes(v.name) ? 'Remove from favourites' : 'Add to favourites'}
                                >
                                  <Icon
                                    name="Star"
                                    size={12}
                                    className={
                                      favoriteLocations.includes(v.name)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300 hover:text-amber-400'
                                    }
                                    strokeWidth={2}
                                  />
                                </button>
                              </div>
                              <span className={`text-[10px] ${isSelected ? 'text-[#164e3f] font-bold' : 'text-slate-400 font-medium'}`}>
                                {v.count}
                              </span>
                            </button>
                          );
                        })}

                      {/* Empty State */}
                      {customerAreas.filter((v) => {
                        const matchesSearch = v.name.toLowerCase().includes(clientSearchQuery.toLowerCase());
                        const matchesFav = !isClientOnlyFavorites || favoriteLocations.includes(v.name);
                        return matchesSearch && matchesFav;
                      }).length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1.5">
                          <Icon name="Star" size={18} className="text-slate-300" />
                          <span>{isClientOnlyFavorites ? 'No favorite venues found' : 'No venues match search'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#a3c9bd] block">
                      Total Items
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block leading-none">
                      {totalStockCount}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3c9bd]">
                    <Icon name="Archive" size={18} strokeWidth={2.2} />
                  </div>
                </div>

                <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#a3c9bd] block">
                      Categories
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block leading-none">
                      {isAll ? 4 : (clientLocation === 'Location 1' ? 4 : 1)}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3c9bd]">
                    <Icon name="LayoutGrid" size={18} strokeWidth={2.2} />
                  </div>
                </div>
              </div>

              {/* Feed Subtitle */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span>
                    {clientLocation || 'All Locations'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavoriteLocation(clientLocation || 'All Locations')
                    }
                    className="hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                    title={
                      favoriteLocations.includes(clientLocation || 'All Locations')
                        ? 'Remove from favourites'
                        : 'Add to favourites'
                    }
                  >
                    <Icon
                      name="Star"
                      size={13}
                      className={
                        favoriteLocations.includes(clientLocation || 'All Locations')
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 hover:text-amber-400'
                      }
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>

              {/* Cards Grid (2 columns + full-width 5th card) */}
              <div className="grid grid-cols-2 gap-3">
                {customerProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs"
                  >
                    <div
                      className={`absolute top-0 w-11 h-11 flex items-center justify-center text-white shadow-xs ${
                        p.badgePosition === 'top-left'
                          ? 'left-0 rounded-tl-2xl rounded-br-2xl'
                          : 'right-0 rounded-tr-2xl rounded-bl-2xl'
                      }`}
                      style={{ backgroundColor: p.badgeColor }}
                    >
                      <Icon name={p.icon} size={20} strokeWidth={2.2} />
                    </div>

                    <div className={p.badgePosition === 'top-left' ? 'pl-10' : 'pr-10'}>
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    <div className={p.badgePosition === 'top-left' ? 'self-end' : 'self-start'}>
                      <span className={`text-2xl font-extrabold leading-none ${p.status === 'Low Stock' && p.count === 0 ? 'text-amber-800' : 'text-slate-900'}`}>
                        {p.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5th Card: Full-width Pint GG */}
              {customerProducts.length >= 5 && (
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                  <div
                    className="absolute top-0 left-0 w-11 h-11 rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: customerProducts[4].badgeColor }}
                  >
                    <Icon name={customerProducts[4].icon} size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                      {customerProducts[4].title}
                    </h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      {customerProducts[4].count}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

                {/* VARIATION 1: EXACT FIGMA 526:8085 (Stat cards + 5 Item Cards) */}
        {variation === 'figma-exact' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
            {/* Title Header: Stock Check + Filter Icon */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Stock Check
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                title="Filter"
              >
                <Icon name="SlidersHorizontal" size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
              {[
                'All',
                'Available Stock',
                'Derby County FC',
                'Notts County',
                'Pavestone Ralley',
              ].map((chip) => {
                const isActive = activeStatusFilter === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveStatusFilter(chip)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#1a5140] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Stat Summary Cards (2 Columns in Dark Forest Green) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Total Items
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    150
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Warehouse" size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Categories
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    6
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Boxes" size={20} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* 5 Item Cards Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1 */}
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="Box" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                      Flute Glasses
                    </h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      65
                    </span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="Coffee" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pr-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                      Flute Glasses
                    </h3>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      233
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Card 3 */}
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="Wine" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                      Flute Glasses
                    </h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      9
                    </span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="GlassWater" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pr-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                      Flute Glasses
                    </h3>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      78
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5: Full Width Pint GG */}
              <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                  <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                </div>
                <div className="pl-10">
                  <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                    Pint GG
                  </h3>
                </div>
                <div className="self-end">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">
                    9
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VARIATION 2: DUAL FILTER & STATUS + METRIC SUBTITLE (User Image 2) */}
        {variation === 'dual-filter' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3.5">
            {/* Title Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Stock Check
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                title="Filter"
              >
                <Icon name="Filter" size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Row 1: Stock Status Pills (Capsule segmented bar) */}
            <div className="bg-[#e4ece7] p-1 rounded-2xl flex items-center justify-between">
              {['All', 'Available', 'Low stock'].map((tab) => {
                const isActive = activeStatusFilter === tab || (activeStatusFilter === 'All' && tab === 'All');
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveStatusFilter(tab)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-[#1a5140] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Row 2: Venues Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {['All venues', 'Derby County FC', 'Notts County', 'Venue 4'].map((v) => {
                const isActive = activeVenueFilter === v;
                return (
                  <button
                    key={v}
                    onClick={() => setActiveVenueFilter(v)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#1a5140] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>

            {/* Subtitle counter line */}
            <div className="text-xs font-medium text-slate-500 pt-0.5">
              150 items • 6 categories
            </div>

            {/* 2x2 Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1 */}
              <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                  <Icon name="Wine" size={20} strokeWidth={2.2} />
                </div>
                <div className="pl-10">
                  <h3 className="text-[13px] font-bold text-slate-900">Flute Glasses</h3>
                </div>
                <div className="self-end">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                  <Icon name="Wine" size={20} strokeWidth={2.2} />
                </div>
                <div className="pr-10">
                  <h3 className="text-[13px] font-bold text-slate-900">Flute Glasses</h3>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                  <Icon name="Wine" size={20} strokeWidth={2.2} />
                </div>
                <div className="pl-10">
                  <h3 className="text-[13px] font-bold text-slate-900">Flute Glasses</h3>
                </div>
                <div className="self-end">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                  <Icon name="Wine" size={20} strokeWidth={2.2} />
                </div>
                <div className="pr-10">
                  <h3 className="text-[13px] font-bold text-slate-900">Flute Glasses</h3>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VARIATION 3: ACCORDION COLLAPSIBLE VENUE HIERARCHY (User Image 3) */}
        {variation === 'accordion-venues' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
            {/* Title Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Stock Check
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                title="Filter"
              >
                <Icon name="Filter" size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-2xl text-xs font-semibold bg-[#1a5140] text-white shadow-xs cursor-pointer">
                All
              </button>
              <button className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-[#e4ece7] text-slate-700 hover:bg-[#d8e4dc] transition-colors cursor-pointer">
                Available Stock
              </button>
            </div>

            {/* Accordion Group 1: Derby County FC (Expanded) */}
            <div className="space-y-3">
              <button
                onClick={() => toggleVenueAccordion('Derby County FC')}
                className="w-full flex items-center justify-between py-1 cursor-pointer group text-left"
              >
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-bold text-slate-900">Derby County FC</h3>
                  <span className="text-xs text-slate-500 font-medium">4 categories</span>
                </div>
                <Icon
                  name={expandedVenues['Derby County FC'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-600 transition-transform"
                />
              </button>

              {expandedVenues['Derby County FC'] && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                    </div>
                  </div>

                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                    </div>
                  </div>

                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                    </div>
                  </div>

                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Group 2: Notts County */}
            <div className="border-t border-slate-200/80 pt-3">
              <button
                onClick={() => toggleVenueAccordion('Notts County')}
                className="w-full flex items-center justify-between py-1 cursor-pointer text-left"
              >
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-bold text-slate-900">Notts County</h3>
                  <span className="text-xs text-slate-500 font-medium">1 category</span>
                </div>
                <Icon
                  name={expandedVenues['Notts County'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-600 transition-transform"
                />
              </button>

              {expandedVenues['Notts County'] && (
                <div className="pt-2">
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h4 className="text-[14px] font-bold text-slate-900">Pint GG</h4>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Group 3: Venue 4 */}
            <div className="border-t border-slate-200/80 pt-3">
              <button
                onClick={() => toggleVenueAccordion('Venue 4')}
                className="w-full flex items-center justify-between py-1 cursor-pointer text-left"
              >
                <h3 className="text-base font-bold text-slate-900">Venue 4</h3>
                <Icon
                  name={expandedVenues['Venue 4'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-600 transition-transform"
                />
              </button>
            </div>

            {/* Accordion Group 4: Venue 5 */}
            <div className="border-t border-slate-200/80 pt-3">
              <button
                onClick={() => toggleVenueAccordion('Venue 5')}
                className="w-full flex items-center justify-between py-1 cursor-pointer text-left"
              >
                <h3 className="text-base font-bold text-slate-900">Venue 5</h3>
                <Icon
                  name={expandedVenues['Venue 5'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-600 transition-transform"
                />
              </button>
            </div>
          </div>
        )}

        {/* VARIATION 4: VERTICAL LEFT RAIL NAVIGATION (Simplified Clean UX) */}
        {variation === 'left-rail' && (
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Rail Sidebar: Circular Chips + Close Button */}
            {isLeftRailOpen && (
              <aside className="w-16 bg-[#e7eee9] border-r border-slate-200/80 flex flex-col items-center py-3 gap-3 shrink-0 overflow-y-auto no-scrollbar transition-all duration-200">
                {/* Minimal Close Button */}
                <button
                  onClick={() => setIsLeftRailOpen(false)}
                  className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all border border-slate-200/80 mb-0.5"
                  title="Close Locations"
                >
                  <Icon name="ChevronLeft" size={15} />
                </button>

                {[
                  { id: 'All', label: 'All', sub: 'All' },
                  { id: 'DC', label: 'DC', sub: 'Derby' },
                  { id: 'NC', label: 'NC', sub: 'Notts' },
                  { id: 'V4', label: 'V4', sub: 'Venue 4' },
                  { id: 'V5', label: 'V5', sub: 'Venue 5' },
                ].map((item) => {
                  const isActive = activeLeftRailVenue === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveLeftRailVenue(item.id)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                          isActive
                            ? 'bg-[#1a5140] text-white ring-2 ring-emerald-600/30'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60'
                        }`}
                      >
                        {item.label}
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </aside>
            )}

            {/* Right Main Content: Clean Header + Filter Pills + Stacked Cards */}
            <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3.5 bg-[#f4f7f6]">
              {/* Clean Header Row: Title on Left, Location Pill + Filter on Right */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Stock Check
                </h2>

                <div className="flex items-center gap-2">
                  {/* Location Selector Pill */}
                  <button
                    onClick={() => setIsLeftRailOpen(!isLeftRailOpen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                      isLeftRailOpen
                        ? 'bg-[#1a5140] text-white border-[#1a5140]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Toggle Locations Panel"
                  >
                    <Icon
                      name="MapPin"
                      size={13}
                      className={isLeftRailOpen ? 'text-emerald-200' : 'text-emerald-700'}
                    />
                    <span>
                      {activeLeftRailVenue === 'DC'
                        ? 'Derby FC'
                        : activeLeftRailVenue === 'NC'
                        ? 'Notts'
                        : activeLeftRailVenue === 'V4'
                        ? 'Venue 4'
                        : activeLeftRailVenue === 'V5'
                        ? 'Venue 5'
                        : 'All Venues'}
                    </span>
                    <Icon name={isLeftRailOpen ? 'ChevronLeft' : 'ChevronRight'} size={14} />
                  </button>

                  {/* Filter Icon */}
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                    title="Filter"
                  >
                    <Icon name="Filter" size={17} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              {/* Clean Filter Pills (All / Available / Low Stock with embedded counts) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'all', label: 'All', count: 4 },
                  { id: 'available', label: 'Available', count: 3 },
                  { id: 'low-stock', label: 'Low stock', count: 1 },
                ].map((chip) => {
                  const isActive = leftRailStockFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setLeftRailStockFilter(chip.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#1a5140] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <span>{chip.label}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {chip.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Full-width single-column stacked cards (dynamically filtered by stock status) */}
              <div className="space-y-3">
                {/* Item 1: Flute Glasses (65) - Available */}
                {(leftRailStockFilter === 'all' || leftRailStockFilter === 'available') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13.5px] font-bold text-slate-900">Flute Glasses</h3>
                    </div>
                    <div className="self-end pr-1">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                    </div>
                  </div>
                )}

                {/* Item 2: Flute Glasses (233) - Available */}
                {(leftRailStockFilter === 'all' || leftRailStockFilter === 'available') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#1e878e] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13.5px] font-bold text-slate-900">Flute Glasses</h3>
                    </div>
                    <div className="self-end pr-1">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                    </div>
                  </div>
                )}

                {/* Item 3: Flute Glasses (9) - Low Stock */}
                {(leftRailStockFilter === 'all' || leftRailStockFilter === 'low-stock') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10 flex items-center justify-between pr-2">
                      <h3 className="text-[13.5px] font-bold text-slate-900">Flute Glasses</h3>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        ● Low Stock
                      </span>
                    </div>
                    <div className="self-end pr-1">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                    </div>
                  </div>
                )}

                {/* Item 4: Flute Glasses (78) - Available */}
                {(leftRailStockFilter === 'all' || leftRailStockFilter === 'available') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#1d7566] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13.5px] font-bold text-slate-900">Flute Glasses</h3>
                    </div>
                    <div className="self-end pr-1">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* VARIATION 5: HORIZONTAL SWIPE CAROUSEL PER VENUE (User Image 5) */}
        {variation === 'swipe-carousel' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">
            {/* Title Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Stock Check
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                title="Filter"
              >
                <Icon name="Filter" size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button className="px-4 py-1.5 rounded-2xl text-xs font-semibold bg-[#1a5140] text-white shadow-xs cursor-pointer">
                All
              </button>
              <button className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-[#e4ece7] text-slate-700 hover:bg-[#d8e4dc] transition-colors cursor-pointer">
                Available Stock
              </button>
              <button className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                Low stock
              </button>
            </div>

            {/* Venue 1 Horizontal Row (Collapsible) */}
            <div className="space-y-2">
              <button
                onClick={() => toggleCarouselVenue('Derby County FC')}
                className="w-full flex items-center justify-between cursor-pointer py-1 text-left group"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Derby County FC
                  </h3>
                  {expandedCarouselVenues['Derby County FC'] && (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-0.5">
                      swipe <Icon name="ArrowRight" size={12} />
                    </span>
                  )}
                </div>
                <Icon
                  name={expandedCarouselVenues['Derby County FC'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-500 group-hover:text-slate-800 transition-transform"
                />
              </button>

              {expandedCarouselVenues['Derby County FC'] && (
                <div className="space-y-2">
                  {/* Horizontal Scroll Cards Track */}
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                    {/* Card 1 */}
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pr-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#1d7566] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Flute Glasses</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle swipe scroll indicator bar */}
                  <div className="w-16 h-1 bg-slate-300/80 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Venue 2 Horizontal Row (Collapsible) */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <button
                onClick={() => toggleCarouselVenue('Notts County')}
                className="w-full flex items-center justify-between cursor-pointer py-1 text-left group"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Notts County
                  </h3>
                  {expandedCarouselVenues['Notts County'] && (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-0.5">
                      swipe <Icon name="ArrowRight" size={12} />
                    </span>
                  )}
                </div>
                <Icon
                  name={expandedCarouselVenues['Notts County'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-500 group-hover:text-slate-800 transition-transform"
                />
              </button>

              {expandedCarouselVenues['Notts County'] && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Pint GG</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-1 bg-slate-300/80 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Venue 3 Row (Collapsible) */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <button
                onClick={() => toggleCarouselVenue('Venue 4')}
                className="w-full flex items-center justify-between cursor-pointer py-1 text-left group"
              >
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Venue 4
                </h3>
                <Icon
                  name={expandedCarouselVenues['Venue 4'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-500 group-hover:text-slate-800 transition-transform"
                />
              </button>

              {expandedCarouselVenues['Venue 4'] && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#1e878e] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Wine Glass</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">42</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-1 bg-slate-300/80 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Venue 4 Row (Collapsible) */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <button
                onClick={() => toggleCarouselVenue('Venue 5')}
                className="w-full flex items-center justify-between cursor-pointer py-1 text-left group"
              >
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Venue 5
                </h3>
                <Icon
                  name={expandedCarouselVenues['Venue 5'] ? 'ChevronUp' : 'ChevronDown'}
                  size={19}
                  className="text-slate-500 group-hover:text-slate-800 transition-transform"
                />
              </button>

              {expandedCarouselVenues['Venue 5'] && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                    <div className="relative bg-[#e1eae6] rounded-2xl w-[156px] h-[106px] shrink-0 overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h4 className="text-[13px] font-bold text-slate-900">Tumbler</h4>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">18</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-1 bg-slate-300/80 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VARIATION 6: CAPSULE DROPDOWN & LOCATION SEARCH (User Image 6) */}
        {variation === 'capsule-search' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3.5">
            {/* Title Header (No filter icon beside header) */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Stock Check
              </h2>
            </div>

            {/* Exact Capsule Controls: [ All ▾ ] and [ Location ✕ ] */}
            <div className="flex items-center gap-2.5 relative">
              {/* Capsule 1: Dark Green Capsule "All ▾" */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCapsuleDropdownOpen(!isCapsuleDropdownOpen);
                    setIsLocationDropdownOpen(false);
                  }}
                  className="h-11 px-5 rounded-full bg-[#164e3f] hover:bg-[#124034] text-white font-bold text-[14px] flex items-center gap-3.5 shadow-xs cursor-pointer active:scale-97 transition-all shrink-0"
                >
                  <span>{capsuleStatusFilter}</span>
                  <Icon
                    name={isCapsuleDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    strokeWidth={2.6}
                    className="text-white"
                  />
                </button>

                {/* Status Dropdown Popover */}
                {isCapsuleDropdownOpen && (
                  <div className="absolute top-[48px] left-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { id: 'All', label: 'All Items' },
                      { id: 'Available', label: 'Available Stock' },
                      { id: 'Low Stock', label: 'Low Stock' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setCapsuleStatusFilter(opt.id as any);
                          setIsCapsuleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          capsuleStatusFilter === opt.id
                            ? 'bg-[#e7eee9] text-[#164e3f] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {capsuleStatusFilter === opt.id && (
                          <Icon name="Check" size={14} className="text-[#164e3f]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Capsule 2: Light Mint/White Pill with "Location" text and Search icon */}
              <div className="relative flex-1 min-w-0">
                <div
                  className="h-11 px-4 rounded-full bg-white border border-[#c4dcce] flex items-center justify-between gap-2 shadow-xs cursor-text focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
                  onClick={() => {
                    setIsLocationDropdownOpen(true);
                    setIsCapsuleDropdownOpen(false);
                  }}
                >
                  <input
                    type="text"
                    value={capsuleLocationSearch}
                    onChange={(e) => setCapsuleLocationSearch(e.target.value)}
                    placeholder={capsuleSelectedVenue || 'Location'}
                    className="w-full bg-transparent text-[14px] font-bold text-[#244e3f] placeholder-[#244e3f] outline-none"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCapsuleLocationSearch('');
                        setCapsuleSelectedVenue('');
                        setIsLocationDropdownOpen(false);
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#164e3f] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
                      title="Clear Location"
                    >
                      <Icon name="X" size={17} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>

                {/* Location Picker Dropdown */}
                {isLocationDropdownOpen && (
                  <div className="absolute top-[48px] left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-1 py-1 mb-1.5 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Venue
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLocationDropdownOpen(false);
                          setVenueSearchQuery('');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    {/* Integrated Venue Search Bar */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f7f6] rounded-xl border border-slate-200/80 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
                        <Icon name="Search" size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={venueSearchQuery}
                          onChange={(e) => setVenueSearchQuery(e.target.value)}
                          placeholder="Search venues..."
                          className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
                          autoFocus
                        />
                        {venueSearchQuery && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVenueSearchQuery('');
                            }}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <Icon name="X" size={13} strokeWidth={2.4} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Venue Options List */}
                    <div className="max-h-56 overflow-y-auto space-y-0.5 no-scrollbar">
                      {[
                        { name: 'All Locations', count: '150 items' },
                        { name: 'Derby County FC', count: '4 categories • 385 items' },
                        { name: 'Notts County', count: '1 category • 9 items' },
                        { name: 'Venue 4', count: '1 category • 42 items' },
                        { name: 'Venue 5', count: '1 category • 18 items' },
                      ]
                        .filter((loc) =>
                          loc.name.toLowerCase().includes(venueSearchQuery.toLowerCase())
                        )
                        .map((loc) => {
                          const isSelected =
                            (loc.name === 'All Locations' && !capsuleSelectedVenue) ||
                            capsuleSelectedVenue === loc.name;
                          return (
                            <button
                              key={loc.name}
                              onClick={() => {
                                setCapsuleSelectedVenue(
                                  loc.name === 'All Locations' ? '' : loc.name
                                );
                                setCapsuleLocationSearch('');
                                setVenueSearchQuery('');
                                setIsLocationDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#e7eee9] text-[#164e3f] font-bold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <Icon name="MapPin" size={13} className="text-emerald-700" />
                                {loc.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {loc.count}
                              </span>
                            </button>
                          );
                        })}
                      {[
                        { name: 'All Locations', count: '150 items' },
                        { name: 'Derby County FC', count: '4 categories • 385 items' },
                        { name: 'Notts County', count: '1 category • 9 items' },
                        { name: 'Venue 4', count: '1 category • 42 items' },
                        { name: 'Venue 5', count: '1 category • 18 items' },
                      ].filter((loc) =>
                        loc.name.toLowerCase().includes(venueSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-400 font-medium">
                          No venues found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Metric Cards: Total Items & Categories (Matching User Reference) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Total Items
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    {!capsuleSelectedVenue || capsuleSelectedVenue === 'All Locations'
                      ? (capsuleStatusFilter === 'Low Stock' ? '9' : capsuleStatusFilter === 'Available' ? '141' : '150')
                      : capsuleSelectedVenue.includes('Derby')
                      ? (capsuleStatusFilter === 'Low Stock' ? '9' : capsuleStatusFilter === 'Available' ? '376' : '385')
                      : capsuleSelectedVenue.includes('Notts')
                      ? '9'
                      : capsuleSelectedVenue.includes('Venue 4')
                      ? '42'
                      : '18'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Warehouse" size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Categories
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    {!capsuleSelectedVenue || capsuleSelectedVenue === 'All Locations'
                      ? (capsuleStatusFilter === 'Low Stock' ? '1' : '6')
                      : capsuleSelectedVenue.includes('Derby')
                      ? (capsuleStatusFilter === 'Low Stock' ? '1' : '4')
                      : '1'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Boxes" size={20} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Subtitle Info Row */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-900 font-bold">
                  {capsuleSelectedVenue || 'All Locations'}
                </span>
                <span>•</span>
                <span>
                  {capsuleStatusFilter === 'Low Stock'
                    ? '1 low stock item'
                    : capsuleSelectedVenue === 'Notts County'
                    ? '1 category'
                    : '4 categories'}
                </span>
              </div>
              {capsuleStatusFilter === 'Low Stock' && (
                <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Needs Reorder
                </span>
              )}
            </div>

            {/* Item Cards: 2x2 Grid + Full Width 5th Card matching Exact Image 2 */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1 */}
                {(capsuleStatusFilter === 'All' || capsuleStatusFilter === 'Available') &&
                  (!capsuleSelectedVenue || capsuleSelectedVenue.includes('Derby')) && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Box" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                          Flute Glasses
                        </h3>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">
                          65
                        </span>
                      </div>
                    </div>
                  )}

                {/* Card 2 */}
                {(capsuleStatusFilter === 'All' || capsuleStatusFilter === 'Available') &&
                  (!capsuleSelectedVenue || capsuleSelectedVenue.includes('Derby')) && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Coffee" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pr-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                          Flute Glasses
                        </h3>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">
                          233
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Card 3 */}
                {(capsuleStatusFilter === 'All' || capsuleStatusFilter === 'Low Stock') &&
                  (!capsuleSelectedVenue || capsuleSelectedVenue.includes('Derby')) && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Wine" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                          Flute Glasses
                        </h3>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">
                          9
                        </span>
                      </div>
                    </div>
                  )}

                {/* Card 4 */}
                {(capsuleStatusFilter === 'All' || capsuleStatusFilter === 'Available') &&
                  (!capsuleSelectedVenue || capsuleSelectedVenue.includes('Derby')) && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="GlassWater" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pr-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                          Flute Glasses
                        </h3>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">
                          78
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Card 5: Full Width Pint GG */}
              {(capsuleStatusFilter === 'All' || capsuleStatusFilter === 'Available') &&
                (!capsuleSelectedVenue || capsuleSelectedVenue.includes('Notts')) && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                        Pint GG
                      </h3>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">
                        9
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* VARIATION 7: INTERACTIVE STAT CHIPS (Smart Tappable KPI Pills) */}
        {variation === 'stat-chips' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3.5">
            {/* Clean Header with Location Pill */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Stock Check
                </h2>
                <p className="text-[11px] font-semibold text-slate-400">Inventory Status</p>
              </div>

              {/* Venue Selector Dropdown Pill */}
              <div className="relative">
                <button
                  onClick={() => setIsStatChipVenueOpen(!isStatChipVenueOpen)}
                  className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#164e3f] text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <Icon name="MapPin" size={13} className="text-emerald-700" />
                  <span>{statChipVenue === 'All Locations' ? 'All Venues' : statChipVenue.replace(' County FC', ' FC')}</span>
                  <Icon name={isStatChipVenueOpen ? 'ChevronUp' : 'ChevronDown'} size={13} />
                </button>

                {isStatChipVenueOpen && (
                  <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {['All Locations', 'Derby County FC', 'Notts County', 'Venue 4', 'Venue 5'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setStatChipVenue(loc);
                          setIsStatChipVenueOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          statChipVenue === loc
                            ? 'bg-[#e7eee9] text-[#164e3f] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full-Width Search Input Capsule */}
            <div className="relative">
              <div className="h-10 px-3.5 rounded-full bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15 transition-all">
                <Icon name="Search" size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={statChipSearch}
                  onChange={(e) => setStatChipSearch(e.target.value)}
                  placeholder="Search item name or category..."
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
                />
                {statChipSearch && (
                  <button
                    onClick={() => setStatChipSearch('')}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Icon name="X" size={14} strokeWidth={2.4} />
                  </button>
                )}
              </div>
            </div>

            {/* Smart KPI Stat Chips Ribbon (Tappable Filters) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setStatChipFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border shadow-xs ${
                  statChipFilter === 'all'
                    ? 'bg-[#164e3f] text-white border-[#164e3f]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Total Items</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    statChipFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {statChipVenue === 'Notts County' ? 9 : 385}
                </span>
              </button>

              <button
                onClick={() => setStatChipFilter('categories')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border shadow-xs ${
                  statChipFilter === 'categories'
                    ? 'bg-[#164e3f] text-white border-[#164e3f]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Categories</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    statChipFilter === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {statChipVenue === 'Notts County' ? 1 : 4}
                </span>
              </button>

              <button
                onClick={() => setStatChipFilter('low-stock')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border shadow-xs ${
                  statChipFilter === 'low-stock'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>Low Stock</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                    statChipFilter === 'low-stock' ? 'bg-white/25 text-white' : 'bg-rose-200/80 text-rose-800'
                  }`}
                >
                  1
                </span>
              </button>
            </div>

            {/* Inventory Cards Feed */}
            <div className="space-y-3 pt-0.5">
              <div className="grid grid-cols-2 gap-3">
                {statChipFilter !== 'low-stock' &&
                  (!statChipVenue || statChipVenue.includes('Derby') || statChipVenue === 'All Locations') && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Box" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pl-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                      </div>
                      <div className="self-end">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                      </div>
                    </div>
                  )}

                {statChipFilter !== 'low-stock' &&
                  (!statChipVenue || statChipVenue.includes('Derby') || statChipVenue === 'All Locations') && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="Coffee" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pr-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                      </div>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Low Stock Item Card */}
                {(!statChipVenue || statChipVenue.includes('Derby') || statChipVenue === 'All Locations') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Wine" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                    </div>
                  </div>
                )}

                {statChipFilter !== 'low-stock' &&
                  (!statChipVenue || statChipVenue.includes('Derby') || statChipVenue === 'All Locations') && (
                    <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                      <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                        <Icon name="GlassWater" size={20} strokeWidth={2.2} />
                      </div>
                      <div className="pr-10">
                        <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Full Width Card 5 */}
              {statChipFilter !== 'low-stock' &&
                (!statChipVenue || statChipVenue.includes('Notts') || statChipVenue === 'All Locations') && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Pint GG</h3>
                      <span className="text-[10px] text-slate-500 font-medium">Notts County</span>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* VARIATION 8: SMART VENUE PILL & BOTTOM SHEET MODAL (iOS Style) */}
        {variation === 'venue-sheet' && (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3.5">
            {/* Header with Live Sync Indicator */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Stock Check
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Live Audit</span>
              </div>
            </div>

            {/* Hero Venue Capsule Selector */}
            <button
              onClick={() => setIsVenueSheetOpen(true)}
              className="w-full h-13 px-4 rounded-2xl bg-white border border-[#c4dcce] hover:border-emerald-600 flex items-center justify-between text-left shadow-xs cursor-pointer active:scale-99 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e7eee9] flex items-center justify-center text-[#164e3f]">
                  <Icon name="MapPin" size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Location
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 leading-tight block">
                    {sheetSelectedVenue}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#164e3f] bg-[#e7eee9] px-3 py-1.5 rounded-xl">
                <span>Change</span>
                <Icon name="ChevronDown" size={14} />
              </div>
            </button>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: 'All', count: sheetSelectedVenue === 'Notts County' ? 9 : 385 },
                { id: 'available', label: 'Available', count: sheetSelectedVenue === 'Notts County' ? 9 : 376 },
                { id: 'low-stock', label: 'Low Stock', count: 1 },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSheetStatusFilter(pill.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border shadow-xs ${
                    sheetStatusFilter === pill.id
                      ? 'bg-[#164e3f] text-white border-[#164e3f]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      sheetStatusFilter === pill.id
                        ? 'bg-white/20 text-white'
                        : pill.id === 'low-stock'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Minimal Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Total Items
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    {sheetSelectedVenue === 'Notts County' ? 9 : 385}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Warehouse" size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="bg-[#1b5141] rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-200/90 tracking-wide block">
                    Categories
                  </span>
                  <span className="text-2xl font-black text-white mt-0.5 leading-none block">
                    {sheetSelectedVenue === 'Notts County' ? 1 : 4}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <Icon name="Boxes" size={20} strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Cards Feed */}
            <div className="space-y-3 pt-0.5">
              <div className="grid grid-cols-2 gap-3">
                {sheetStatusFilter !== 'low-stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Box" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                    </div>
                  </div>
                )}
                {sheetStatusFilter !== 'low-stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Coffee" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="Wine" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                  </div>
                </div>

                {sheetStatusFilter !== 'low-stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="GlassWater" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                    </div>
                  </div>
                )}
              </div>

              {sheetStatusFilter !== 'low-stock' && (
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Pint GG</h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                  </div>
                </div>
              )}
            </div>

                      </div>
        )}

        {/* VARIATION 9: COMPACT FLOOR / FIELD MODE (Ultra-Clean Single-Row Header) */}
        {variation === 'compact-floor' && (
          <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-28 space-y-3">
            {/* Minimal Header Row with Integrated Venue */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Stock Check</h2>

              {/* Compact Venue Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setIsCompactVenueOpen(!isCompactVenueOpen)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200/90 text-[#164e3f] text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-slate-50 cursor-pointer"
                >
                  <Icon name="MapPin" size={12} className="text-emerald-700" />
                  <span>{compactVenue === 'All Locations' ? 'All' : compactVenue.replace(' County FC', ' FC')}</span>
                  <Icon name={isCompactVenueOpen ? 'ChevronUp' : 'ChevronDown'} size={12} />
                </button>

                {isCompactVenueOpen && (
                  <div className="absolute right-0 top-8 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {['All Locations', 'Derby County FC', 'Notts County', 'Venue 4', 'Venue 5'].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setCompactVenue(v);
                          setIsCompactVenueOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                          compactVenue === v ? 'bg-[#e7eee9] text-[#164e3f] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Combined Single-Pill Capsule Bar: Status Dropdown + Live Search */}
            <div className="h-11 rounded-full bg-white border border-[#c4dcce] flex items-center p-1 shadow-xs">
              {/* Left Segment: Dark Green Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCompactStatusOpen(!isCompactStatusOpen)}
                  className="h-9 px-3.5 rounded-full bg-[#164e3f] hover:bg-[#134234] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{compactStatus}</span>
                  <Icon name={isCompactStatusOpen ? 'ChevronUp' : 'ChevronDown'} size={13} />
                </button>

                {isCompactStatusOpen && (
                  <div className="absolute left-0 top-11 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50">
                    {['All', 'Available', 'Low Stock'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setCompactStatus(opt as any);
                          setIsCompactStatusOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                          compactStatus === opt ? 'bg-[#e7eee9] text-[#164e3f] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Segment: Search Field */}
              <div className="flex-1 flex items-center px-3 gap-2">
                <Icon name="Search" size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={compactSearch}
                  onChange={(e) => setCompactSearch(e.target.value)}
                  placeholder="Search item..."
                  className="w-full bg-transparent text-xs font-semibold text-[#244e3f] placeholder-slate-400 outline-none"
                />
                {compactSearch && (
                  <button onClick={() => setCompactSearch('')} className="text-slate-400 hover:text-slate-600">
                    <Icon name="X" size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Flat Single-Row Micro-KPI Ribbon */}
            <div className="bg-[#1b5141] rounded-2xl px-4 py-2.5 flex items-center justify-between text-white shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-emerald-200 font-semibold">Items:</span>
                <span className="text-base font-black">{compactVenue === 'Notts County' ? 9 : 385}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-emerald-400/40"></span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-emerald-200 font-semibold">Categories:</span>
                <span className="text-base font-black">{compactVenue === 'Notts County' ? 1 : 4}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-emerald-400/40"></span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-rose-200 font-semibold">Low Stock:</span>
                <span className="text-base font-black text-rose-300">1</span>
              </div>
            </div>

            {/* Cards Feed (Maximum vertical space efficiency) */}
            <div className="space-y-3 pt-0.5">
              <div className="grid grid-cols-2 gap-3">
                {compactStatus !== 'Low Stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Box" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div className="self-end">
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">65</span>
                    </div>
                  </div>
                )}
                {compactStatus !== 'Low Stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1e878e] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="Coffee" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">233</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#35393d] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="Wine" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                  </div>
                </div>

                {compactStatus !== 'Low Stock' && (
                  <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="absolute top-0 right-0 w-11 h-11 bg-[#1d7566] rounded-tr-2xl rounded-bl-2xl flex items-center justify-center text-white shadow-xs">
                      <Icon name="GlassWater" size={20} strokeWidth={2.2} />
                    </div>
                    <div className="pr-10">
                      <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Flute Glasses</h3>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 leading-none">78</span>
                    </div>
                  </div>
                )}
              </div>

              {compactStatus !== 'Low Stock' && (
                <div className="relative bg-[#e1eae6] rounded-2xl h-[106px] overflow-hidden p-3.5 flex flex-col justify-between shadow-xs w-full">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#006891] rounded-tl-2xl rounded-br-2xl flex items-center justify-center text-white shadow-xs">
                    <Icon name="CupSoda" size={20} strokeWidth={2.2} />
                  </div>
                  <div className="pl-10">
                    <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Pint GG</h3>
                  </div>
                  <div className="self-end">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">9</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM NAVIGATION BAR */}
      {/* ========================================================================= */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1f2937] text-slate-400 flex items-center justify-around px-2 z-30 shadow-2xl">
        <button
          onClick={() => onSelectNavTab && onSelectNavTab('home')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Home" size={18} strokeWidth={2.2} />
          <span className="text-[10px] font-medium text-slate-400">Home</span>
        </button>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('stock-info')}
          className="flex flex-col items-center justify-center gap-0.5 text-[#10b981] cursor-pointer flex-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="19" r="2" />
            <path d="M6 17V4a1 1 0 0 1 1-1h1" />
            <path d="M6 19h12" />
            <rect x="9" y="8" width="9" height="9" rx="1.5" />
            <line x1="9" y1="12.5" x2="18" y2="12.5" />
          </svg>
          <span className="text-[10px] font-bold text-[#10b981]">Stock Check</span>
        </button>

        <div className="relative -top-5 flex items-center justify-center px-2">
          <button
            onClick={() => onSelectNavTab && onSelectNavTab('add')}
            className="w-13 h-13 rounded-full bg-[#10b981] hover:bg-[#059669] text-white border-4 border-[#1f2937] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Create New"
          >
            <Icon name="Plus" size={26} strokeWidth={2.8} />
          </button>
        </div>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('calendar')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Calendar" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Calendar</span>
        </button>

        <button
          onClick={() => onSelectNavTab && onSelectNavTab('batch')}
          className="flex flex-col items-center justify-center gap-0.5 hover:text-white transition-colors cursor-pointer flex-1"
        >
          <Icon name="Archive" size={18} strokeWidth={2} />
          <span className="text-[10px] font-medium text-slate-400">Batch</span>
        </button>
      </nav>

      {/* ===================================================================== */}
      {/* FILTERS BOTTOM SHEET MODAL (TRIGGERED BY FILTER ICON BESIDE STOCK CHECK) */}
      {/* ===================================================================== */}
      {isFilterSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          {/* Backdrop overlay */}
          <div
            onClick={() => {
              setIsFilterSheetOpen(false);
              setIsFilterCustomerOpen(false);
              setIsFilterLocationOpen(false);
            }}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Bottom Sheet Card */}
          <div className="relative bg-white rounded-t-[28px] p-5 pt-3 pb-7 shadow-2xl z-10 max-h-[88%] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200 overflow-y-auto no-scrollbar">
            {/* iOS Drag Handle */}
            <div
              className="w-14 h-1 bg-slate-300 rounded-full mx-auto cursor-pointer mb-1 shrink-0"
              onClick={() => {
                setIsFilterSheetOpen(false);
                setIsFilterCustomerOpen(false);
                setIsFilterLocationOpen(false);
              }}
            />

            {/* Title */}
            <h3 className="text-base font-extrabold text-slate-900 text-center tracking-tight shrink-0">
              Filters
            </h3>

            {/* Who's the Customer */}
            <div className="space-y-1.5 shrink-0">
              <label className="block text-sm font-extrabold text-slate-900">
                Who’s the Customer
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterCustomerOpen(!isFilterCustomerOpen);
                    setIsFilterLocationOpen(false);
                  }}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {filterCustomer}
                  </span>
                  <Icon
                    name={isFilterCustomerOpen ? 'ChevronUp' : 'ChevronDown'}
                    size={18}
                    className="text-slate-800 shrink-0 ml-2"
                    strokeWidth={2.2}
                  />
                </button>

                {isFilterCustomerOpen && (
                  <div className="absolute top-[52px] left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {[
                      'Derby County FC',
                      'Delaware North UK',
                      'Compass Group',
                      'Elior UK',
                      'Nottingham Forest',
                    ].map((cust) => {
                      const isSelected = filterCustomer === cust;
                      return (
                        <button
                          key={cust}
                          type="button"
                          onClick={() => {
                            setFilterCustomer(cust);
                            setIsFilterCustomerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#164e3f] text-white shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{cust}</span>
                          {isSelected && <Icon name="Check" size={14} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Where's the Location */}
            <div className="space-y-1.5 shrink-0">
              <label className="block text-sm font-extrabold text-slate-900">
                Where’s the Location
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterLocationOpen(!isFilterLocationOpen);
                    setIsFilterCustomerOpen(false);
                  }}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors shadow-2xs"
                >
                  <span className={`text-sm font-semibold truncate ${filterLocation === 'Select Location' ? 'text-slate-600' : 'text-slate-900'}`}>
                    {filterLocation}
                  </span>
                  <Icon
                    name={isFilterLocationOpen ? 'ChevronUp' : 'ChevronDown'}
                    size={18}
                    className="text-slate-800 shrink-0 ml-2"
                    strokeWidth={2.2}
                  />
                </button>

                {isFilterLocationOpen && (
                  <div className="absolute top-[52px] left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {[
                      'Select Location',
                      'All Locations',
                      'Location 1',
                      'Location 2',
                      'Location 3',
                      'Location 4',
                      'Location 5',
                    ].map((loc) => {
                      const isSelected = filterLocation === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setFilterLocation(loc);
                            setIsFilterLocationOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#164e3f] text-white shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{loc}</span>
                            {loc !== 'Select Location' && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavoriteLocation(loc);
                                }}
                                className="p-0.5 hover:scale-115 active:scale-95 transition-transform"
                                title={favoriteLocations.includes(loc) ? 'Remove from favourites' : 'Add to favourites'}
                              >
                                <Icon
                                  name="Star"
                                  size={11}
                                  className={
                                    favoriteLocations.includes(loc)
                                      ? 'fill-amber-400 text-amber-400'
                                      : isSelected
                                      ? 'text-white/60 hover:text-amber-300'
                                      : 'text-slate-300 hover:text-amber-400'
                                  }
                                  strokeWidth={2}
                                />
                              </span>
                            )}
                          </div>
                          {isSelected && <Icon name="Check" size={14} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2.5 pt-1 shrink-0">
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900">
                Status
              </span>
              <div className="space-y-2.5">
                {[
                  { id: 'Current Stock', label: 'Current Stock' },
                  { id: 'Tote Boxes', label: 'Tote Boxes' },
                  { id: 'Appnostic Card Clicks', label: 'Appnostic Card Clicks' },
                ].map((item) => {
                  const isSelected = filterStatus === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilterStatus(item.id)}
                      className="w-full flex items-center gap-3 py-1 cursor-pointer group text-left"
                    >
                      <div
                        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-slate-900' : 'border-slate-400 group-hover:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Apply & Clear */}
            <div className="flex items-center gap-3 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (filterLocation !== 'Select Location') {
                    if (filterLocation === 'All Locations') {
                      setCtLocation('all');
                      setClientLocation('All Locations');
                    } else {
                      const match = CLIENT_ACCOUNTS.flatMap(c => c.locations).find(l => l.name === filterLocation);
                      if (match) setCtLocation(match.id);
                      setClientLocation(filterLocation);
                    }
                  }
                  if (filterCustomer === 'Derby County FC') {
                    setActiveCustomerOrgId('derby-fc');
                  } else if (filterCustomer === 'Delaware North UK') {
                    setCtClient('delaware-north');
                  } else if (filterCustomer === 'Compass Group') {
                    setCtClient('compass-group');
                  } else if (filterCustomer === 'Elior UK') {
                    setCtClient('elior-uk');
                  }
                  setIsFilterSheetOpen(false);
                  setIsFilterCustomerOpen(false);
                  setIsFilterLocationOpen(false);
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#1c242c] hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm text-center shadow-sm transition-all cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterCustomer('Derby County FC');
                  setFilterLocation('Select Location');
                  setFilterStatus('Current Stock');
                  setCtClient('delaware-north');
                  setCtLocation('all');
                  setClientLocation('All Locations');
                  setIsFilterSheetOpen(false);
                  setIsFilterCustomerOpen(false);
                  setIsFilterLocationOpen(false);
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold text-sm text-center transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Native iOS Bottom Sheet Modal (Constrained inside mobile phone frame) */}
      {isVenueSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          <div
            onClick={() => setIsVenueSheetOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-t-3xl p-5 pb-8 shadow-2xl z-10 max-h-[82%] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200">
            {/* Drag Handle */}
            <div
              className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto cursor-pointer"
              onClick={() => setIsVenueSheetOpen(false)}
            />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Select Venue</h3>
                <p className="text-xs text-slate-500 font-medium">Choose a location to audit inventory</p>
              </div>
              <button
                onClick={() => setIsVenueSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Search in Sheet */}
            <div className="h-10 px-3.5 rounded-xl bg-slate-100 flex items-center gap-2">
              <Icon name="Search" size={15} className="text-slate-400" />
              <input
                type="text"
                value={sheetSearch}
                onChange={(e) => setSheetSearch(e.target.value)}
                placeholder="Search locations..."
                className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            {/* Venues Options */}
            <div className="overflow-y-auto space-y-2 max-h-60 no-scrollbar pr-0.5">
              {[
                { name: 'Derby County FC', items: 385, cats: 4, audit: '85%' },
                { name: 'Notts County', items: 9, cats: 1, audit: '100%' },
                { name: 'Venue 4', items: 42, cats: 1, audit: '60%' },
                { name: 'Venue 5', items: 18, cats: 1, audit: '40%' },
                { name: 'All Locations', items: 150, cats: 6, audit: 'In Progress' },
              ]
                .filter((v) => v.name.toLowerCase().includes(sheetSearch.toLowerCase()))
                .map((v) => {
                  const isSelected = sheetSelectedVenue === v.name;
                  return (
                    <button
                      key={v.name}
                      onClick={() => {
                        setSheetSelectedVenue(v.name);
                        setIsVenueSheetOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#e7eee9] border-emerald-600/40 text-[#164e3f]'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#164e3f] text-white' : 'bg-white text-slate-600 shadow-xs'
                          }`}
                        >
                          <Icon name="MapPin" size={17} />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-bold block">{v.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {v.cats} categories • {v.items} items
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#164e3f] text-white'
                              : 'bg-slate-200/80 text-slate-600'
                          }`}
                        >
                          {v.audit}
                        </span>
                        {isSelected && <Icon name="Check" size={17} className="text-[#164e3f]" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
