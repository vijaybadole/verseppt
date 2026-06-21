/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Presentation, Slide, SlideTransition } from '../types';
import SlideViewer from './SlideViewer';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Sparkles, FileText, LayoutGrid, HelpCircle, Eye
} from 'lucide-react';

interface PresentationControllerProps {
  presentation: Presentation;
  startSlideIndex?: number;
  onClose: () => void;
}

export default function PresentationController({ presentation, startSlideIndex = 0, onClose }: PresentationControllerProps) {
  const [currentIndex, setCurrentIndex] = useState(startSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  
  // Timer states
  const [timerRunning, setTimerRunning] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Full slide drawer / grid selector
  const [showSlideDrawer, setShowSlideDrawer] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide: Slide = presentation.slides[currentIndex] || presentation.slides[0];
  const nextSlide: Slide | undefined = presentation.slides[currentIndex + 1];

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Request actual full screen on enter (optional helper, behaves nicely if allowed)
  useEffect(() => {
    const handleFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        // Iframe environment might prevent actual fullscreen sometimes, which is expected
        console.warn('Fullscreen entry declined/not supported in iframe context:', err);
      }
    };
    handleFullscreen();

    // Cleanup fullscreen exit on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'PageUp':
          e.preventDefault();
          handleBack();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentIndex(presentation.slides.length - 1);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setShowNotes(prev => !prev);
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setLaserActive(prev => !prev);
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, presentation.slides.length, onClose]);

  // Mouse moves for laser pointer tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleNext = () => {
    if (currentIndex < presentation.slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Switch transition variants based on slide settings
  const getTransitionVariants = (type: SlideTransition) => {
    switch (type) {
      case 'slide-x':
        return {
          initial: { opacity: 0, x: 200 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -200 },
        };
      case 'slide-y':
        return {
          initial: { opacity: 0, y: 150 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -150 },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.92 },
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const transitionVar = getTransitionVariants(activeSlide.transition);

  return (
    <div 
      ref={containerRef}
      id="presentation-presenter-hud"
      className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col font-sans select-none overflow-hidden"
    >
      {/* Top action status panel */}
      <header className="h-14 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <span className="text-xs bg-indigo-500/20 text-indigo-400 font-semibold px-2.5 py-1 rounded-md border border-indigo-500/30">
            PRESENTATION LIVE
          </span>
          <h2 className="text-sm font-bold text-neutral-200 truncate max-w-sm tracking-tight">
            {presentation.title}
          </h2>
        </div>

        {/* Stopwatch state, Laser pointer, & Help HUD toggle */}
        <div className="flex items-center space-x-4">
          {/* Presentation Timer Controls */}
          <div className="flex items-center space-x-2 bg-neutral-950/80 border border-neutral-800 px-3 py-1 rounded-lg">
            <span className="font-mono text-sm font-medium text-emerald-400">
              {formatTime(secondsElapsed)}
            </span>
            <button 
              id="hud-timer-toggle"
              onClick={() => setTimerRunning(!timerRunning)} 
              className="text-neutral-400 hover:text-white transition"
              title={timerRunning ? "Pause stopwatch" : "Start stopwatch"}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button 
              id="hud-timer-reset"
              onClick={() => setSecondsElapsed(0)} 
              className="text-neutral-400 hover:text-white transition"
              title="Reset stopwatch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Helpers */}
          <button
            id="hud-laser-pointer-btn"
            onClick={() => setLaserActive(!laserActive)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
              laserActive 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]' 
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
            title="L to toggle laser pointer tool"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laser Pointer {laserActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="hud-toggle-notes-btn"
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
              showNotes 
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/40' 
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
            title="N to toggle presenter layout"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Presenter Notes</span>
          </button>

          <button
            id="hud-slides-drawer-btn"
            onClick={() => setShowSlideDrawer(prev => !prev)}
            className={`p-1.5 rounded-lg border transition ${showSlideDrawer ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}
            title="All slides view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            id="hud-shortcuts-help-btn"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className={`p-1.5 rounded-lg border transition ${showShortcutsHelp ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}
            title="Shortcuts guide (H)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button 
            id="hud-exit-presentation-btn"
            onClick={onClose} 
            className="bg-rose-600/90 hover:bg-rose-600 border border-rose-500/30 text-white font-bold p-1.5 rounded-lg ml-2 hover:scale-105 transition active:scale-95"
            title="Escape to close presentation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main viewport block */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Slide containment and mouse event tracking */}
        <div 
          className="flex-1 flex items-center justify-center bg-neutral-950 p-8 relative cursor-none"
          onMouseMove={handleMouseMove}
          onClick={(e) => {
            // Click right half to go next, left half to go back
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX > rect.width * 0.7) {
              handleNext();
            } else if (clickX < rect.width * 0.3) {
              handleBack();
            }
          }}
        >
          {/* Laser visual ring element */}
          {laserActive && (
            <div 
              style={{ 
                left: laserPos.x, 
                top: laserPos.y,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-none z-50 transition-all duration-75 mix-blend-screen"
            >
              <div className="w-5 h-5 bg-rose-500 rounded-full animate-ping opacity-75" />
              <div className="absolute inset-1 w-3 h-3 bg-rose-600 border border-white rounded-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            </div>
          )}

          {/* Render Slide surface fitted and centered */}
          <div className="w-full max-w-5xl aspect-video rounded-xl shadow-2xl relative bg-neutral-900 border border-neutral-800 overflow-hidden transform transition duration-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                variants={transitionVar}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: activeSlide.transition === 'none' ? 0 : 0.35 }}
                className="w-full h-full"
              >
                <SlideViewer slide={activeSlide} isPreview={true} scale={1.0} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick float action tabs */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-neutral-900/90 border border-neutral-800 rounded-full p-1.5 shadow-2xl backdrop-blur-md opacity-20 hover:opacity-100 transition duration-300 z-30">
            <button
              id="hud-slide-prev-floating"
              disabled={currentIndex === 0}
              onClick={(e) => { e.stopPropagation(); handleBack(); }}
              className="p-1 px-2.5 rounded-full hover:bg-neutral-800 disabled:opacity-40 transition text-sm flex items-center space-x-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="text-xs font-mono px-3 border-x border-neutral-800 text-neutral-400">
              {currentIndex + 1} / {presentation.slides.length}
            </div>
            <button
              id="hud-slide-next-floating"
              disabled={currentIndex === presentation.slides.length - 1}
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="p-1 px-2.5 rounded-full hover:bg-neutral-800 disabled:opacity-40 transition text-sm flex items-center space-x-1 font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presenter Split-HUD Bar (Notes + Up next slide preview) */}
        <AnimatePresence>
          {showNotes && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '360px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="bg-neutral-900 border-l border-neutral-800 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Presenter Dashboard</span>
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Slide {currentIndex + 1} of {presentation.slides.length}
                </span>
              </div>

              {/* Presenter Notes */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Current Slide Notes
                  </h4>
                  <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                    {activeSlide.notes ? (
                      activeSlide.notes
                    ) : (
                      <span className="italic text-neutral-500 text-xs">No notes provided for this slide. Write them under the Edit view!</span>
                    )}
                  </div>
                </div>

                {/* Up Next Preview Panel */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Up Next Slide
                  </h4>
                  {nextSlide ? (
                    <div className="space-y-2">
                      <div className="bg-neutral-950/80 rounded-xl p-3 border border-neutral-800 space-y-1">
                        <div className="text-xs font-bold text-neutral-100 truncate">
                          {nextSlide.title || 'Untitled Slide'}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          Layout: {nextSlide.layout} • Transition: {nextSlide.transition}
                        </div>
                      </div>
                      <div className="slide-ratio-container w-full rounded-lg overflow-hidden border border-neutral-800 select-none opacity-40">
                        <SlideViewer slide={nextSlide} isPreview={true} scale={0.3} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800 text-xs text-neutral-500">
                      End of Presentation
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex justify-between items-center">
                <span>Timer running</span>
                <span>Press N to close panel</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar indicator */}
      <div className="h-1 bg-neutral-800 w-full relative z-30">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / presentation.slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Navigator Modal overlay */}
      <AnimatePresence>
        {showSlideDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-1.5 inset-x-1.5 z-50 bg-neutral-900/95 border border-neutral-800 rounded-xl shadow-2xl p-4 backdrop-blur-lg flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Jump Direct to Slide</span>
              </span>
              <button 
                id="hud-close-slide-drawer-btn"
                onClick={() => setShowSlideDrawer(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Micro Scroll View of Slides */}
            <div className="flex items-center space-x-4 overflow-x-auto py-2.5 px-1 scrollbar-thin">
              {presentation.slides.map((slide, ind) => (
                <button
                  key={slide.id}
                  id={`hud-drawer-slide-select-${slide.id}`}
                  onClick={() => {
                    setCurrentIndex(ind);
                    setShowSlideDrawer(false);
                  }}
                  className={`flex-shrink-0 w-36 rounded-lg overflow-hidden text-left transition transform hover:scale-105 active:scale-95 border-2 ${
                    currentIndex === ind 
                      ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] scale-102' 
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="relative aspect-video scale-100 bg-neutral-950 overflow-hidden">
                    <SlideViewer slide={slide} isPreview={true} scale={0.16} />
                    <div className="absolute top-1 left-2 bg-neutral-950/80 rounded-md text-[9px] font-bold px-1.5 py-0.5 text-neutral-300">
                      {ind + 1}
                    </div>
                  </div>
                  <div className="bg-neutral-950 p-1.5 text-[10px] truncate text-neutral-400 text-center font-semibold">
                    {slide.title || `Slide ${ind + 1}`}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Guide Modal popup */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                id="hud-close-help-btn"
                onClick={() => setShowShortcutsHelp(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg p-1 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Presenter Hotkeys</span>
              </h3>

              <div className="space-y-3.5 text-sm text-neutral-300">
                <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                  <span>Next Slide</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Arrow Right</kbd>
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Space</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                  <span>Previous Slide</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Arrow Left</kbd>
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Backspace</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                  <span>Toggle HUD Notes Panel</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">N</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                  <span>Toggle Laser Pointer Tool</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">L</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800/60 pb-2">
                  <span>Jump to First/Last Slide</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Home</kbd>
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">End</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span>Exit Presentation Mode</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white">Esc</kbd>
                </div>
              </div>

              <button
                id="hud-close-help-confirm-btn"
                onClick={() => setShowShortcutsHelp(false)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
