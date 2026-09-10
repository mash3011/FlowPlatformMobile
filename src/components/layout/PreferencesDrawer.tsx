import React from 'react';
import { Icon } from '../ui/Icon';

interface PreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleDarkTheme: () => void;
  apparentTheme: boolean;
  onToggleApparentTheme: () => void;
  colorTheme: string;
  onSelectColorTheme: (theme: string) => void;
  fontFamily: string;
  onSelectFontFamily: (font: string) => void;
  fontSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  onSelectFontSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  onReset: () => void;
  onApply: () => void;
}

export const PreferencesDrawer: React.FC<PreferencesDrawerProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
  onToggleDarkTheme,
  apparentTheme,
  onToggleApparentTheme,
  colorTheme,
  onSelectColorTheme,
  fontFamily,
  onSelectFontFamily,
  fontSize,
  onSelectFontSize,
  onReset,
  onApply,
}) => {
  if (!isOpen) return null;

  const fontSizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[] = ['XS', 'S', 'M', 'L', 'XL'];
  const fontSizeIndices = { XS: 0, S: 1, M: 2, L: 3, XL: 4 };

  const colorThemes = [
    { name: 'Violet', color: 'bg-purple-500', hex: '#8b5cf6' },
    { name: 'Blue', color: 'bg-blue-500', hex: '#3b82f6' },
    { name: 'Green', color: 'bg-emerald-500', hex: '#10b981' },
    { name: 'Yellow', color: 'bg-amber-500', hex: '#d97706' },
    { name: 'Red', color: 'bg-rose-500', hex: '#ef4444' },
    { name: 'Mastercard', color: 'bg-orange-500', hex: '#f97316' },
    { name: 'Neutral', color: 'bg-slate-500', hex: '#64748b' },
    { name: 'Custom', color: 'bg-cyan-500', hex: '#06b6d4', isCustom: true },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    onSelectFontSize(fontSizes[idx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Right Drawer */}
      <div className="w-full max-w-sm bg-white dark:bg-[#0e1420] text-slate-900 dark:text-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slide-left border-l border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Icon name="Settings" size={20} className="text-slate-700 dark:text-slate-200 animate-spin-clockwise" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Preferences
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* APPEARANCE */}
          <div className="space-y-4">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              APPEARANCE
            </div>

            {/* Dark Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Icon name="Moon" size={14} className="text-slate-400" />
                <span>Dark Theme</span>
              </div>
              <button
                type="button"
                onClick={onToggleDarkTheme}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                  isDarkTheme ? 'bg-theme-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isDarkTheme ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Apparent Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Icon name="Sun" size={14} className="text-slate-400" />
                <span>Apparent Theme</span>
              </div>
              <button
                type="button"
                onClick={onToggleApparentTheme}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                  apparentTheme ? 'bg-theme-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    apparentTheme ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* COLOR THEME */}
          <div className="space-y-3 pt-2">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              COLOR THEME
            </div>

            <div className="grid grid-cols-2 gap-3">
              {colorThemes.map((t) => {
                const isSelected = colorTheme === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => onSelectColorTheme(t.name)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 dark:border-white ring-2 ring-blue-500/30 bg-slate-50 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-12 h-8 rounded-xl ${t.color} flex items-center justify-center text-white shadow-xs`}
                    >
                      {t.isCustom && <Icon name="Plus" size={16} />}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TYPOGRAPHY */}
          <div className="space-y-4 pt-2">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              TYPOGRAPHY
            </div>

            {/* Font Family Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Font Family
              </label>
              <div className="relative">
                <select
                  value={fontFamily}
                  onChange={(e) => onSelectFontFamily(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-[#141b27] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Source Sans Pro">Source Sans</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={14}
                  className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Font Size</span>
                <span className="text-theme-primary font-extrabold">{fontSize}</span>
              </div>

              {/* Range Input */}
              <div className="relative px-1">
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={fontSizeIndices[fontSize]}
                  onChange={handleSliderChange}
                  className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Labels below ticks */}
              <div className="flex justify-between text-[11px] font-bold text-slate-400 px-0.5">
                {fontSizes.map((size) => {
                  const isCurrent = fontSize === size;
                  return (
                    <span
                      key={size}
                      onClick={() => onSelectFontSize(size)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'text-theme-primary font-black' : 'hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {size}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141b27] text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-6 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-2xs"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
