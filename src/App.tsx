/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Presentation, Slide, PresentationTheme } from './types';
import { DEFAULT_PRESENTATION, BLANK_SLIDE_TEMPLATE } from './data';
import SlideViewer from './components/SlideViewer';
import DesignSettings from './components/DesignSettings';
import ContentSettings from './components/ContentSettings';
import PresentationController from './components/PresentationController';
import { 
  Play, Plus, Copy, Trash2, ArrowUp, ArrowDown, Download, 
  Upload, Sparkles, Sliders, Type, FileEdit, PlusCircle, FolderHeart, FolderClosed, RefreshCw
} from 'lucide-react';

const STORAGE_KEY = 'scribe_presentations_collection';

export default function App() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [activePresId, setActivePresId] = useState<string>('demo-presentation');
  const [activeSlideId, setActiveSlideId] = useState<string>('slide-1');
  const [presentMode, setPresentMode] = useState<boolean>(false);
  const [rightTab, setRightTab] = useState<'content' | 'design'>('content');
  const [importError, setImportError] = useState<string | null>(null);

  // File Upload input pointer
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loaded: Presentation[] = JSON.parse(stored);
        if (loaded && loaded.length > 0) {
          setPresentations(loaded);
          setActivePresId(loaded[0].id);
          if (loaded[0].slides && loaded[0].slides.length > 0) {
            setActiveSlideId(loaded[0].slides[0].id);
          }
          return;
        }
      }
    } catch (e) {
      console.error('Failed reading localStorage presentations:', e);
    }
    // Fallback seed
    setPresentations([DEFAULT_PRESENTATION]);
    setActivePresId(DEFAULT_PRESENTATION.id);
    setActiveSlideId(DEFAULT_PRESENTATION.slides[0].id);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (presentations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
    }
  }, [presentations]);

  // Safe navigation properties
  const activePres = presentations.find(p => p.id === activePresId) || presentations[0];
  const activeSlideIndex = activePres?.slides.findIndex(s => s.id === activeSlideId) ?? 0;
  const activeSlide = activePres?.slides[activeSlideIndex] || activePres?.slides[0];

  // If slide was somehow lost, re-anchor
  useEffect(() => {
    if (activePres && (!activeSlide || !activePres.slides.some(s => s.id === activeSlideId))) {
      if (activePres.slides.length > 0) {
        setActiveSlideId(activePres.slides[0].id);
      }
    }
  }, [activePresId, activePres, activeSlide, activeSlideId]);

  // Edit current presentation attributes
  const updateActivePresTitle = (newTitle: string) => {
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        return { ...p, title: newTitle, updatedAt: Date.now() };
      }
      return p;
    }));
  };

  const updateActivePresDesc = (desc: string) => {
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        return { ...p, description: desc, updatedAt: Date.now() };
      }
      return p;
    }));
  };

  // Edit slide attributes in place
  const handleUpdateSlide = (updatedSlide: Slide) => {
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const updatedSlides = p.slides.map(s => s.id === updatedSlide.id ? updatedSlide : s);
        return { ...p, slides: updatedSlides, updatedAt: Date.now() };
      }
      return p;
    }));
  };

  // Apply visual theme settings to ALL slides in deck
  const handleApplyThemeToAll = (theme: PresentationTheme) => {
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const updatedSlides = p.slides.map(s => ({
          ...s,
          fontFamily: theme.fontFamily,
          bgType: theme.bgType,
          bgColor: theme.bgColor,
          bgGradientStart: theme.bgGradientStart,
          bgGradientEnd: theme.bgGradientEnd,
          textColor: theme.textColor,
          accentColor: theme.accentColor,
        }));
        return { ...p, slides: updatedSlides, updatedAt: Date.now() };
      }
      return p;
    }));
  };

  // Create presentation blank template
  const handleCreateNewPresentation = () => {
    const id = `pres-${Date.now()}`;
    const newPres: Presentation = {
      id,
      title: 'New Presentation Project',
      description: 'A clean document created inside Scribe Dynamic Presentation builder.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      slides: [
        {
          id: `slide-${Date.now()}-1`,
          title: 'Welcome to Scribe Deck',
          subtitle: 'An Elegant In-Browser Presentation Slide',
          body: 'This is your first blank slide. Double click parameters on the right properties pane to customize styling, layout structures, bullets, quotes, and comparative multi-columns.',
          bulletPoints: [
            'Click the + symbol to append additional slides',
            'Press the play presenting button on top to slide show fullscreen!'
          ],
          leftColumn: '',
          rightColumn: '',
          layout: 'cover',
          bgType: 'gradient',
          bgColor: '#0f172a',
          bgGradientStart: '#1e1b4b',
          bgGradientEnd: '#0f172a',
          textColor: '#f8fafc',
          accentColor: '#38bdf8',
          fontFamily: 'display',
          transition: 'fade',
          notes: 'Cover notes here.',
        }
      ]
    };
    setPresentations(prev => [newPres, ...prev]);
    setActivePresId(id);
    setActiveSlideId(newPres.slides[0].id);
  };

  // Duplicate entire current presentation doc
  const handleDuplicatePresentation = () => {
    if (!activePres) return;
    const id = `pres-${Date.now()}`;
    const duplicate: Presentation = {
      ...activePres,
      id,
      title: `${activePres.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      slides: activePres.slides.map(s => ({ ...s, id: `slide-dup-${Math.floor(Math.random() * 100000)}-${Date.now()}` })),
    };
    setPresentations(prev => [duplicate, ...prev]);
    setActivePresId(id);
    setActiveSlideId(duplicate.slides[0].id);
  };

  // Delete current presentation document
  const handleDeletePresentation = () => {
    if (presentations.length <= 1) {
      alert('Keep at least one active presentation stored inside Scribe!');
      return;
    }
    const filtered = presentations.filter(p => p.id !== activePresId);
    setPresentations(filtered);
    setActivePresId(filtered[0].id);
    setActiveSlideId(filtered[0].slides[0].id);
  };

  // Save changes locally and reset to demo state layout
  const handleResetToDemo = () => {
    if (window.confirm('Do you really want to reload the interactive Design Guide deck? All custom changes there will be reset.')) {
      const filtered = presentations.filter(p => p.id !== DEFAULT_PRESENTATION.id);
      setPresentations([DEFAULT_PRESENTATION, ...filtered]);
      setActivePresId(DEFAULT_PRESENTATION.id);
      setActiveSlideId(DEFAULT_PRESENTATION.slides[0].id);
    }
  };

  // Add a blank slide cleanly below active slide
  const handleAddSlide = () => {
    if (!activePres) return;
    const count = activePres.slides.length;
    const prevSlide = activePres.slides[activeSlideIndex];
    
    // Copy background styling, accent color, text color, and layout fonts from previous slide for design continuation
    const newSlide: Slide = {
      ...BLANK_SLIDE_TEMPLATE(count + 1),
      bgType: prevSlide?.bgType || 'solid',
      bgColor: prevSlide?.bgColor || '#0f172a',
      bgGradientStart: prevSlide?.bgGradientStart,
      bgGradientEnd: prevSlide?.bgGradientEnd,
      textColor: prevSlide?.textColor || '#f8fafc',
      accentColor: prevSlide?.accentColor || '#38bdf8',
      fontFamily: prevSlide?.fontFamily || 'sans',
      transition: prevSlide?.transition || 'fade',
    };

    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const updatedSlides = [...p.slides];
        // Insert directly under active slide
        updatedSlides.splice(activeSlideIndex + 1, 0, newSlide);
        return { ...p, slides: updatedSlides, updatedAt: Date.now() };
      }
      return p;
    }));
    setActiveSlideId(newSlide.id);
  };

  // Duplicate current active slide
  const handleDuplicateSlide = (slideId: string) => {
    if (!activePres) return;
    const targetIdx = activePres.slides.findIndex(s => s.id === slideId);
    if (targetIdx === -1) return;
    const source = activePres.slides[targetIdx];
    const clone: Slide = {
      ...source,
      id: `slide-cloned-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      title: `${source.title} (Clone)`,
    };

    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const updatedSlides = [...p.slides];
        updatedSlides.splice(targetIdx + 1, 0, clone);
        return { ...p, slides: updatedSlides, updatedAt: Date.now() };
      }
      return p;
    }));
    setActiveSlideId(clone.id);
  };

  // Delete target slide from presentation
  const handleDeleteSlide = (slideId: string) => {
    if (!activePres) return;
    if (activePres.slides.length <= 1) {
      alert('Your presentation must contain at least one single slide!');
      return;
    }
    
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const filtered = p.slides.filter(s => s.id !== slideId);
        return { ...p, slides: filtered, updatedAt: Date.now() };
      }
      return p;
    }));

    // Re-anchor if the active slide was the deleted one
    if (activeSlideId === slideId) {
      const prevIdx = activePres.slides.findIndex(s => s.id === slideId);
      const nextActiveIdx = prevIdx === 0 ? 1 : prevIdx - 1;
      setActiveSlideId(activePres.slides[nextActiveIdx].id);
    }
  };

  // Reorder slide lists
  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    if (!activePres) return;
    const idx = activePres.slides.findIndex(s => s.id === slideId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === activePres.slides.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    
    setPresentations(prev => prev.map(p => {
      if (p.id === activePresId) {
        const swapedSlides = [...p.slides];
        const temp = swapedSlides[idx];
        swapedSlides[idx] = swapedSlides[targetIdx];
        swapedSlides[targetIdx] = temp;
        return { ...p, slides: swapedSlides, updatedAt: Date.now() };
      }
      return p;
    }));
  };

  // Export current presentation to standard local JSON file
  const handleExportPresentation = () => {
    if (!activePres) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activePres, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    // Create clean file name based on deck title
    const filename = `${activePres.title.toLowerCase().replace(/\s+/g, '_')}_presentation.json`;
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import presentation file and load it as active
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        setImportError(null);
        const json = JSON.parse(event.target?.result as string);
        
        // Simple structure validation
        if (json && typeof json === 'object' && Array.isArray(json.slides)) {
          const importedPres: Presentation = {
            id: json.id || `pres-imported-${Date.now()}`,
            title: json.title || 'Imported Presentation',
            description: json.description || 'Imported via JSON file upload.',
            createdAt: json.createdAt || Date.now(),
            updatedAt: Date.now(),
            slides: json.slides,
          };

          setPresentations(prev => [importedPres, ...prev.filter(p => p.id !== importedPres.id)]);
          setActivePresId(importedPres.id);
          if (importedPres.slides.length > 0) {
            setActiveSlideId(importedPres.slides[0].id);
          }
        } else {
          setImportError('Invalid JSON structure: Uploaded JSON must declare a slides array.');
        }
      } catch (err) {
        setImportError('Failed parsing file. Please make sure the file is a legal JSON presentation format.');
      }
    };
    fileReader.readAsText(file);
    // Reset file input target
    e.target.value = '';
  };

  if (!activePres) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50 p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-800">Initializing slides context...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden h-screen">
      
      {/* 1. Global application header navigation */}
      <header className="h-[64px] bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-sm">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-lg p-2 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-black text-neutral-900 tracking-tight leading-none uppercase">Scribe</span>
              <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider">Dynamic Deck</span>
            </div>
          </div>

          {/* Presentation select options */}
          <div className="flex items-center space-x-2 border-l border-neutral-200 pl-4">
            <div className="relative">
              <select
                id="doc-selector-dropdown"
                value={activePresId}
                onChange={(e) => {
                  setActivePresId(e.target.value);
                  const selected = presentations.find(p => p.id === e.target.value);
                  if (selected && selected.slides.length > 0) {
                    setActiveSlideId(selected.slides[0].id);
                  }
                }}
                className="bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-xs pr-8 appearance-none cursor-pointer hover:bg-neutral-100 transition"
              >
                {presentations.map(p => (
                  <option key={p.id} value={p.id}>
                    Folder: {p.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>

            <button
              id="header-create-pres-btn"
              onClick={handleCreateNewPresentation}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1"
              title="Start brand new presentation"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Deck</span>
            </button>

            <button
              id="header-duplicate-pres-btn"
              onClick={handleDuplicatePresentation}
              className="text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 p-1.5 rounded-lg transition"
              title="Duplicate current project file"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              id="header-delete-pres-btn"
              onClick={handleDeletePresentation}
              className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
              title="Trash current deck document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              id="header-reload-guide-btn"
              onClick={handleResetToDemo}
              className="bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-neutral-200/80 transition"
              title="Reload Interactive Slide Design Guide"
            >
              Reset Guide
            </button>
          </div>
        </div>

        {/* Action HUD buttons */}
        <div className="flex items-center space-x-3">
          {/* File input invisible tracker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            id="action-import-btn"
            onClick={handleImportClick}
            className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5"
            title="Load .json deck file"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-500" />
            <span>Import JSON</span>
          </button>

          <button
            id="action-export-btn"
            onClick={handleExportPresentation}
            className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5"
            title="Download this presentation project file as JSON"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export JSON</span>
          </button>

          <button
            id="action-present-fullscreen-btn"
            onClick={() => setPresentMode(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-md shadow-indigo-500/10 hover:scale-103 active:scale-97"
            title="Enter full screen presenter screen"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Show (Fullscreen)</span>
          </button>
        </div>
      </header>

      {/* Main 3-Section workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDE BAR 1: Left thumbnails list sequence */}
        <aside id="slide-sequence-sidebar" className="w-[195px] bg-white border-r border-neutral-200 flex flex-col shrink-0 select-none">
          {/* Section banner */}
          <div className="p-3 bg-neutral-50/50 border-b border-neutral-200/80 flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Slides Sequence ({activePres.slides.length})
            </span>
            <button
              id="sidebar-add-slide-mini"
              onClick={handleAddSlide}
              className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition"
              title="Add a slide (Below selected)"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Scrolling Slides previews list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {activePres.slides.map((slide, ind) => (
              <div 
                key={slide.id}
                id={`sidebar-slide-selector-${slide.id}`}
                className="group relative flex flex-col space-y-1"
              >
                {/* Visual wrapper for card selection */}
                <button
                  onClick={() => setActiveSlideId(slide.id)}
                  className={`relative w-full rounded-lg overflow-hidden border-2 text-left transition transform duration-200 ${
                    activeSlideId === slide.id 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/10' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {/* Micro Slide view inside 16/9 aspect slot */}
                  <div className="w-full bg-neutral-950/20 aspect-video relative overflow-hidden pointer-events-none select-none">
                    <SlideViewer slide={slide} isPreview={true} scale={0.16} />
                  </div>
                </button>

                {/* Info and individual slide control actions */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-extrabold text-neutral-400">
                    #{ind + 1}
                  </span>
                  
                  {/* Micro actions inside sidebar hover or select trigger */}
                  <div className="flex space-x-0.5 opacity-90 group-hover:opacity-100 transition">
                    <button
                      id={`sidebar-moveup-slide-${slide.id}`}
                      disabled={ind === 0}
                      onClick={() => handleMoveSlide(slide.id, 'up')}
                      className="p-0.5 rounded text-neutral-400 hover:text-neutral-800 disabled:opacity-20 hover:bg-neutral-100"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      id={`sidebar-movedown-slide-${slide.id}`}
                      disabled={ind === activePres.slides.length - 1}
                      onClick={() => handleMoveSlide(slide.id, 'down')}
                      className="p-0.5 rounded text-neutral-400 hover:text-neutral-800 disabled:opacity-20 hover:bg-neutral-100"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      id={`sidebar-duplicate-slide-${slide.id}`}
                      onClick={() => handleDuplicateSlide(slide.id)}
                      className="p-0.5 rounded text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
                      title="Duplicate slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      id={`sidebar-delete-slide-${slide.id}`}
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-0.5 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remove slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Large plus slide button at bottom list */}
            <button
              id="sidebar-add-slide-big"
              onClick={handleAddSlide}
              className="w-full flex items-center justify-center p-4 border border-dashed border-neutral-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/20 text-neutral-400 hover:text-indigo-600 transition text-xs font-semibold space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Empty Slide</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE AREA 2: Middle interactive slide zoom view canvas */}
        <main id="editor-viewport-center" className="flex-1 bg-neutral-50 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          
          {/* Quick inline presentation title editor */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-sm space-y-1">
            <div className="flex space-x-4 items-center">
              <span className="text-[10px] bg-neutral-100 text-neutral-500 py-0.5 px-2 rounded-md font-mono font-bold uppercase shrink-0">
                Active Deck
              </span>
              <input
                type="text"
                id="active-pres-title-input"
                value={activePres.title}
                onChange={(e) => updateActivePresTitle(e.target.value)}
                className="text-base font-black text-neutral-900 border-none focus:outline-none focus:ring-1 focus:ring-indigo-500/10 rounded w-full bg-transparent px-1 placeholder-neutral-400"
                placeholder="Name your presentation..."
              />
            </div>
            <input
              type="text"
              id="active-pres-desc-input"
              value={activePres.description}
              onChange={(e) => updateActivePresDesc(e.target.value)}
              className="text-xs text-neutral-400 border-none focus:outline-none focus:ring-1 focus:ring-indigo-500/10 rounded w-full bg-transparent px-1 mt-0.5"
              placeholder="Short deck description tag..."
            />
          </div>

          {/* Import file error feedback */}
          {importError && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              <strong>Import Error: </strong> {importError}
            </div>
          )}

          {/* Large High fidelity visual rendering area */}
          <div className="flex-1 flex items-center justify-center py-4">
            {activeSlide ? (
              <div className="w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-neutral-900 aspect-video transition-all border border-neutral-200/80 relative">
                
                {/* Display active slide parameters inside high-fid framework */}
                <SlideViewer slide={activeSlide} scale={0.9} />
                
                {/* Mini watermark layout status info */}
                <div className="absolute right-3.5 top-3 bg-black/65 text-[10px] text-neutral-300 px-2 py-1 rounded-md font-mono uppercase font-semibold">
                  Template: {activeSlide.layout}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 border-2 border-dashed border-neutral-200 rounded-2xl bg-white max-w-sm">
                <p className="text-sm text-neutral-500">Select or append a slide from the left sequence column to start editing.</p>
              </div>
            )}
          </div>

          {/* Quick instructions/hotkeys banner under slide canvas */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between text-xs text-neutral-500">
            <div className="flex space-x-4 items-center">
              <span className="flex items-center space-x-1.5 font-semibold text-neutral-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Quick Hotkeys:</span>
              </span>
              <span><strong>Start slide show:</strong> Press Present button</span>
              <span>•</span>
              <span><strong>Next in HUD:</strong> Space or Right Arrow</span>
            </div>
            <span className="font-mono text-[10px]">v1.0.0 Stable</span>
          </div>

        </main>

        {/* SIDE BAR 3: Right editor parameter tabs (Design / Text content) */}
        <aside id="slide-properties-sidebar" className="w-[320px] bg-white border-l border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
          
          {/* Tabs toggler */}
          <div className="flex border-b border-neutral-200 p-2 space-x-1 bg-neutral-50/50 sticky top-0 z-10 w-full">
            <button
              id="sidebar-tab-content-btn"
              onClick={() => setRightTab('content')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                rightTab === 'content' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'bg-white hover:bg-neutral-100/70 border border-neutral-200/80 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Edit Content</span>
            </button>
            <button
              id="sidebar-tab-design-btn"
              onClick={() => setRightTab('design')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                rightTab === 'design' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'bg-white hover:bg-neutral-100/70 border border-neutral-200/80 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Style & Cards</span>
            </button>
          </div>

          {/* Embedded configurations forms */}
          <div className="p-4 flex-1">
            {activeSlide ? (
              rightTab === 'content' ? (
                <ContentSettings 
                  slide={activeSlide} 
                  onUpdateSlide={handleUpdateSlide} 
                />
              ) : (
                <DesignSettings 
                  slide={activeSlide} 
                  onUpdateSlide={handleUpdateSlide}
                  onApplyThemeToAll={handleApplyThemeToAll}
                />
              )
            ) : (
              <div className="text-center p-8 italic text-xs text-neutral-400">
                Please select a slide to check property adjustments.
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* 4. Fullscreen Interactive Presentation HUD Player */}
      {presentMode && (
        <PresentationController 
          presentation={activePres} 
          startSlideIndex={activeSlideIndex} 
          onClose={() => setPresentMode(false)} 
        />
      )}

    </div>
  );
}
