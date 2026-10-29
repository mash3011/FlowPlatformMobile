import React, { useState, useEffect } from 'react';
import { FlowHeader } from './components/layout/FlowHeader';
import { FlowSidebar } from './components/layout/FlowSidebar';
import { ImpactSavingsDashboard } from './components/dashboard/ImpactSavingsDashboard';
import { PerformanceMetricsDashboard } from './components/dashboard/PerformanceMetricsDashboard';
import { TechBinDashboard } from './components/dashboard/TechBinDashboard';
import { CirculayoConnectDashboard } from './components/dashboard/CirculayoConnectDashboard';
import { FlowCalendarView } from './components/calendar/FlowCalendarView';
import { InvoiceListView } from './components/invoice/InvoiceListView';
import { OnboardingDrawer } from './components/onboarding/OnboardingDrawer';
import { PreferencesDrawer } from './components/layout/PreferencesDrawer';
import { CommandPaletteModal } from './components/navigation/CommandPaletteModal';
import { BreadcrumbBar } from './components/navigation/BreadcrumbBar';
import { Toaster, toast } from 'sonner';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('impact-savings');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Favorites state (pinned tab IDs)
  const [favorites, setFavorites] = useState<string[]>(['impact-savings', 'invoice-list']);

  // Recent tabs history for Command Palette
  const [recentTabs, setRecentTabs] = useState<string[]>(['impact-savings', 'invoice-list']);

  // Handle Tab Switch
  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setRecentTabs((prev) => {
      if (!prev.includes(tabId)) {
        return [tabId, ...prev].slice(0, 5);
      }
      return prev;
    });
  };

  // Toggle Favorite / Star status
  const handleToggleFavorite = (tabId: string) => {
    setFavorites((prev) => {
      if (prev.includes(tabId)) {
        toast.info('Removed from Favorites');
        return prev.filter((id) => id !== tabId);
      } else {
        toast.success('Pinned to Favorites!');
        return [...prev, tabId];
      }
    });
  };

  // Global Keyboard Shortcut: Cmd + K / Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Theme States - Default to Light Mode (isDarkTheme = false)
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [apparentTheme, setApparentTheme] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<string>('Blue');
  const [fontFamily, setFontFamily] = useState<string>('Source Sans Pro');
  const [fontSize, setFontSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');

  // Sync Dark Mode class on document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Sync Color Theme class on document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    const themeClasses = [
      'theme-violet',
      'theme-blue',
      'theme-green',
      'theme-yellow',
      'theme-red',
      'theme-mastercard',
      'theme-neutral',
      'theme-custom',
    ];
    root.classList.remove(...themeClasses);
    root.classList.add(`theme-${colorTheme.toLowerCase()}`);
  }, [colorTheme]);

  // Enforce Source Sans Pro Font Family
  useEffect(() => {
    document.body.style.fontFamily = "'Source Sans 3', 'Source Sans Pro', sans-serif";
  }, [fontFamily]);

  // Dynamic Font Size Scaling
  useEffect(() => {
    const root = document.documentElement;
    const sizeMap = {
      XS: '13px',
      S: '14px',
      M: '16px',
      L: '18px',
      XL: '20px',
    };
    root.style.fontSize = sizeMap[fontSize];
  }, [fontSize]);

  const handleApplyPreferences = () => {
    toast.success('Preferences Applied!', {
      description: `Dark Theme: ${isDarkTheme ? 'ON' : 'OFF'} | Apparent Theme: ${apparentTheme ? 'ON' : 'OFF'}`,
    });
    setIsPreferencesOpen(false);
  };

  const handleResetPreferences = () => {
    setIsDarkTheme(false);
    setApparentTheme(false);
    setColorTheme('Blue');
    setFontFamily('Source Sans Pro');
    setFontSize('M');
    toast.info('Preferences reset to Light Mode defaults');
  };

  const renderActiveDashboard = () => {
    switch (activeTab) {
      case 'calendar':
      case 'calendar-item':
      case 'events':
      case 'events-item':
        return <FlowCalendarView onSelectTab={handleSelectTab} />;
      case 'invoice':
      case 'invoice-list':
      case 'invoice-services':
      case 'services':
      case 'invoice-reconciliation':
      case 'invoice-history':
        return <InvoiceListView activeTab={activeTab} onSelectDashboard={handleSelectTab} />;
      case 'performance-metrics':
        return <PerformanceMetricsDashboard onSelectDashboard={handleSelectTab} />;
      case 'tech-bin-dashboard':
        return <TechBinDashboard onSelectDashboard={handleSelectTab} />;
      case 'circulayo-connect':
        return <CirculayoConnectDashboard onSelectDashboard={handleSelectTab} />;
      case 'impact-savings':
      default:
        return <ImpactSavingsDashboard onSelectDashboard={handleSelectTab} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Toaster position="top-right" richColors />

      {/* Top Header with Global Search Input */}
      <FlowHeader
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar with Pinned Favorites */}
        <FlowSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          apparentTheme={apparentTheme}
          favorites={favorites}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Streamlined Workspace Header (Breadcrumb & Favorite Star) */}
          <BreadcrumbBar
            activeTab={activeTab}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          {/* Active Workspace View */}
          <div className="flex-1 overflow-y-auto">
            {renderActiveDashboard()}
          </div>
        </div>

        {/* Right Onboarding Drawer */}
        <OnboardingDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Right Preferences / Settings Drawer */}
        <PreferencesDrawer
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          isDarkTheme={isDarkTheme}
          onToggleDarkTheme={() => {
            setIsDarkTheme(!isDarkTheme);
            toast.info(`Switched to ${!isDarkTheme ? 'Dark Mode' : 'Light Mode'}`);
          }}
          apparentTheme={apparentTheme}
          onToggleApparentTheme={() => {
            setApparentTheme(!apparentTheme);
            toast.info(`Apparent Theme ${!apparentTheme ? 'Enabled (Black Sidebar)' : 'Disabled'}`);
          }}
          colorTheme={colorTheme}
          onSelectColorTheme={(theme) => {
            setColorTheme(theme);
            toast.info(`Color Theme changed to ${theme}`);
          }}
          fontFamily={fontFamily}
          onSelectFontFamily={(font) => {
            setFontFamily(font);
          }}
          fontSize={fontSize}
          onSelectFontSize={(size) => {
            setFontSize(size);
            toast.info(`Font Size set to ${size}`);
          }}
          onReset={handleResetPreferences}
          onApply={handleApplyPreferences}
        />

        {/* Global Command Palette Modal (Cmd + K) */}
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={handleSelectTab}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          recentTabs={recentTabs}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
          onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        />
      </div>
    </div>
  );
};
