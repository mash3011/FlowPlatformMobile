import React, { useState } from 'react';
import { MobileDeviceFrame, MobileOSType } from './MobileDeviceFrame';
import { MobileLandingPage } from './MobileLandingPage';
import { MobileSidebarDrawer } from './MobileSidebarDrawer';
import { MobileInvoiceListView } from './MobileInvoiceListView';
import { MobileStockCheckView } from './MobileStockCheckView';
import { Icon } from '../ui/Icon';

export const MobileInvoicePrototype: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<MobileOSType>('ios');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stock-check');
  const [stockCheckPersona, setStockCheckPersona] = useState<'circulayo-teams' | 'clients-view'>('circulayo-teams');

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
              if (activeTab !== 'stock-check') setActiveTab('stock-check');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stock-check' && stockCheckPersona === 'circulayo-teams'
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
              if (activeTab !== 'stock-check') setActiveTab('stock-check');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stock-check' && stockCheckPersona === 'clients-view'
                ? 'bg-[#164e3f] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="Building2" size={14} />
            <span>Clients View</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Mobile Simulator - CENTERED (393w x 852h Figma Standard) */}
      <main className="flex-1 flex items-center justify-center py-4 overflow-y-auto min-h-0">
        <MobileDeviceFrame os={selectedOS}>
          {/* Main Screen Router */}
          {activeTab === 'impact-savings' || activeTab === 'home' ? (
            /* EXACT FIGMA 1123-8536 LANDING PAGE */
            <MobileLandingPage
              onOpenSidebar={() => setIsSidebarOpen(true)}
              activeNavTab="home"
              onSelectNavTab={(tab) => {
                if (tab === 'calendar') setActiveTab('calendar');
                else if (tab === 'batch') setActiveTab('batch');
                else if (tab === 'stock-check') setActiveTab('stock-check');
                else if (tab === 'add') setIsSidebarOpen(true);
              }}
            />
          ) : activeTab === 'stock-check' ? (
            /* EXACT FIGMA 526:8085 STOCK CHECK VIEW */
            <MobileStockCheckView
              onOpenSidebar={() => setIsSidebarOpen(true)}
              persona={stockCheckPersona}
              onPersonaChange={setStockCheckPersona}
              onSelectNavTab={(tab) => {
                if (tab === 'home') setActiveTab('home');
                else if (tab === 'calendar') setActiveTab('calendar');
                else if (tab === 'batch') setActiveTab('batch');
                else if (tab === 'stock-check') setActiveTab('stock-check');
                else if (tab === 'add') setIsSidebarOpen(true);
              }}
            />
          ) : (
            /* Invoice Module matching Impact Savings design language */
            <MobileInvoiceListView
              currentTab={activeTab}
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onSelectNavTab={(tab) => {
                if (tab === 'home') setActiveTab('impact-savings');
                else if (tab === 'calendar') setActiveTab('calendar');
                else if (tab === 'batch') setActiveTab('batch');
                else if (tab === 'stock-check') setActiveTab('stock-check');
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
      </main>

      {/* Bottom Hint Bar */}
      <footer className="text-left pl-2 sm:pl-8 text-[11px] text-slate-500 py-0.5 shrink-0 flex items-center justify-between pr-4">
        <span>Tap hamburger menu (☰) to open sidebar • Toggle iOS / Android above</span>
        <span className="text-[10px] text-slate-400 font-mono">Figma Standard (393 × 852 px)</span>
      </footer>
    </div>
  );
};
