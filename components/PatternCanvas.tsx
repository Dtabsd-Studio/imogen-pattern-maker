/*  PatternCanvas.tsx  ─────────────────────────────────────────────────

   Now powered by the new PatternEngine with full type integration.
   • All pattern types supported with proper fallbacks
   • Unified rendering for both icon and procedural patterns
   • Compatible with existing ImageLayer and ProceduralLayer types

-------------------------------------------------------------------- */

import React, { forwardRef } from 'react';
import {
  Background,
  Layer,
  ImageLayer,
  ProceduralLayer,
  Filters,
} from '../src/types';

import {
  buildPattern,
  PatternSettings,
  getPatternMode,
} from '../services/patternEngine';

interface PatternCanvasProps {
  layers: Layer[];
  background: Background;
  globalRotation: number;
  zoom: number;
}

const VIEWBOX_SIZE = 1000;

const cssFilters = (f: Partial<Filters>) =>
  [
    `brightness(${f.brightness ?? 100}%)`,
    `contrast(${f.contrast ?? 100}%)`,
    `sepia(${f.sepia ?? 0}%)`,
    `hue-rotate(${f.hueRotate ?? 0}deg)`,
    `invert(${f.invert ?? 0}%)`,
  ].join(' ');

const finishFilter = (layer: ImageLayer, id: string) => {
  const k = layer.filters.finish;
  const sat = 1 + k / 200;
  const con = 1 + k / 200;
  const intercept = -(0.5 * con) + 0.5;
  return (
    <filter id={id}>
      <feColorMatrix type="saturate" values={sat.toString()} result="sat" />
      <feComponentTransfer in="sat" result="con">
        <feFuncR type="linear" slope={con.toString()} intercept={intercept.toString()} />
        <feFuncG type="linear" slope={con.toString()} intercept={intercept.toString()} />
        <feFuncB type="linear" slope={con.toString()} intercept={intercept.toString()} />
      </feComponentTransfer>
    </filter>
  );
};

// Background removal filter - removes white/light backgrounds
const backgroundRemovalFilter = (id: string) => (
  <filter id={id}>
    <feColorMatrix 
      type="matrix" 
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.9 -0.9 -0.9 1 0.9"
      result="removeWhite" 
    />
  </filter>
);

