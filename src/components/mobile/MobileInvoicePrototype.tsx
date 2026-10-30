import React, { useState, useEffect, useRef } from 'react';
import { MobileDeviceFrame, MobileOSType } from './MobileDeviceFrame';
import { MobileLandingPage } from './MobileLandingPage';
import { MobileImpactSavingsView } from './MobileImpactSavingsView';
import { MobilePerformanceMetricsView } from './MobilePerformanceMetricsView';
import { MobileTechBinView } from './MobileTechBinView';
import { MobileCirculayoAppView } from './MobileCirculayoAppView';
import { MobileCalendarView } from './MobileCalendarView';
import { MobileSidebarDrawer } from './MobileSidebarDrawer';
import { MobileInvoiceListView } from './MobileInvoiceListView';
import { MobileStockCheckView } from './MobileStockCheckView';
import { MobileStockCheckAuditView } from './MobileStockCheckAuditView';
import { Icon } from '../ui/Icon';

export const MobileInvoicePrototype: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<MobileOSType>('ios');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stock-info');
  const [stockCheckPersona, setStockCheckPersona] = useState<'circulayo-teams' | 'clients-view'>('circulayo-teams');
  const [scaleMode, setScaleMode] = useState<'fit' | '100'>('fit');
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const computeScale = () => {
      if (scaleMode === '100') {
        setScale(1);
        return;
      }
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const availH = Math.max(200, rect.height - 24);
      const availW = Math.max(200, rect.width - 24);
      // Total visual size including bezel is ~417px width x ~876px height
      const targetScale = Math.min(1, Math.min(availH / 876, availW / 417));
      setScale(Math.max(0.35, Number(targetScale.toFixed(3))));
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [scaleMode]);

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-3 sm:px-6 sm:py-3 select-none font-sans overflow-hidden">
      {/* Top Prototype Controls Bar - Clean Light Mode Styling */}
      <header className="w-full flex items-center justify-start gap-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/90 shadow-sm shrink-0">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
              Flow Platform Mobile
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              393 × 852 px
            </span>
          </div>
        </div>

        {/* OS & Device Switcher: iPhone | Android */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setSelectedOS('ios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedOS === 'ios'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="Apple" size={14} />
            <span>Apple iPhone</span>
          </button>
          <button
            onClick={() => setSelectedOS('android')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedOS === 'android'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="Smartphone" size={14} />
            <span>Google Android</span>
          </button>
        </div>

        {/* View Switcher: Circulayo Teams | Clients View (Beside Apple iPhone and Google Android) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => {
              setStockCheckPersona('circulayo-teams');
              if (activeTab !== 'stock-info') setActiveTab('stock-info');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stock-info' && stockCheckPersona === 'circulayo-teams'
                ? 'bg-[#164e3f] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="Users" size={14} />
            <span>Circulayo Teams</span>
          </button>
          <button
            onClick={() => {
              setStockCheckPersona('clients-view');
              if (activeTab !== 'stock-info') setActiveTab('stock-info');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stock-info' && stockCheckPersona === 'clients-view'
                ? 'bg-[#164e3f] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="Building2" size={14} />
            <span>Clients View</span>
          </button>
        </div>

        {/* View / Scale Mode: Fit to Screen | 100% (Right-aligned) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-auto">
          <button
            onClick={() => setScaleMode('fit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              scaleMode === 'fit'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Auto-fit mobile screen to desktop display"
          >
            <Icon name="Maximize2" size={13} />
            <span>Fit Screen {scaleMode === 'fit' && scale < 0.99 ? `(${Math.round(scale * 100)}%)` : ''}</span>
          </button>
          <button
            onClick={() => setScaleMode('100')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              scaleMode === '100'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="View at actual 100% 393 × 852 px"
          >
            <Icon name="Eye" size={13} />
            <span>100%</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Mobile Simulator - FIXED & CENTERED IN DESKTOP SCREEN */}
      <main
        ref={mainRef}
        className={`flex-1 flex items-center justify-center p-2 ${
          scaleMode === '100' ? 'overflow-auto' : 'overflow-hidden'
        } min-h-0 relative`}
      >
        <div
          style={{
            width: `${417 * scale}px`,
            height: `${876 * scale}px`,
          }}
          className="relative flex items-center justify-center shrink-0 transition-all duration-150 ease-out"
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
            className="shrink-0"
          >
            <MobileDeviceFrame os={selectedOS}>
              {/* Main Screen Router for All Dashboard Pages */}
              {activeTab === 'performance-metrics' ? (
                /* EXACT IMAGE 1: Performance Metrics in Green Theme */
                <MobilePerformanceMetricsView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="performance-metrics"
                  onSelectNavTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === 'impact-savings' || activeTab === 'home' ? (
                /* EXACT IMAGE 2: Impact Savings in Green Theme */
                <MobileImpactSavingsView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="impact-savings"
                  onSelectNavTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === 'tech-bin-dashboard' || activeTab === 'batch' ? (
                /* EXACT IMAGE 3: Tech Bin in Green Theme */
                <MobileTechBinView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="tech-bin-dashboard"
                  onSelectNavTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === 'circulayo-app-dashboard' ? (
                /* EXACT IMAGE 4: Circulayo App in Green Theme */
                <MobileCirculayoAppView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="circulayo-app-dashboard"
                  onSelectNavTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === 'calendar' || activeTab === 'calendar-view' ? (
                /* EXACT IMAGE 5: Calendar in Green Theme */
                <MobileCalendarView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="calendar"
                  onSelectNavTab={(tab) => setActiveTab(tab)}
                />
              ) : activeTab === 'stock-info' ? (
                /* EXACT IMAGE FROM USER: Stock Info (under Reports) */
                <MobileStockCheckView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  persona={stockCheckPersona}
                  onPersonaChange={setStockCheckPersona}
                  onSelectNavTab={(tab) => {
                    if (tab === 'home') setActiveTab('impact-savings');
                    else if (tab === 'calendar') setActiveTab('calendar');
                    else if (tab === 'batch') setActiveTab('tech-bin-dashboard');
                    else if (tab === 'stock' || tab === 'stock-info') setActiveTab('stock-info');
                    else if (tab === 'add') setIsSidebarOpen(true);
                    else setActiveTab(tab);
                  }}
                />
              ) : activeTab === 'stock-check-mgmt' || activeTab === 'stock-check' ? (
                /* Stock Check under MANAGEMENT */
                <MobileStockCheckAuditView
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  activeNavTab="stock-check-mgmt"
                  onSelectNavTab={(tab) => {
                    if (tab === 'home') setActiveTab('impact-savings');
                    else if (tab === 'calendar') setActiveTab('calendar');
                    else if (tab === 'batch') setActiveTab('tech-bin-dashboard');
                    else if (tab === 'stock' || tab === 'stock-info') setActiveTab('stock-info');
                    else setActiveTab(tab);
                  }}
                />
              ) : (
                /* Invoices / Reports View */
                <MobileInvoiceListView
                  currentTab={activeTab}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  onSelectNavTab={(tab) => {
                    if (tab === 'home') setActiveTab('impact-savings');
                    else if (tab === 'calendar') setActiveTab('calendar');
                    else if (tab === 'batch') setActiveTab('tech-bin-dashboard');
                    else if (tab === 'stock' || tab === 'stock-info') setActiveTab('stock-info');
                    else setActiveTab(tab);
                  }}
                />
              )}

              {/* EXACT FIGMA 1123-8991 SIDEBAR DRAWER */}
              <MobileSidebarDrawer
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
                onSelectTab={(tabId) => {
                  setActiveTab(tabId);
                  setIsSidebarOpen(false);
                }}
              />
            </MobileDeviceFrame>
          </div>
        </div>
      </main>

      {/* Bottom Hint Bar */}
      <footer className="text-left pl-2 sm:pl-8 text-[11px] text-slate-500 py-0.5 shrink-0 flex items-center justify-between pr-4">
        <span>Tap hamburger menu (☰) to open sidebar • Toggle iOS / Android above</span>
        <span className="text-[10px] text-slate-400 font-mono">Figma Standard (393 × 852 px)</span>
      </footer>
    </div>
  );
};
