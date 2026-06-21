/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SlideLayout = 
  | 'cover'          // Huge title, subtitle, minimal cover layout
  | 'header-text'    // Title + text block or bullet points
  | 'two-column'     // Title + left column + right column
  | 'big-stat'       // Big numeric callout + description label
  | 'quote'          // Centered styled quote block + source
  | 'three-column';  // Title + three distinct feature columns

export type FontFamily = 'sans' | 'display' | 'serif' | 'mono';

export type BackgroundType = 'solid' | 'gradient' | 'minimal' | 'dark';

export type SlideTransition = 'fade' | 'slide-x' | 'slide-y' | 'zoom' | 'none';

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  body: string; // Used for content text (supports line breaks and Markdown-like custom lists)
  bulletPoints: string[]; // Structured bullet points list
  leftColumn: string; // Left column body text
  rightColumn: string; // Right column body text
  thirdColumn?: string; // Third column body text
  
  // Custom stat layout fields
  statValue?: string;
  statLabel?: string;
  
  // Custom quote layout fields
  quoteText?: string;
  quoteAuthor?: string;

  // Custom styling per slide
  layout: SlideLayout;
  bgType: BackgroundType;
  bgColor: string; // Hex code or solid color scheme
  bgGradientStart?: string; // Gradient color 1
  bgGradientEnd?: string; // Gradient color 2
  textColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  transition: SlideTransition;
  
  // Presenter notes
  notes: string;
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  slides: Slide[];
}

export interface PresentationTheme {
  id: string;
  name: string;
  fontFamily: FontFamily;
  bgType: BackgroundType;
  bgColor: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
  textColor: string;
  accentColor: string;
}
