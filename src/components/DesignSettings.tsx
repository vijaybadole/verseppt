/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Slide, SlideLayout, BackgroundType, FontFamily, SlideTransition, PresentationTheme } from '../types';
import { THEMES } from '../data';
import { Layout, Palette, Type, Sliders, FileText } from 'lucide-react';

interface DesignSettingsProps {
  slide: Slide;
  onUpdateSlide: (updatedSlide: Slide) => void;
  onApplyThemeToAll: (theme: PresentationTheme) => void;
}

const PRESET_COLORS = [
  { name: 'Obsidian', hex: '#0f172a' },
  { name: 'Coal Black', hex: '#0a0a0a' },
  { name: 'Clean White', hex: '#ffffff' },
  { name: 'Warm Warmth', hex: '#fafaf9' },
  { name: 'Plum Purple', hex: '#2e1065' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Deep Emerald', hex: '#022c22' },
  { name: 'Orange Rust', hex: '#431407' },
];

const PRESET_ACCENTS = [
  { name: 'Sky', hex: '#38bdf8' },
  { name: 'Emerald', hex: '#34d399' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Violet', hex: '#a78bfa' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Yellow', hex: '#f59e0b' },
];

export default function DesignSettings({ slide, onUpdateSlide, onApplyThemeToAll }: DesignSettingsProps) {

  const handleLayoutChange = (layout: SlideLayout) => {
    onUpdateSlide({ ...slide, layout });
  };

  const handleFontChange = (fontFamily: FontFamily) => {
    onUpdateSlide({ ...slide, fontFamily });
  };

  const handleBgTypeChange = (bgType: BackgroundType) => {
    let presetColor = slide.bgColor;
    let start = slide.bgGradientStart;
    let end = slide.bgGradientEnd;

    // Smart helpers for initial state toggles
    if (bgType === 'minimal') {
      presetColor = '#fafaf9';
    } else if (bgType === 'dark') {
      presetColor = '#0f172a';
    } else if (bgType === 'gradient') {
      start = start || '#1e1b4b';
      end = end || '#311042';
    }

    onUpdateSlide({
      ...slide,
      bgType,
      bgColor: presetColor,
      bgGradientStart: start,
      bgGradientEnd: end,
    });
  };

  const handleThemeApply = (theme: PresentationTheme) => {
    onUpdateSlide({
      ...slide,
      fontFamily: theme.fontFamily,
      bgType: theme.bgType,
      bgColor: theme.bgColor,
      bgGradientStart: theme.bgGradientStart,
      bgGradientEnd: theme.bgGradientEnd,
      textColor: theme.textColor,
      accentColor: theme.accentColor,
    });
  };

  return (
    <div id="design-settings-sidebar" className="space-y-6 text-neutral-800">
      
      {/* SECTION 1: Standard Themes */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Themes Preset</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {THEMES.map(theme => (
            <div 
              key={theme.id}
              className="group relative flex flex-col p-2 bg-white border border-neutral-200 hover:border-indigo-400 rounded-lg text-left transition text-xs shadow-sm"
            >
              <div className="font-semibold text-neutral-700 mb-1">{theme.name}</div>
              <div className="flex space-x-1.5 items-center">
                <span 
                  className="w-4 h-4 rounded border border-neutral-200 flex-shrink-0" 
                  style={{ backgroundColor: theme.bgColor }} 
                />
                <span 
                  className="w-4 h-4 rounded border border-neutral-200 flex-shrink-0" 
                  style={{ backgroundColor: theme.accentColor }} 
                />
              </div>

              {/* Float popovers to apply per-slide vs all slides */}
              <div className="mt-2 flex space-x-1">
                <button
                  type="button"
                  id={`btn-apply-theme-slide-${theme.id}`}
                  onClick={() => handleThemeApply(theme)}
                  className="flex-1 text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-0.5 px-1 rounded font-medium transition"
                >
                  This Slide
                </button>
                <button
                  type="button"
                  id={`btn-apply-theme-all-${theme.id}`}
                  onClick={() => onApplyThemeToAll(theme)}
                  className="flex-1 text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-0.5 px-1 rounded font-medium transition"
                >
                  Apply All
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 2: Layout Selectors */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <Layout className="w-3.5 h-3.5 text-indigo-500" />
          <span>Slide Layout Template</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { id: 'cover', name: 'Cover Slide' },
            { id: 'header-text', name: 'Header + Body' },
            { id: 'two-column', name: 'Split 2 Cols' },
            { id: 'three-column', name: 'Cards 3 Cols' },
            { id: 'big-stat', name: 'Big Statistic' },
            { id: 'quote', name: 'Inspirational Quote' },
          ] as { id: SlideLayout; name: string }[]).map(layoutOpt => (
            <button
              key={layoutOpt.id}
              id={`design-layout-opt-${layoutOpt.id}`}
              onClick={() => handleLayoutChange(layoutOpt.id)}
              className={`p-2.5 rounded-lg border text-xs text-left transition flex flex-col justify-between font-medium ${
                slide.layout === layoutOpt.id 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
              }`}
            >
              <span>{layoutOpt.name}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 3: Font Families */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-500" />
          <span>Typography Style</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { id: 'sans', name: 'Inter Sans', desc: 'Modern & clean' },
            { id: 'display', name: 'Space Grotesk', desc: 'Tech & forward' },
            { id: 'serif', name: 'Playfair Display', desc: 'Elegant & classic' },
            { id: 'mono', name: 'JetBrains Mono', desc: 'Rigorous & clean' },
          ] as { id: FontFamily; name: string; desc: string }[]).map(fontOpt => (
            <button
              key={fontOpt.id}
              id={`design-font-opt-${fontOpt.id}`}
              onClick={() => handleFontChange(fontOpt.id)}
              className={`p-2 rounded-lg border text-left transition flex flex-col ${
                slide.fontFamily === fontOpt.id 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
              }`}
            >
              <span className={`text-xs font-bold ${fontOpt.id === 'serif' ? 'font-serif' : fontOpt.id === 'mono' ? 'font-mono' : fontOpt.id === 'display' ? 'font-display' : 'font-sans'}`}>
                {fontOpt.name}
              </span>
              <span className="text-[10px] opacity-75 mt-0.5">{fontOpt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 4: Background styling overrides */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          <span>Color & Canvas Settings</span>
        </label>
        
        {/* Background Toggle types */}
        <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
          {([
            { id: 'solid', label: 'Solid' },
            { id: 'gradient', label: 'Gradient' },
            { id: 'minimal', label: 'Ivory' },
            { id: 'dark', label: 'Obsidian' },
          ] as { id: BackgroundType; label: string }[]).map(bgOpt => (
            <button
              key={bgOpt.id}
              id={`design-bgtype-opt-${bgOpt.id}`}
              onClick={() => handleBgTypeChange(bgOpt.id)}
              className={`flex-1 py-1 rounded text-center text-xs font-semibold transition ${
                slide.bgType === bgOpt.id 
                  ? 'bg-white shadow text-neutral-900 border border-neutral-200' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {bgOpt.label}
            </button>
          ))}
        </div>

        {/* Conditional Picker panels */}
        {slide.bgType === 'solid' && (
          <div className="space-y-2">
            <span className="text-[11px] text-neutral-500 font-semibold uppercase">Background Hex</span>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="design-color-picker-solid"
                value={slide.bgColor.startsWith('#') && slide.bgColor.length === 7 ? slide.bgColor : '#0f172a'}
                onChange={(e) => onUpdateSlide({ ...slide, bgColor: e.target.value })}
                className="w-10 h-8 rounded cursor-pointer border border-neutral-300"
              />
              <input
                type="text"
                id="design-text-picker-solid"
                value={slide.bgColor}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateSlide({ ...slide, bgColor: val });
                }}
                className="flex-1 bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-neutral-800"
                placeholder="#0f172a"
              />
            </div>
            {/* Quick palette dots */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_COLORS.map(color => (
                <button
                  key={color.hex}
                  type="button"
                  id={`design-preset-bg-${color.hex}`}
                  onClick={() => onUpdateSlide({ ...slide, bgColor: color.hex })}
                  className="w-6 h-6 rounded-full border border-neutral-300/40 cursor-pointer shadow-sm relative group"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {slide.bgType === 'gradient' && (
          <div className="space-y-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Color Start</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    id="design-gradient-start"
                    value={slide.bgGradientStart || '#1e1b4b'}
                    onChange={(e) => onUpdateSlide({ ...slide, bgGradientStart: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-neutral-300"
                  />
                  <input
                    type="text"
                    id="design-gradient-start-text"
                    value={slide.bgGradientStart || '#1e1b4b'}
                    onChange={(e) => onUpdateSlide({ ...slide, bgGradientStart: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded px-1 text-[10px] font-mono text-center"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Color End</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    id="design-gradient-end"
                    value={slide.bgGradientEnd || '#311042'}
                    onChange={(e) => onUpdateSlide({ ...slide, bgGradientEnd: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-neutral-300"
                  />
                  <input
                    type="text"
                    id="design-gradient-end-text"
                    value={slide.bgGradientEnd || '#311042'}
                    onChange={(e) => onUpdateSlide({ ...slide, bgGradientEnd: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded px-1 text-[10px] font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typography colors (Text color + Accent Color) */}
        <div className="grid grid-cols-2 gap-2 pt-1.5">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">Text Color</span>
            <div className="flex items-center space-x-1">
              <input
                type="color"
                id="design-color-text"
                value={slide.textColor.startsWith('#') && slide.textColor.length === 7 ? slide.textColor : '#ffffff'}
                onChange={(e) => onUpdateSlide({ ...slide, textColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-neutral-300"
              />
              <input
                type="text"
                id="design-text-color-text"
                value={slide.textColor}
                onChange={(e) => onUpdateSlide({ ...slide, textColor: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-[10px] font-mono text-center"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">Accent Color</span>
            <div className="flex items-center space-x-1">
              <input
                type="color"
                id="design-color-accent"
                value={slide.accentColor.startsWith('#') && slide.accentColor.length === 7 ? slide.accentColor : '#38bdf8'}
                onChange={(e) => onUpdateSlide({ ...slide, accentColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-neutral-300"
              />
              <input
                type="text"
                id="design-text-color-accent"
                value={slide.accentColor}
                onChange={(e) => onUpdateSlide({ ...slide, accentColor: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-[10px] font-mono text-center"
              />
            </div>
          </div>
        </div>

        {/* Accent Color Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1 justify-between">
          <span className="text-[10px] text-neutral-400 font-medium">Quick Accents:</span>
          <div className="flex space-x-1">
            {PRESET_ACCENTS.map(preset => (
              <button
                key={preset.hex}
                type="button"
                id={`preset-accent-${preset.name}`}
                onClick={() => onUpdateSlide({ ...slide, accentColor: preset.hex })}
                className="w-5 h-5 rounded border border-neutral-200 cursor-pointer"
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 5: Slide Transitions */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-500" />
          <span>Entering Transition</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { id: 'fade', name: 'Ambient Fade' },
            { id: 'slide-x', name: 'Horizontal Slide' },
            { id: 'slide-y', name: 'Vertical Slide' },
            { id: 'zoom', name: 'Cinematic Zoom' },
            { id: 'none', name: 'Instant Swap' },
          ] as { id: SlideTransition; name: string }[]).map(transOpt => (
            <button
              key={transOpt.id}
              id={`design-transition-opt-${transOpt.id}`}
              onClick={() => onUpdateSlide({ ...slide, transition: transOpt.id })}
              className={`p-1.5 rounded-md border text-[11px] text-left transition font-semibold ${
                slide.transition === transOpt.id 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
              }`}
            >
              {transOpt.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 6: Slide Notes */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>Presenter Guidelines</span>
        </label>
        <textarea
          id="editor-slide-notes"
          value={slide.notes || ''}
          onChange={(e) => onUpdateSlide({ ...slide, notes: e.target.value })}
          rows={3}
          className="w-full bg-white border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-neutral-800 leading-relaxed font-sans placeholder-neutral-400"
          placeholder="Notes here are ONLY visible in the Presenter HUD split pane during full screen presentation mode..."
        />
      </div>

    </div>
  );
}
