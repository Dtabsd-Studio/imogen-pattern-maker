import React, { useState } from 'react';
import { GridIcon, DiamondIcon, CheckerboardIcon, LinkIcon, UnlinkIcon } from '../icons';

interface PatternState {
  patternType: 'grid' | 'diamond' | 'checkerboard';
  gridCountX: number;
  gridCountY: number;
  spacing: number;
  scale: number;
  rotation: number;
  offset: number;
  alternate: boolean;
  // Image effects
  opacity: number;
  colorOverlay: {
    enabled: boolean;
    type: 'none' | 'solid' | 'gradient';
    color?: string;
    startColor?: string;
    endColor?: string;
    angle?: number;
    blendMode: 'multiply' | 'overlay' | 'screen' | 'color' | 'hue' | 'saturation';
  };
  filters: {
    hue: number;
    saturation: number;
    brightness: number;
    contrast: number;
  };
}

interface PatternControlsProps {
  state: PatternState;
  setState: (state: PatternState) => void;
  disabled?: boolean;
}

const Slider: React.FC<{
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step?: number;
  onChange: (value: number) => void; 
  unit?: string; 
  disabled?: boolean;
  displayValue?: string;
}> = ({ label, value, min, max, step = 1, onChange, unit = '', disabled = false, displayValue }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
      <label className={disabled ? 'text-gray-400' : ''}>{label}</label>
      <span className={disabled ? 'text-gray-400' : 'text-gray-800'}>
        {displayValue || `${value}${unit}`}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      disabled={disabled}
      className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
    />
  </div>
);

const ColorInput: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
}> = ({ label, value, onChange }) => (
  <div className="flex items-center gap-2 bg-white/50 border border-gray-900/10 rounded-md p-1.5">
    <input 
      type="color" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-8 h-8 p-0 border-none bg-transparent appearance-none cursor-pointer rounded-md" 
    />
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-transparent w-full focus:outline-none text-gray-800 placeholder:text-gray-500" 
      placeholder={label} 
    />
  </div>
);

