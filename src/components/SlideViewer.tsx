/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Slide, FontFamily } from '../types';

interface SlideViewerProps {
  slide: Slide;
  scale?: number; // Optional scaling multiplier for mini preview slots
  isPreview?: boolean; // If true, disable scrollbars/editable interfaces
}

export const getFontClass = (font: FontFamily): string => {
  switch (font) {
    case 'display':
      return 'font-display tracking-tight';
    case 'serif':
      return 'font-serif';
    case 'mono':
      return 'font-mono tracking-normal';
    case 'sans':
    default:
      return 'font-sans';
  }
};

export default function SlideViewer({ slide, scale = 1, isPreview = false }: SlideViewerProps) {
  const fontClass = getFontClass(slide.fontFamily);

  // Background styling calculation
  const getBackgroundStyle = (): React.CSSProperties => {
    if (slide.bgType === 'gradient' && slide.bgGradientStart && slide.bgGradientEnd) {
      return {
        background: `linear-gradient(135deg, ${slide.bgGradientStart}, ${slide.bgGradientEnd})`,
        color: slide.textColor,
      };
    }
    return {
      backgroundColor: slide.bgColor,
      color: slide.textColor,
    };
  };

  // Render text helper to handle carriage returns/simple line breaks
  const formatText = (text: string) => {
    if (!text) return '';
    return text.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  // Rendering distinct slide templates
  const renderLayoutContent = () => {
    switch (slide.layout) {
      case 'cover':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center px-12 md:px-20 select-none">
            <h1 
              style={{ fontSize: `${4 * scale}rem`, lineHeight: 1.15 }} 
              className={`font-extrabold tracking-tight mb-4 ${fontClass}`}
            >
              {slide.title || 'Click to set title'}
            </h1>
            {slide.subtitle && (
              <p 
                style={{ fontSize: `${1.6 * scale}rem`, opacity: 0.85 }} 
                className={`font-light max-w-3xl ${fontClass}`}
              >
                {slide.subtitle}
              </p>
            )}
            <div 
              style={{ width: `${60 * scale}px`, height: `${4 * scale}px`, backgroundColor: slide.accentColor }} 
              className="mt-8 rounded-full"
            />
          </div>
        );

      case 'two-column':
        return (
          <div className="flex flex-col justify-between h-full p-10 md:p-14 select-none">
            {/* Slide Header */}
            <div>
              <h2 
                style={{ fontSize: `${2.5 * scale}rem`, borderLeft: `8px solid ${slide.accentColor}` }}
                className={`font-bold pl-4 leading-tight mb-2 ${fontClass}`}
              >
                {slide.title || 'Two Column Header'}
              </h2>
              {slide.subtitle && (
                <p style={{ fontSize: `${1.1 * scale}rem`, opacity: 0.75 }} className={`font-medium pl-4 ${fontClass}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Column Body Grid */}
            <div className="grid grid-cols-2 gap-10 mt-6 flex-1 overflow-hidden">
              <div 
                style={{ fontSize: `${1.05 * scale}rem` }} 
                className={`overflow-hidden text-ellipsis ${fontClass} leading-relaxed opacity-95`}
              >
                {formatText(slide.leftColumn || '### Column 1\nAdd details on the left.')}
              </div>
              <div 
                style={{ fontSize: `${1.05 * scale}rem` }} 
                className={`overflow-hidden text-ellipsis ${fontClass} leading-relaxed opacity-95`}
              >
                {formatText(slide.rightColumn || '### Column 2\nAdd details on the right.')}
              </div>
            </div>
          </div>
        );

      case 'three-column':
        return (
          <div className="flex flex-col justify-between h-full p-10 md:p-14 select-none">
            {/* Header */}
            <div>
              <h2 
                style={{ fontSize: `${2.4 * scale}rem`, borderLeft: `8px solid ${slide.accentColor}` }}
                className={`font-bold pl-4 leading-tight mb-2 ${fontClass}`}
              >
                {slide.title || 'Three Column Layout'}
              </h2>
              {slide.subtitle && (
                <p style={{ fontSize: `${1.05 * scale}rem`, opacity: 0.75 }} className={`font-medium pl-4 ${fontClass}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Card Column Grid */}
            <div className="grid grid-cols-3 gap-6 mt-6 flex-1 overflow-hidden">
              <div 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  borderTop: `4px solid ${slide.accentColor}`,
                  borderRadius: `${8 * scale}px`,
                  padding: `${16 * scale}px`
                }} 
                className="overflow-hidden text-ellipsis flex flex-col justify-start"
              >
                <div style={{ fontSize: `${0.95 * scale}rem` }} className={`${fontClass}`}>
                  {formatText(slide.leftColumn || '### Feature 1\nDetails.')}
                </div>
              </div>
              
              <div 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  borderTop: `4px solid ${slide.accentColor}`,
                  borderRadius: `${8 * scale}px`,
                  padding: `${16 * scale}px`
                }} 
                className="overflow-hidden text-ellipsis flex flex-col justify-start"
              >
                <div style={{ fontSize: `${0.95 * scale}rem` }} className={`${fontClass}`}>
                  {formatText(slide.rightColumn || '### Feature 2\nDetails.')}
                </div>
              </div>

              <div 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  borderTop: `4px solid ${slide.accentColor}`,
                  borderRadius: `${8 * scale}px`,
                  padding: `${16 * scale}px`
                }} 
                className="overflow-hidden text-ellipsis flex flex-col justify-start"
              >
                <div style={{ fontSize: `${0.95 * scale}rem` }} className={`${fontClass}`}>
                  {formatText(slide.thirdColumn || '### Feature 3\nDetails.')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'big-stat':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center px-10 md:px-24 select-none">
            {slide.title && (
              <h3 
                style={{ fontSize: `${1.4 * scale}rem`, opacity: 0.8 }} 
                className={`font-semibold tracking-wide uppercase mb-4 ${fontClass}`}
              >
                {slide.title}
              </h3>
            )}
            
            <div 
              style={{ fontSize: `${7 * scale}rem`, color: slide.accentColor }} 
              className={`font-black tracking-tighter leading-none mb-6 ${fontClass}`}
            >
              {slide.statValue || '100%'}
            </div>

            {slide.statLabel && (
              <p 
                style={{ fontSize: `${1.3 * scale}rem`, opacity: 0.95 }} 
                className={`font-medium max-w-4xl tracking-tight leading-relaxed ${fontClass}`}
              >
                {slide.statLabel}
              </p>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center px-14 md:px-28 select-none">
            <div 
              style={{ fontSize: `${4 * scale}rem`, color: slide.accentColor, opacity: 0.6 }} 
              className="font-serif leading-none mb-2"
            >
              “
            </div>
            
            <blockquote 
              style={{ fontSize: `${1.8 * scale}rem`, lineHeight: 1.4 }} 
              className={`font-normal tracking-tight max-w-4xl italic mb-6 ${fontClass}`}
            >
              {slide.quoteText || 'A masterpiece is complete not when there is nothing left to add, but when there is nothing left to take away.'}
            </blockquote>

            {slide.quoteAuthor && (
              <cite 
                style={{ fontSize: `${1.1 * scale}rem`, color: slide.accentColor }} 
                className={`not-italic font-bold tracking-wide uppercase ${fontClass}`}
              >
                — {slide.quoteAuthor}
              </cite>
            )}
          </div>
        );

      case 'header-text':
      default:
        return (
          <div className="flex flex-col justify-between h-full p-10 md:p-14 select-none">
            {/* Header section with accent line */}
            <div>
              <h2 
                style={{ fontSize: `${2.6 * scale}rem`, borderLeft: `8px solid ${slide.accentColor}` }}
                className={`font-bold pl-4 leading-none mb-2 ${fontClass}`}
              >
                {slide.title || 'Untitled Slide'}
              </h2>
              {slide.subtitle && (
                <p style={{ fontSize: `${1.1 * scale}rem`, opacity: 0.75 }} className={`font-medium pl-4 ${fontClass}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Split Content: Body Left, Bullet points right (custom responsive balance) */}
            <div className="grid grid-cols-5 gap-10 mt-6 flex-1 overflow-hidden items-start">
              <div 
                style={{ fontSize: `${1.1 * scale}rem` }} 
                className={`col-span-3 leading-relaxed opacity-95 overflow-hidden text-ellipsis ${fontClass}`}
              >
                {formatText(slide.body)}
              </div>
              
              {/* Bullet Points block */}
              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                <div className="col-span-2 space-y-4">
                  {slide.bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <span 
                        style={{ color: slide.accentColor, fontSize: `${1.2 * scale}rem`, marginRight: `${10 * scale}px` }} 
                        className="font-bold flex-shrink-0"
                      >
                        ◆
                      </span>
                      <p 
                        style={{ fontSize: `${1.05 * scale}rem` }} 
                        className={`leading-normal opacity-90 ${fontClass}`}
                      >
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="slide-ratio-container w-full h-full shadow-2xl transition-all duration-3 border border-neutral-200/10 rounded-lg select-none flex flex-col justify-between"
      style={{ ...getBackgroundStyle() }}
    >
      {/* Visual background overlays based on template/theme types */}
      {slide.bgType === 'minimal' && (
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
      )}
      {slide.bgType === 'dark' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      )}

      {/* Render layouts */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {renderLayoutContent()}
      </div>

      {/* Minor slide tracker watermark (extremely clean) */}
      <div 
        style={{ fontSize: `${0.7 * scale}rem`, opacity: 0.35, padding: `${10 * scale}px` }} 
        className={`absolute bottom-0 right-0 font-mono select-none px-4 z-20`}
      >
        In-Browser Presentation App
      </div>
    </div>
  );
}
