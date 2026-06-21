/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Slide, PresentationTheme, Presentation } from './types';

export const THEMES: PresentationTheme[] = [
  {
    id: 'slate-obsidian',
    name: 'Slate Obsidian',
    fontFamily: 'sans',
    bgType: 'dark',
    bgColor: '#0f172a', // Slate 900
    textColor: '#f8fafc', // Slate 50
    accentColor: '#38bdf8', // Sky 400
  },
  {
    id: 'elegant-ivory',
    name: 'Elegant Ivory',
    fontFamily: 'serif',
    bgType: 'minimal',
    bgColor: '#fafaf9', // Stone 50
    textColor: '#1c1917', // Stone 900
    accentColor: '#b45309', // Amber 700
  },
  {
    id: 'royal-indigo',
    name: 'Royal Indigo',
    fontFamily: 'display',
    bgType: 'gradient',
    bgColor: '#1e1b4b', // Indigo 950
    bgGradientStart: '#1e1b4b',
    bgGradientEnd: '#311042',
    textColor: '#f8fafc',
    accentColor: '#a78bfa', // Violet 400
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Minimal',
    fontFamily: 'sans',
    bgType: 'solid',
    bgColor: '#022c22', // Emerald 950
    textColor: '#f0fdf4', // Emerald 50
    accentColor: '#34d399', // Emerald 400
  },
  {
    id: 'coral-sunset',
    name: 'Sunset Gradient',
    fontFamily: 'display',
    bgType: 'gradient',
    bgColor: '#fcf6f0',
    bgGradientStart: '#fff7ed', // Orange 50
    bgGradientEnd: '#fed7aa', // Orange 200
    textColor: '#431407', // Orange 950
    accentColor: '#ea580c', // Orange 600
  },
  {
    id: 'cyber-neon',
    name: 'Tech Mono',
    fontFamily: 'mono',
    bgType: 'dark',
    bgColor: '#090d16',
    textColor: '#00ffcc', // Neon Cyan
    accentColor: '#ff007f', // Neon Pink
  },
];

