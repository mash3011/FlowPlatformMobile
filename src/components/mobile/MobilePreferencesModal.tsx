import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';

interface MobilePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export const MobilePreferencesModal: React.FC<MobilePreferencesModalProps> = ({
  isOpen,
  onClose,
  currentTheme = 'green',
  onThemeChange,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(currentTheme);
  const [selectedPlusColor, setSelectedPlusColor] = useState<string>('primary');
  const [fontFamily, setFontFamily] = useState<string>('Source Sans');
  const [fontSize, setFontSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isApparentTheme, setIsApparentTheme] = useState(false);

  if (!isOpen) return null;

  const themes = [
    { id: 'green', label: 'Green', color: '#2e7d5b' },
    { id: 'yellow', label: 'Yellow', color: '#c99a45' },
    { id: 'red', label: 'Red', color: '#b85d68' },
    { id: 'mastercard', label: 'Mastercard', color: '#ff671b' },
    { id: 'neutral', label: 'Neutral', color: '#5b7086' },
    { id: 'custom', label: 'Custom', color: '#ff671b', isCustom: true },
  ];

  const themeAccentColor = themes.find((t) => t.id === selectedTheme)?.color || '#2e7d5b';

  const plusColors = [
    { id: 'primary', label: 'Primary', bg: 'bg-[#ff671b]', text: 'text-white', border: 'border-2 border-slate-900' },
    { id: 'primary-light', label: 'Primary Light', bg: 'bg-[#ffe8dc]', text: 'text-[#ff671b]', border: 'border border-orange-200' },
    { id: 'primary-dark', label: 'Primary Dark', bg: 'bg-[#9a3412]', text: 'text-white', border: '' },
    { id: 'secondary', label: 'Secondary', bg: 'bg-[#f59e0b]', text: 'text-white', border: '' },
    { id: 'gradient-1', label: 'Gradient 1', bg: 'bg-gradient-to-b from-[#ff8c42] to-[#ff5500]', text: 'text-white', border: '' },
    { id: 'gradient-2', label: 'Gradient 2', bg: 'bg-gradient-to-r from-[#d9480f] to-[#ff7a33]', text: 'text-white', border: '' },
  ];

  const fontSizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL'> = ['XS', 'S', 'M', 'L', 'XL'];
  const fontSizeIndex = fontSizes.indexOf(fontSize);

  const handleApply = () => {
    if (onThemeChange) {
      onThemeChange(selectedTheme);
    }
    toast.success('Preferences applied successfully!');
    onClose();
  };

  const handleReset = () => {
    setSelectedTheme('green');
    setSelectedPlusColor('primary');
    setFontFamily('Source Sans');
    setFontSize('M');
    setIsDarkTheme(false);
    setIsApparentTheme(false);
    toast.info('Preferences reset to default');
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1.5px] transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Side Drawer popping from right to left */}
      <div className="relative w-[320px] sm:w-[335px] max-w-[88%] h-full bg-white shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 font-sans border-l border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <Icon name="Settings" size={18} className="text-slate-600" />
            <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer rounded-md"
            title="Close"
          >
            <Icon name="X" size={17} strokeWidth={2.4} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {/* Section 1: Themes (2 cols x 3 rows) */}
          <div>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-slate-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Swatch */}
                    <div
                      style={{ backgroundColor: theme.color }}
                      className="w-13 h-5.5 rounded-md flex items-center justify-center mb-1.5 shadow-2xs"
                    >
                      {theme.isCustom && (
                        <Icon name="Plus" size={12} className="text-white" strokeWidth={2.8} />
                      )}
                    </div>
                    {/* Label */}
                    <span className="text-[11px] font-semibold text-slate-700 leading-none">
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Plus Button Color */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              PLUS BUTTON COLOR
            </h3>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
              {plusColors.map((btn) => {
                const isSelected = selectedPlusColor === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedPlusColor(btn.id)}
                    className="flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <div
                      className={`w-11 h-11 rounded-full ${btn.bg} ${btn.text} ${btn.border} flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isSelected ? 'ring-2 ring-offset-2 ring-slate-800' : ''
                      }`}
                    >
                      <Icon name="Plus" size={18} strokeWidth={2.6} />
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-600 mt-1.5 leading-none">
                      {btn.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Typography */}
          <div className="space-y-3 pt-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TYPOGRAPHY
            </h3>

            {/* Font Family Selector */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Font Family
              </label>
              <div className="relative">
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 appearance-none outline-none cursor-pointer focus:border-slate-400"
                >
                  <option value="Source Sans">Source Sans</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Inter">Inter</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-500">Font Size</span>
                <span style={{ color: themeAccentColor }} className="text-[11.5px] font-bold">{fontSize}</span>
              </div>

              {/* Slider Track with Interactive Ticks */}
              <div className="relative px-1 pt-1 pb-2">
                <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${(fontSizeIndex / (fontSizes.length - 1)) * 100}%`,
                      backgroundColor: themeAccentColor,
                    }}
                    className="h-full rounded-full transition-all duration-150"
                  />
                </div>

                {/* Thumb Dot */}
                <div
                  style={{
                    left: `calc(${(fontSizeIndex / (fontSizes.length - 1)) * 100}% - 7px)`,
                    backgroundColor: themeAccentColor,
                  }}
                  className="absolute top-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm pointer-events-none transition-all duration-150"
                />

                {/* Tick Labels */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-0.5">
                  {fontSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      style={{ color: fontSize === sz ? themeAccentColor : undefined }}
                      className={`cursor-pointer transition-colors ${
                        fontSize === sz ? 'font-bold' : 'hover:text-slate-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Appearance (Exact Match to Screenshot) */}
          <div className="space-y-3.5 pt-2">
            <h3 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">
              APPEARANCE
            </h3>

            {/* Dark Theme Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <Icon name="Sun" size={17} className="text-slate-500 shrink-0" strokeWidth={1.8} />
                <span className="text-[13.5px] font-semibold text-slate-800">Dark Theme</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isDarkTheme}
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  isDarkTheme ? 'bg-[#2e7d5b]' : 'bg-[#dde3ea]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isDarkTheme ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Apparent Theme Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <Icon name="Sun" size={17} className="text-slate-500 shrink-0" strokeWidth={1.8} />
                <span className="text-[13.5px] font-semibold text-slate-800">Apparent Theme</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isApparentTheme}
                onClick={() => setIsApparentTheme(!isApparentTheme)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  isApparentTheme ? 'bg-[#2e7d5b]' : 'bg-[#dde3ea]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isApparentTheme ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
