/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Slide } from '../types';
import { Plus, Trash, BookOpen, Layers, Type, FileSpreadsheet } from 'lucide-react';

interface ContentSettingsProps {
  slide: Slide;
  onUpdateSlide: (updatedSlide: Slide) => void;
}

export default function ContentSettings({ slide, onUpdateSlide }: ContentSettingsProps) {
  const [newBullet, setNewBullet] = useState('');

  const handleFieldChange = (key: keyof Slide, value: any) => {
    onUpdateSlide({ ...slide, [key]: value });
  };

  const handleAddBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBullet.trim()) return;
    const bulletList = [...(slide.bulletPoints || [])];
    bulletList.push(newBullet.trim());
    handleFieldChange('bulletPoints', bulletList);
    setNewBullet('');
  };

  const handleRemoveBullet = (index: number) => {
    const bulletList = [...(slide.bulletPoints || [])];
    bulletList.splice(index, 1);
    handleFieldChange('bulletPoints', bulletList);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const bulletList = [...(slide.bulletPoints || [])];
    bulletList[index] = val;
    handleFieldChange('bulletPoints', bulletList);
  };

  return (
    <div id="content-settings-sidebar" className="space-y-6 text-neutral-800">
      
      {/* SECTION 1: Titles & Subtitles (Applicable to almost all layouts) */}
      <div className="space-y-3 p-3.5 bg-neutral-50/50 border border-neutral-200/80 rounded-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
          <Type className="w-3.5 h-3.5" />
          <span>Slide Headers</span>
        </span>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-slide-title">
              Main Title
            </label>
            <input
              type="text"
              id="field-slide-title"
              value={slide.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-neutral-800 outline-none"
              placeholder="Enter slide header..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-slide-subtitle">
              Subtitle / Subtitle Tagline
            </label>
            <input
              type="text"
              id="field-slide-subtitle"
              value={slide.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-neutral-800 outline-none"
              placeholder="Tagline or subtitle..."
            />
          </div>
        </div>
      </div>

      <hr className="border-neutral-200/80" />

      {/* SECTION 2: Layout-Specific Multi-fields */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span>Layout-Specific Content</span>
        </span>

        {/* COVER LAYOUT SPECIFIC */}
        {slide.layout === 'cover' && (
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 leading-normal">
            <strong className="block font-semibold mb-1">Cover Slide Active</strong>
            Add a clear, catchy introduction using the header and subtitle boxes above. The background elements and custom accent lines will auto-render below.
          </div>
        )}

        {/* HEADER TEXT & BULLETS SPECIFIC */}
        {slide.layout === 'header-text' && (
          <div className="space-y-4">
            {/* Slide general text */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-slide-body">
                Intro / Narrative Block
              </label>
              <textarea
                id="field-slide-body"
                value={slide.body || ''}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                rows={4}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none focus:border-indigo-500 rounded-lg p-2.5 text-xs text-neutral-800 leading-relaxed font-sans"
                placeholder="Write paragraphs or narrative descriptions here..."
              />
            </div>

            {/* List / Bullets Manager */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-600 uppercase">
                Supporting Bullet Points
              </label>

              {/* List of current Bullet items */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {slide.bulletPoints && slide.bulletPoints.length > 0 ? (
                  slide.bulletPoints.map((bullet, index) => (
                    <div key={index} className="flex space-x-1.5 items-center">
                      <span className="text-[10px] text-neutral-400">#{index+1}</span>
                      <input
                        type="text"
                        id={`field-bullet-edit-${index}`}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(index, e.target.value)}
                        className="flex-1 bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800 outline-none"
                      />
                      <button
                        type="button"
                        id={`btn-remove-bullet-${index}`}
                        onClick={() => handleRemoveBullet(index)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition"
                        title="Delete point"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 border border-dashed border-neutral-200 rounded-lg text-xs text-neutral-400 italic">
                    No bullet points added yet.
                  </div>
                )}
              </div>

              {/* Add Bullet Input */}
              <form onSubmit={handleAddBullet} className="flex space-x-1 pt-1">
                <input
                  type="text"
                  id="field-new-bullet-text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  className="flex-1 bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-lg px-2.5 py-1 text-xs text-neutral-800 outline-none"
                  placeholder="New bullet point text..."
                />
                <button
                  type="submit"
                  id="field-add-bullet-btn"
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-lg px-2.5 flex items-center justify-center transition active:scale-95"
                  title="Add point"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TWO-COLUMN / COMPARISON SPECIFIC */}
        {slide.layout === 'two-column' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-left-column">
                Left Column Text
              </label>
              <textarea
                id="field-left-column"
                value={slide.leftColumn || ''}
                onChange={(e) => handleFieldChange('leftColumn', e.target.value)}
                rows={5}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-neutral-800 leading-relaxed font-sans"
                placeholder="Left side paragraph comparison..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-right-column">
                Right Column Text
              </label>
              <textarea
                id="field-right-column"
                value={slide.rightColumn || ''}
                onChange={(e) => handleFieldChange('rightColumn', e.target.value)}
                rows={5}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-neutral-800 leading-relaxed font-sans"
                placeholder="Right side paragraph comparison..."
              />
            </div>
          </div>
        )}

        {/* THREE-COLUMN LAYOUT SPECIFIC */}
        {slide.layout === 'three-column' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-card-1">
                Column 1 Content
              </label>
              <textarea
                id="field-card-1"
                value={slide.leftColumn || ''}
                onChange={(e) => handleFieldChange('leftColumn', e.target.value)}
                rows={3}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2 text-xs"
                placeholder="Content for Card 1..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-card-2">
                Column 2 Content
              </label>
              <textarea
                id="field-card-2"
                value={slide.rightColumn || ''}
                onChange={(e) => handleFieldChange('rightColumn', e.target.value)}
                rows={3}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2 text-xs"
                placeholder="Content for Card 2..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-card-3">
                Column 3 Content
              </label>
              <textarea
                id="field-card-3"
                value={slide.thirdColumn || ''}
                onChange={(e) => handleFieldChange('thirdColumn', e.target.value)}
                rows={3}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2 text-xs"
                placeholder="Content for Card 3..."
              />
            </div>
          </div>
        )}

        {/* BIG-STAT LAYOUT SPECIFIC */}
        {slide.layout === 'big-stat' && (
          <div className="space-y-3.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase animate-pulse" htmlFor="field-stat-value">
                Large Numeric Callout
              </label>
              <input
                type="text"
                id="field-stat-value"
                value={slide.statValue || ''}
                onChange={(e) => handleFieldChange('statValue', e.target.value)}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-indigo-700 font-bold"
                placeholder="E.g., 94% or 2.5B"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-stat-label">
                Data Point Label / Caption
              </label>
              <textarea
                id="field-stat-label"
                value={slide.statLabel || ''}
                onChange={(e) => handleFieldChange('statLabel', e.target.value)}
                rows={3}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2 text-xs"
                placeholder="Provide descriptive parameters for this numeric callout..."
              />
            </div>
          </div>
        )}

        {/* QUOTE LAYOUT SPECIFIC */}
        {slide.layout === 'quote' && (
          <div className="space-y-3.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-quote-text">
                Quote Block Quote Text
              </label>
              <textarea
                id="field-quote-text"
                value={slide.quoteText || ''}
                onChange={(e) => handleFieldChange('quoteText', e.target.value)}
                rows={4}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg p-2.5 text-xs italic text-neutral-800"
                placeholder="Include inspirational quote..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-600 uppercase" htmlFor="field-quote-author">
                Author Attribution
              </label>
              <input
                type="text"
                id="field-quote-author"
                value={slide.quoteAuthor || ''}
                onChange={(e) => handleFieldChange('quoteAuthor', e.target.value)}
                className="w-full bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-neutral-800 font-medium"
                placeholder="Author name..."
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