export const DEFAULT_PRESENTATION: Presentation = {
  id: 'demo-presentation',
  title: 'Interactive Presentation Design Guide',
  description: 'Learn how to build and present gorgeous interactive slides straight from your browser.',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  slides: [
    {
      id: 'slide-1',
      title: 'Designing with Purpose',
      subtitle: 'A Modern Presentation Guide for Web Creators',
      body: 'Welcome to this beautiful in-browser presentation system. Build stunning slides, organize layouts, control transitions, and share full-screen pitches directly with confidence.',
      bulletPoints: [],
      leftColumn: '',
      rightColumn: '',
      layout: 'cover',
      bgType: 'gradient',
      bgColor: '#1e1b4b',
      bgGradientStart: '#111827', // Gray 900
      bgGradientEnd: '#1e1b4b', // Indigo 950
      textColor: '#f8fafc', // Slate 50
      accentColor: '#38bdf8', // Sky 400
      fontFamily: 'display',
      transition: 'zoom',
      notes: 'This is the cover slide. Introduce yourself and outline the goal of this interactive slideshow tool.',
    },
    {
      id: 'slide-2',
      title: 'Flexible Content Layouts',
      subtitle: 'Structure your narrative elegantly',
      body: 'Choose from multiple responsive templates optimized for clarity, typography pairing, and legibility. Mix and match layouts per-slide to keep your audience fully engaged.',
      bulletPoints: [
        'Organized bullet lists with interactive icon bullet offsets',
        'Custom layout templates for text, statistics, and editorial quotes',
        'Dynamic styling overrides for custom background gradients, cards, and accent colors',
      ],
      leftColumn: '',
      rightColumn: '',
      layout: 'header-text',
      bgType: 'solid',
      bgColor: '#0f172a', // Slate 900
      textColor: '#f8fafc',
      accentColor: '#34d399', // Emerald 400
      fontFamily: 'sans',
      transition: 'slide-x',
      notes: 'Point out the transition effects. Explain that layout types can be swapped instataneously with no content loss.',
    },
    {
      id: 'slide-3',
      title: 'Comparing Key Concepts',
      subtitle: 'Two-column layouts for quick side-by-side analysis',
      body: '',
      bulletPoints: [],
      leftColumn: '### The Static Pitch Deck\nTraditional static exports are rigid and non-interactive. Content is locked in pre-rendered images or PDFs, missing direct editing capabilties and live responsiveness.',
      rightColumn: '### Web-Native Slides\nInteractive CSS and HTML5 engines support modular layouts, perfect responsiveness, instant custom resizing, custom transitions, and direct browser previews with live presenter notes!',
      layout: 'two-column',
      bgType: 'minimal',
      bgColor: '#fafaf9', // Stone 50
      textColor: '#1c1917', // Stone 900
      accentColor: '#b45309', // Amber 700
      fontFamily: 'serif',
      transition: 'slide-y',
      notes: 'Highlight how the typography switched to editorial serif. Show the side-by-side column balance.',
    },
    {
      id: 'slide-4',
      title: 'Dynamic Data Analytics',
      subtitle: 'Deliver impact through big numbers',
      body: 'Our big stat layout draws immediate focus to the single most critical trend or data point in your presentation, backing it up with immediate descriptive context below.',
      bulletPoints: [],
      leftColumn: '',
      rightColumn: '',
      statValue: '94%',
      statLabel: 'Audience engagement improvement using high-contrast, beautiful typography and dynamic interactive full-screen browser slides.',
      layout: 'big-stat',
      bgType: 'gradient',
      bgColor: '#1c1917',
      bgGradientStart: '#1c1917',
      bgGradientEnd: '#292524',
      textColor: '#ffedd5',
      accentColor: '#ea580c',
      fontFamily: 'sans',
      transition: 'zoom',
      notes: 'A great slide for closing deals or reporting annual growth metrics. High contrast makes the huge stat easily readable.',
    },
    {
      id: 'slide-5',
      title: 'Memorable Inspiration Quotes',
      subtitle: 'Emphasize messages that core-motivate your audience',
      body: '',
      bulletPoints: [],
      leftColumn: '',
      rightColumn: '',
      quoteText: '“Simplicity is the ultimate sophistication. When you remove noise, what remains is the absolute maximum punch of clear typography.”',
      quoteAuthor: 'Leonardo da Vinci',
      layout: 'quote',
      bgType: 'solid',
      bgColor: '#022c22', // Emerald 950
      textColor: '#ecfdf5', // Emerald 50
      accentColor: '#34d399', // Emerald 400
      fontFamily: 'serif',
      transition: 'fade',
      notes: 'Quotes introduce storytelling beats. Present slowly, pausing for effect.',
    },
    {
      id: 'slide-6',
      title: 'Modular Triple Features',
      subtitle: 'Present three parallel items with beautiful alignment',
      body: '',
      bulletPoints: [],
      leftColumn: '#### 🛠️ Direct Editing\nDouble-click headers, update notes, or adjust bullet offsets instantly in the direct workspace view.',
      rightColumn: '#### 🚀 Live Presenter HUD\nAccess an interactive overlay featuring timers, direct select navigation, helper notes, and laser indicators.',
      thirdColumn: '#### 📥 Flexible Export\nDownload complete presentations as offline-portable JSON files, or import deck states in seconds.',
      layout: 'three-column',
      bgType: 'minimal',
      bgColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#4f46e5',
      fontFamily: 'mono',
      transition: 'slide-x',
      notes: 'Conclude by asking if the audience has any questions. Then transition into live practice.',
    },
  ],
};

export const BLANK_SLIDE_TEMPLATE = (index: number): Slide => ({
  id: `slide-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  title: `Untitled Slide ${index}`,
  subtitle: 'Add a supporting subtitle description',
  body: 'Double click to add detailed layout thoughts, structural guidelines, or narrative content blocks here.',
  bulletPoints: [
    'Add interesting supporting arguments or facts',
    'Customise visual settings on the right panel',
  ],
  leftColumn: '### Left View content\nEdit and enrich your comparison arguments here.',
  rightColumn: '### Right View content\nDetail contrasting statements, notes, or lists here.',
  thirdColumn: '### Third View content\nAdd multi-dimensional feature cards or points here.',
  statValue: '250K',
  statLabel: 'Significant performance milestone achieved through responsive browser components.',
  quoteText: '“This is a blockquote placeholder. Edit it on the right parameters bar.”',
  quoteAuthor: 'Inspired Author',
  layout: 'header-text',
  bgType: 'solid',
  bgColor: '#0f172a',
  textColor: '#f8fafc',
  accentColor: '#38bdf8',
  fontFamily: 'sans',
  transition: 'fade',
  notes: 'Presenter helper guidelines. These are only visible in the controller overlay or notes side view.',
});