export const PatternCanvas = forwardRef<HTMLDivElement, PatternCanvasProps>(
  ({ layers, background, globalRotation, zoom }, ref) => {
    
    const renderBg = () => {
      console.log('🎨 Rendering background:', background);
      
      if (background.type === 'solid') {
        console.log('📦 Rendering solid background:', background.color);
        return (
          <rect
            width={VIEWBOX_SIZE}
            height={VIEWBOX_SIZE}
            fill={background.color}
          />
        );
      }

      if (background.type === 'gradient') {
        console.log('🌈 Rendering gradient background:', background);
        const id = 'bg-grad';
        return (
          <>
            <defs>
              <linearGradient
                id={id}
                gradientTransform={`rotate(${background.angle}, 0.5, 0.5)`}
              >
                <stop offset="0%" stopColor={background.startColor} />
                <stop offset="100%" stopColor={background.endColor} />
              </linearGradient>
            </defs>
            <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill={`url(#${id})`} />
          </>
        );
      }

      console.log('🔲 Rendering transparent background (checker pattern)');
      return (
        <>
          <defs>
            <pattern
              id="checker"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="#e5e7eb" />
              <rect width="20" height="20" x="20" y="20" fill="#e5e7eb" />
              <rect width="20" height="20" x="20" fill="#f3f4f6" />
              <rect width="20" height="20" y="20" fill="#f3f4f6" />
            </pattern>
          </defs>
          <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill="url(#checker)" />
        </>
      );
    };

    const renderImageLayer = (layer: ImageLayer) => {
      if (!layer.image) return null;
      
      // Check if we should apply background removal (can be made configurable)
      const applyBackgroundRemoval = false; // TODO: Make this a user setting

      if (layer.mode === 'single') {
        const size = (VIEWBOX_SIZE * layer.scale) / 100;
        const x = (VIEWBOX_SIZE - size) / 2;
        const y = x;
        const filterId = `fin-${layer.id}`;
        const bgRemovalId = `bg-remove-${layer.id}`;
        
        return (
          <g key={layer.id} opacity={layer.opacity}>
            <defs>
              {finishFilter(layer, filterId)}
              {applyBackgroundRemoval && backgroundRemovalFilter(bgRemovalId)}
            </defs>
            <g
              style={{ filter: cssFilters(layer.filters) }}
              filter={applyBackgroundRemoval ? `url(#${filterId}) url(#${bgRemovalId})` : `url(#${filterId})`}
            >
              <image
                href={layer.image}
                x={x}
                y={y}
                width={size}
                height={size}
                transform={`rotate(${layer.rotation}, ${VIEWBOX_SIZE / 2}, ${
                  VIEWBOX_SIZE / 2
                })`}
              />
            </g>
          </g>
        );
      }

      // Pattern mode - use the new pattern engine
      const supportedMode = getPatternMode(layer.patternType);
      const settings: PatternSettings = {
        mode: supportedMode,
        densityX: layer.gridCountX,
        densityY: layer.gridCountY,
        scale: layer.scale,
        spacing: layer.spacing,
      };

      try {
        const pattern = buildPattern(layer.image, 512, settings);
        const filterId = `fin-${layer.id}`;
        const bgRemovalId = `bg-remove-${layer.id}`;

        return (
          <g key={layer.id} opacity={layer.opacity}>
            <defs>
              {finishFilter(layer, filterId)}
              {applyBackgroundRemoval && backgroundRemovalFilter(bgRemovalId)}
              {pattern.defs}
            </defs>
            <g
              style={{ filter: cssFilters(layer.filters) }}
              filter={applyBackgroundRemoval ? `url(#${filterId}) url(#${bgRemovalId})` : `url(#${filterId})`}
            >
              <rect
                width={VIEWBOX_SIZE}
                height={VIEWBOX_SIZE}
                fill={pattern.fillUrl}
              />
            </g>
          </g>
        );
      } catch (error) {
        console.warn(`Pattern generation failed for ${layer.patternType}:`, error);
        // Fallback to single image mode with optional background removal
        const size = (VIEWBOX_SIZE * layer.scale) / 100;
        const x = (VIEWBOX_SIZE - size) / 2;
        const y = x;
        const bgRemovalId = `bg-remove-fallback-${layer.id}`;
        return (
          <g key={layer.id} opacity={layer.opacity}>
            {applyBackgroundRemoval && (
              <defs>
                {backgroundRemovalFilter(bgRemovalId)}
              </defs>
            )}
            <image
              href={layer.image}
              x={x}
              y={y}
              width={size}
              height={size}
              filter={applyBackgroundRemoval ? `url(#${bgRemovalId})` : undefined}
            />
          </g>
        );
      }
    };

    const renderProceduralLayer = (layer: ProceduralLayer) => {
      const cfg = layer.config;
      let settings: PatternSettings;

      switch (layer.proceduralType) {
        case 'stripes':
          settings = {
            mode: 'stripes',
            densityX: 1,
            densityY: 1,
            scale: 100,
            spacing: 0,
            stripeWidth: cfg.stripeWidth,
            stripeAngle: cfg.stripeAngle,
            stripeColor: cfg.stripeColor,
          };
          break;

        case 'plaid':
          settings = {
            mode: 'plaid',
            densityX: 1,
            densityY: 1,
            scale: 100,
            spacing: 0,
            plaidWidth: cfg.plaidWidth,
            plaidColor1: cfg.plaidColor1,
            plaidColor2: cfg.plaidColor2,
          };
          break;

        case 'dots': {
          const spacing = Math.max(0, cfg.dotSpacing - cfg.dotSize);
          const tiles = Math.round(VIEWBOX_SIZE / cfg.dotSpacing);
          settings = {
            mode: 'dots',
            densityX: tiles,
            densityY: tiles,
            scale: 100,
            spacing,
            dotDiameter: cfg.dotSize,
            dotColor: cfg.dotColor,
          };
          break;
        }

        default:
          return null;
      }

      try {
        const pattern = buildPattern(null, 100, settings);
        return (
          <g key={layer.id} opacity={layer.opacity}>
            <defs>{pattern.defs}</defs>
            <rect
              width={VIEWBOX_SIZE}
              height={VIEWBOX_SIZE}
              fill={pattern.fillUrl}
            />
          </g>
        );
      } catch (error) {
        console.warn(`Procedural pattern generation failed:`, error);
        return null;
      }
    };

    const renderLayer = (layer: Layer) =>
      layer.type === 'image'
        ? renderImageLayer(layer)
        : renderProceduralLayer(layer);

    // Dynamic container background based on pattern background
    const getContainerStyle = () => {
      // Only use backdrop blur for transparent backgrounds
      // Let the SVG background handle all other background types
      if (background.type === 'transparent') {
        return "w-full h-full max-w-[85vh] max-h-[85vh] aspect-square rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/20 ring-1 ring-inset ring-white/50";
      }
      // For solid and gradient backgrounds, use transparent container so SVG background shows through
      return "w-full h-full max-w-[85vh] max-h-[85vh] aspect-square rounded-2xl overflow-hidden bg-transparent border border-white/30 shadow-2xl shadow-black/20 ring-1 ring-inset ring-white/50";
    };

    return (
      <div 
        className={getContainerStyle()}
        ref={ref}
      >
        <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <g style={{
            transformOrigin: 'center center',
            transform: `scale(${zoom}) rotate(${globalRotation}deg)`,
            transition: 'transform 0.2s ease-out'
          }}>
            <g>
              {renderBg()}
            </g>
            <g>
              {layers.map(renderLayer)}
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

PatternCanvas.displayName = 'PatternCanvas';