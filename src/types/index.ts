// Shared types for the pattern maker application

export type ProjectMode = 'hub' | 'pattern' | 'crest' | 'image' | 'text';

// Extended pattern types that work with both old and new pattern engine
export type PatternType = 
  | 'grid' 
  | 'checkerboard' 
  | 'diamond' 
  | 'stripes' 
  | 'plaid' 
  | 'dots'
  | 'floral'     // Legacy - will fallback to grid
  | 'polka-dots' // Legacy - will map to dots  
  | 'fractal'    // Legacy - will fallback to diamond
  | 'mondrian';  // Legacy - will fallback to grid

export type ProceduralPatternType = 'dots' | 'stripes' | 'plaid';

// Map legacy patterns to supported patterns
export const PATTERN_TYPE_MAPPING: Record<PatternType, 'grid' | 'checkerboard' | 'diamond' | 'stripes' | 'plaid' | 'dots'> = {
  'grid': 'grid',
  'checkerboard': 'checkerboard', 
  'diamond': 'diamond',
  'stripes': 'stripes',
  'plaid': 'plaid',
  'dots': 'dots',
  'polka-dots': 'dots',      // Map polka-dots to dots
  'floral': 'grid',          // Fallback to grid
  'fractal': 'diamond',      // Fallback to diamond 
  'mondrian': 'grid'         // Fallback to grid
};

export type Background = 
  | { type: 'solid'; color: string; }
  | { type: 'gradient'; angle: number; startColor: string; endColor: string; }
  | { type: 'transparent'; };
export type WorkflowStep = 'generate' | 'design';

export interface Filters {
    brightness: number;
    contrast: number;
    sepia: number;
    hueRotate: number;
    invert: number;
    finish: number;
}

export interface BaseLayer {
    id: string;
    type: 'image' | 'procedural';
    name: string;
    opacity: number;
}

export interface ImageLayer extends BaseLayer {
    type: 'image';
    mode: 'single' | 'pattern';
    image: string | null;
    scale: number;
    rotation: number;
    gridCountX: number;
    gridCountY: number;
    patternType: PatternType;
    filters: Filters;
    // Pattern-specific properties
    spacing: number;
    offset: number;
    alternatePattern: boolean;
}

export interface ProceduralLayer extends BaseLayer {
    type: 'procedural';
    proceduralType: ProceduralPatternType;
    config: {
        dotColor: string;
        dotSize: number;
        dotSpacing: number;
        stripeColor: string;
        stripeWidth: number;
        stripeSpacing: number;
        stripeAngle: number;
        plaidColor1: string;
        plaidColor2: string;
        plaidColor3: string;
        plaidWidth: number;
        plaidSpacing: number;
    };
}

export type Layer = ImageLayer | ProceduralLayer;

export interface TextDesignConfig {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    strokeColor?: string;
    strokeWidth?: number;
    shapeType?: 'none' | 'circle' | 'square';
    shapeColor?: string;
    shapeOpacity?: number;
    // Legacy properties for backward compatibility
    backgroundColor: string;
    style: 'simple' | 'outlined' | 'shadow' | 'vintage' | 'modern';
    shape: 'none' | 'circle' | 'rectangle' | 'banner';
    // Circular text properties
    isCircular: boolean;
    circularRadius: number;
    circularStartAngle: number;
    circularDirection: 'clockwise' | 'counterclockwise';
}
