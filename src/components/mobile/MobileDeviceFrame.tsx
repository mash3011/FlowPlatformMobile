import React from 'react';
import { Icon } from '../ui/Icon';

export type MobileOSType = 'ios' | 'android';

interface MobileDeviceFrameProps {
  os: MobileOSType;
  children: React.ReactNode;
  theme?: 'dark' | 'light';
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  os,
  children,
  theme = 'light',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-1 select-none h-full max-h-full">
      {/* Phone Outer Shell - Responsive height that adapts to browser viewport */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          os === 'ios'
            ? 'w-[375px] sm:w-[385px] h-full max-h-[820px] min-h-[540px] rounded-[44px] sm:rounded-[48px] border-[7px] sm:border-[9px] border-[#1f242d] ring-1 ring-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]'
            : 'w-[375px] sm:w-[390px] h-full max-h-[820px] min-h-[540px] rounded-[36px] sm:rounded-[40px] border-[7px] sm:border-[9px] border-[#22252a] ring-1 ring-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]'
        } bg-[#000000] overflow-hidden flex flex-col`}
      >
        {/* Hardware side buttons - purely cosmetic */}
        <div className="absolute -left-[13px] top-[115px] w-[3px] h-[28px] bg-slate-600 rounded-l-xs" />
        <div className="absolute -left-[13px] top-[160px] w-[3px] h-[48px] bg-slate-600 rounded-l-xs" />
        <div className="absolute -left-[13px] top-[220px] w-[3px] h-[48px] bg-slate-600 rounded-l-xs" />
        <div className="absolute -right-[13px] top-[170px] w-[3px] h-[72px] bg-slate-600 rounded-r-xs" />

        {/* Top Status Bar & Camera Area */}
        {os === 'ios' ? (
          /* iOS Status Bar with Dynamic Island */
          <div className="relative h-11 w-full bg-[#0d111a] text-white flex items-center justify-between px-6 shrink-0 z-50">
            {/* Time */}
            <span className="text-[13px] font-semibold tracking-tight text-white/90">9:41</span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[26px] w-[110px] bg-black rounded-full flex items-center justify-end px-2.5 space-x-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111927] border border-slate-700/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d2a45] opacity-80" />
            </div>

            {/* Right Status Icons */}
            <div className="flex items-center gap-1.5 text-white/90">
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-1 bg-white rounded-2xs" />
                <span className="w-0.5 h-1.5 bg-white rounded-2xs" />
                <span className="w-0.5 h-2 bg-white rounded-2xs" />
                <span className="w-0.5 h-2.5 bg-white rounded-2xs" />
              </div>
              <span className="text-[10px] font-bold tracking-tight">5G</span>
              {/* Battery */}
              <div className="w-5 h-2.5 border border-white/80 rounded-[3px] p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        ) : (
          /* Android Status Bar with Punch-Hole Camera */
          <div className="relative h-10 w-full bg-[#0d111a] text-white flex items-center justify-between px-5 shrink-0 z-50">
            {/* Left side: Time & Notification icons */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium tracking-tight text-slate-200">09:41</span>
              <Icon name="Bell" size={11} className="text-slate-400" />
            </div>

            {/* Centered Punch-Hole Camera */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-3.5 h-3.5 rounded-full bg-black border border-slate-700/50 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#112338]" />
            </div>

            {/* Right side: Wi-Fi, LTE, Battery */}
            <div className="flex items-center gap-2 text-slate-300">
              <Icon name="Wifi" size={12} />
              <span className="text-[10px] font-semibold">LTE</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-slate-300">89%</span>
                <Icon name="Battery" size={14} className="text-slate-200 fill-slate-200" />
              </div>
            </div>
          </div>
        )}

        {/* Inner Screen Display (Interactive Content) - Pure Light Mode */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white relative text-slate-900">
          {children}
        </div>

        {/* Bottom Navigation Gesture Bar */}
        {os === 'ios' ? (
          /* iOS Home Indicator */
          <div className="h-6 w-full bg-[#0d111a] flex items-center justify-center shrink-0 z-50">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        ) : (
          /* Android Gesture Pill / 3-button Bar */
          <div className="h-6 w-full bg-[#0d111a] flex items-center justify-center shrink-0 z-50">
            <div className="w-20 h-1 bg-white/50 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