export default function PatternControls({ state, setState, disabled = false }: PatternControlsProps) {
  const [isDensityLinked, setIsDensityLinked] = useState(true);

  const updateState = (updates: Partial<PatternState>) => {
    setState({ ...state, ...updates });
  };

  const handleDensityChange = (axis: 'x' | 'y', value: number) => {
    if (isDensityLinked) {
      updateState({ gridCountX: value, gridCountY: value });
    } else {
      if (axis === 'x') {
        updateState({ gridCountX: value });
      } else {
        updateState({ gridCountY: value });
      }
    }
  };

  const patternTypes = [
    { type: 'grid' as const, icon: <GridIcon/>, label: 'Grid' },
    { type: 'checkerboard' as const, icon: <CheckerboardIcon/>, label: 'Checkerboard' },
    { type: 'diamond' as const, icon: <DiamondIcon/>, label: 'Diamond' }
  ];

  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <h3 className="font-semibold text-gray-700 mb-4">Pattern Settings</h3>
      
      <div className="space-y-6">
        {/* Pattern Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Pattern Type</label>
          <div className="grid grid-cols-3 gap-2">
            {patternTypes.map(({ type, icon, label }) => (
              <button 
                key={type} 
                onClick={() => updateState({ patternType: type })}
                className={`p-3 rounded-lg text-xs transition-colors flex flex-col items-center gap-2 ${
                  state.patternType === type 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="w-5 h-5">{icon}</span>
                <span className="leading-tight font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Density Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Pattern Density</label>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Slider 
              label="Horizontal" 
              value={state.gridCountX} 
              onChange={(value) => handleDensityChange('x', value)} 
              min={1} 
              max={20} 
            />
            <button 
              onClick={() => setIsDensityLinked(!isDensityLinked)} 
              className="p-2 mt-5 rounded-full hover:bg-black/10 transition-colors"
              title={isDensityLinked ? "Unlink density controls" : "Link density controls"}
            >
              {isDensityLinked ? 
                <LinkIcon className="w-4 h-4 text-sky-500" /> : 
                <UnlinkIcon className="w-4 h-4 text-gray-500" />
              }
            </button>
            <Slider 
              label="Vertical" 
              value={state.gridCountY} 
              onChange={(value) => handleDensityChange('y', value)} 
              min={1} 
              max={20} 
            />
          </div>
        </div>

        {/* Scale and Spacing */}
        <div className="space-y-4">
          <Slider 
            label="Image Scale" 
            value={state.scale} 
            onChange={(value) => updateState({ scale: value })} 
            min={-100} 
            max={100} 
            unit="" 
            displayValue={`${
              state.scale >= 0 
                ? Math.round((1 + state.scale / 100) * 100)
                : Math.round((0.1 + 0.9 * (state.scale + 100) / 100) * 100)
            }%`}
          />
          <Slider 
            label="Spacing" 
            value={state.spacing} 
            onChange={(value) => updateState({ spacing: value })} 
            min={0} 
            max={200} 
            step={2}
            unit="px" 
          />
          <Slider 
            label="Image Rotation" 
            value={state.rotation} 
            onChange={(value) => updateState({ rotation: value })} 
            min={0} 
            max={360} 
            unit="°" 
          />
          <Slider 
            label="Pattern Offset" 
            value={state.offset} 
            onChange={(value) => updateState({ offset: value })} 
            min={0} 
            max={200} 
            step={2}
            unit="px" 
          />
        </div>

        {/* Image Effects */}
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">Image Effects</h4>
          
          {/* Opacity */}
          <Slider 
            label="Transparency" 
            value={Math.round(state.opacity * 100)} 
            onChange={(value) => updateState({ opacity: value / 100 })} 
            min={0} 
            max={100} 
            unit="%" 
          />

          {/* Color Overlay Toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableColorOverlay"
                checked={state.colorOverlay.enabled}
                onChange={(e) => updateState({ 
                  colorOverlay: { ...state.colorOverlay, enabled: e.target.checked }
                })}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
              <label htmlFor="enableColorOverlay" className="text-sm font-medium text-gray-700">
                Color Overlay
              </label>
            </div>

            {/* Color Overlay Controls */}
            {state.colorOverlay.enabled && (
              <div className="space-y-3 pl-6 border-l-2 border-purple-200">
                {/* Overlay Type */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateState({ 
                      colorOverlay: { ...state.colorOverlay, type: 'solid' }
                    })} 
                    className={`flex-1 p-2 rounded-md text-xs transition-colors ${
                      state.colorOverlay.type === 'solid' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Solid
                  </button>
                  <button 
                    onClick={() => updateState({ 
                      colorOverlay: { ...state.colorOverlay, type: 'gradient' }
                    })} 
                    className={`flex-1 p-2 rounded-md text-xs transition-colors ${
                      state.colorOverlay.type === 'gradient' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Gradient
                  </button>
                </div>

                {/* Color Controls */}
                {state.colorOverlay.type === 'solid' && (
                  <ColorInput 
                    label="Overlay Color" 
                    value={state.colorOverlay.color || '#ff6b6b'} 
                    onChange={(color) => updateState({ 
                      colorOverlay: { ...state.colorOverlay, color }
                    })} 
                  />
                )}

                {state.colorOverlay.type === 'gradient' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <ColorInput 
                        label="Start" 
                        value={state.colorOverlay.startColor || '#ff6b6b'} 
                        onChange={(startColor) => updateState({ 
                          colorOverlay: { ...state.colorOverlay, startColor }
                        })} 
                      />
                      <ColorInput 
                        label="End" 
                        value={state.colorOverlay.endColor || '#4ecdc4'} 
                        onChange={(endColor) => updateState({ 
                          colorOverlay: { ...state.colorOverlay, endColor }
                        })} 
                      />
                    </div>
                    <Slider 
                      label="Angle" 
                      value={state.colorOverlay.angle || 45} 
                      onChange={(angle) => updateState({ 
                        colorOverlay: { ...state.colorOverlay, angle }
                      })} 
                      min={0} 
                      max={360} 
                      unit="°" 
                    />
                  </div>
                )}

                {/* Blend Mode */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Blend Mode</label>
                  <select
                    value={state.colorOverlay.blendMode}
                    onChange={(e) => updateState({ 
                      colorOverlay: { 
                        ...state.colorOverlay, 
                        blendMode: e.target.value as any 
                      }
                    })}
                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="multiply">Multiply (darker)</option>
                    <option value="overlay">Overlay (contrast)</option>
                    <option value="screen">Screen (lighter)</option>
                    <option value="color">Color (hue change)</option>
                    <option value="hue">Hue (color shift)</option>
                    <option value="saturation">Saturation</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Image Filters for Multi-color Images */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <h5 className="text-xs font-medium text-gray-700">Image Adjustments</h5>
            <Slider 
              label="Hue Shift" 
              value={state.filters.hue} 
              onChange={(value) => updateState({ 
                filters: { ...state.filters, hue: value }
              })} 
              min={0} 
              max={360} 
              unit="°" 
            />
            <Slider 
              label="Saturation" 
              value={state.filters.saturation} 
              onChange={(value) => updateState({ 
                filters: { ...state.filters, saturation: value }
              })} 
              min={0} 
              max={200} 
              unit="%" 
            />
            <Slider 
              label="Brightness" 
              value={state.filters.brightness} 
              onChange={(value) => updateState({ 
                filters: { ...state.filters, brightness: value }
              })} 
              min={0} 
              max={200} 
              unit="%" 
            />
            <Slider 
              label="Contrast" 
              value={state.filters.contrast} 
              onChange={(value) => updateState({ 
                filters: { ...state.filters, contrast: value }
              })} 
              min={0} 
              max={200} 
              unit="%" 
            />
          </div>
        </div>

        {/* Pattern Options */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="alternatePattern"
              checked={state.alternate}
              onChange={(e) => updateState({ alternate: e.target.checked })}
              className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
            />
            <label htmlFor="alternatePattern" className="text-sm font-medium text-gray-700">
              Alternate Pattern
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 