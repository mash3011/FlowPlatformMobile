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
import { Toaster, toast } from 'sonner';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('impact-savings');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  
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
        return <FlowCalendarView onSelectTab={setActiveTab} />;
      case 'invoice':
      case 'invoice-list':
      case 'invoice-services':
      case 'services':
      case 'invoice-reconciliation':
      case 'invoice-history':
        return <InvoiceListView activeTab={activeTab} onSelectDashboard={setActiveTab} />;
      case 'performance-metrics':
        return <PerformanceMetricsDashboard onSelectDashboard={setActiveTab} />;
      case 'tech-bin-dashboard':
        return <TechBinDashboard onSelectDashboard={setActiveTab} />;
      case 'circulayo-connect':
        return <CirculayoConnectDashboard onSelectDashboard={setActiveTab} />;
      case 'impact-savings':
      default:
        return <ImpactSavingsDashboard onSelectDashboard={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Toaster position="top-right" richColors />

      {/* Top Header */}
      <FlowHeader
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Apparent theme turns ONLY the sidebar black/dark) */}
        <FlowSidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
          apparentTheme={apparentTheme}
        />

        {/* Main Dashboard Workspace (Stays in Light Mode if isDarkTheme is false) */}
        {renderActiveDashboard()}

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
      </div>
    </div>
  );
};
