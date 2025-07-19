/* -------------------------------------------------------------
 * PatternEngine - Integrated with existing IMOGEN types
 * Pure math + JSX helpers for all pattern flavours
 * ----------------------------------------------------------- */

import React from 'react';
import { PatternType, PATTERN_TYPE_MAPPING } from '../src/types';

export type SupportedPatternMode = 'grid' | 'checkerboard' | 'diamond' | 'stripes' | 'plaid' | 'dots';

export interface PatternSettings {
  mode: SupportedPatternMode;
  densityX: number;
  densityY: number;
  scale: number;
  spacing: number;
  stripeWidth?: number;
  stripeAngle?: number;
  stripeColor?: string;
  plaidWidth?: number;
  plaidColor1?: string;
  plaidColor2?: string;
  dotDiameter?: number;
  dotColor?: string;
}

export const DEFAULT_SETTINGS: PatternSettings = {
  mode: 'grid',
  densityX: 5,
  densityY: 5,
  scale: 100,
  spacing: 0,
  stripeWidth: 40,
  stripeAngle: 45,
  stripeColor: '#1e3a8a',
  plaidWidth: 40,
  plaidColor1: '#1e3a8a',
  plaidColor2: '#dc2626',
  dotDiameter: 20,
  dotColor: '#1e3a8a',
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const hash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h).toString(36);
};

export function getPatternMode(patternType: PatternType): SupportedPatternMode {
  return PATTERN_TYPE_MAPPING[patternType];
}

export function buildPattern(
  iconUrl: string | null,
  naturalEdge: number,
  settings: PatternSettings,
) {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const pid = `p-${hash(JSON.stringify(s))}`;

  const iconSize = (naturalEdge * clamp(s.scale, 5, 300)) / 100;
  const gap = clamp(s.spacing, 0, 1000);
  const tileX = iconSize + gap;
  const tileY = iconSize + gap;

  let patternW = 100;
  let patternH = 100;
  let content: React.ReactNode = null;
  let transform: string | undefined;

  switch (s.mode) {
    case 'grid':
      if (!iconUrl) throw new Error('iconUrl required for grid');
      patternW = tileX;
      patternH = tileY;
      content = React.createElement('image', {
        href: iconUrl,
        width: iconSize,
        height: iconSize,
        x: (tileX - iconSize) / 2,
        y: (tileY - iconSize) / 2,
      });
      break;

    case 'diamond':
      if (!iconUrl) throw new Error('iconUrl required for diamond');
      patternW = tileX;
      patternH = tileY;
      transform = 'rotate(45 0.5 0.5)';
      content = React.createElement('image', {
        href: iconUrl,
        width: iconSize,
        height: iconSize,
        x: (tileX - iconSize) / 2,
        y: (tileY - iconSize) / 2,
      });
      break;

    case 'checkerboard': {
      if (!iconUrl) throw new Error('iconUrl required for checkerboard');
      patternW = tileX * 2;
      patternH = tileY * 2;
      const x1 = (tileX - iconSize) / 2;
      const y1 = (tileY - iconSize) / 2;
      const x2 = tileX + (tileX - iconSize) / 2;
      const y2 = tileY + (tileY - iconSize) / 2;
      
      content = React.createElement('g', {}, [
        React.createElement('image', {
          key: '1',
          href: iconUrl,
          width: iconSize,
          height: iconSize,
          x: x1,
          y: y1,
        }),
        React.createElement('image', {
          key: '2',
          href: iconUrl,
          width: iconSize,
          height: iconSize,
          x: x2,
          y: y2,
        }),
      ]);
      break;
    }

    case 'stripes': {
      const w = clamp(s.stripeWidth!, 2, 1000);
      patternW = patternH = w * 2;
      content = React.createElement('g', {
        transform: `rotate(${s.stripeAngle} ${patternW / 2} ${patternH / 2})`,
      }, React.createElement('rect', {
        x: 0,
        y: (patternH - w) / 2,
        width: patternW,
        height: w,
        fill: s.stripeColor,
      }));
      break;
    }

    case 'plaid': {
      const bw = clamp(s.plaidWidth!, 2, 1000);
      patternW = patternH = bw * 4;
      content = React.createElement('g', {}, [
        React.createElement('rect', {
          key: '1',
          x: 0,
          y: (patternH - bw) / 2,
          width: patternW,
          height: bw,
          fill: s.plaidColor1,
        }),
        React.createElement('rect', {
          key: '2',
          x: (patternW - bw) / 2,
          y: 0,
          width: bw,
          height: patternH,
          fill: s.plaidColor2,
        }),
      ]);
      break;
    }

    case 'dots': {
      const d = clamp(s.dotDiameter!, 2, 1000);
      patternW = patternH = d + s.spacing;
      content = React.createElement('circle', {
        cx: d / 2,
        cy: d / 2,
        r: d / 2,
        fill: s.dotColor,
      });
      break;
    }

    default:
      throw new Error(`Unknown mode: ${s.mode}`);
  }

  const defs = React.createElement('pattern', {
    id: pid,
    width: patternW,
    height: patternH,
    patternUnits: 'userSpaceOnUse',
    patternTransform: transform,
  }, content);

  return {
    patternId: pid,
    defs,
    fillUrl: `url(#${pid})`,
    viewBoxWidth: tileX * s.densityX,
    viewBoxHeight: tileY * s.densityY,
  };
}