import React from 'react';

interface Background {
  type: 'solid' | 'gradient' | 'transparent';
  color?: string;
  startColor?: string;
  endColor?: string;
  angle?: number;
}

interface BackgroundControlsProps {
  background: Background;
  setBackground: (background: Background) => void;
}

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

const Slider: React.FC<{
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step?: number;
  onChange: (value: number) => void; 
  unit?: string; 
}> = ({ label, value, min, max, step = 1, onChange, unit = '' }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
      <label>{label}</label>
      <span className="text-gray-800">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
    />
  </div>
);

export default function BackgroundControls({ background, setBackground }: BackgroundControlsProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
      <h3 className="font-semibold text-gray-700 mb-4">Background Settings</h3>
      
      <div className="space-y-4">
        {/* Background Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Background Type</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setBackground({ type: 'solid', color: '#ffffff' })} 
              className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                background.type === 'solid' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Solid
            </button>
            <button 
              onClick={() => setBackground({ 
                type: 'gradient', 
                angle: 90, 
                startColor: '#7dd3fc', 
                endColor: '#f9a8d4' 
              })} 
              className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                background.type === 'gradient' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Gradient
            </button>
            <button 
              onClick={() => setBackground({ type: 'transparent' })} 
              className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                background.type === 'transparent' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Transparent
            </button>
          </div>
        </div>

        {/* Solid Color Controls */}
        {background.type === 'solid' && (
          <ColorInput 
            label="Background Color" 
            value={background.color || '#ffffff'} 
            onChange={(color) => setBackground({ type: 'solid', color })} 
          />
        )}

        {/* Gradient Controls */}
        {background.type === 'gradient' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <ColorInput 
                label="Start Color" 
                value={background.startColor || '#7dd3fc'} 
                onChange={(startColor) => setBackground({ ...background, startColor })} 
              />
              <ColorInput 
                label="End Color" 
                value={background.endColor || '#f9a8d4'} 
                onChange={(endColor) => setBackground({ ...background, endColor })} 
              />
            </div>
            <Slider 
              label="Gradient Angle" 
              value={background.angle || 90} 
              onChange={(angle) => setBackground({ ...background, angle })} 
              min={0} 
              max={360} 
              unit="°" 
            />
          </div>
        )}

        {/* Transparent Background Info */}
        {background.type === 'transparent' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              Transparent background - perfect for patterns that will be placed on colored items.
            </p>
          </div>
        )}

        {/* Background Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Preview</label>
          <div 
            className="w-full h-16 border border-gray-300 rounded-lg"
            style={{
              background: background.type === 'solid' 
                ? background.color 
                : background.type === 'gradient'
                ? `linear-gradient(${background.angle || 90}deg, ${background.startColor || '#7dd3fc'}, ${background.endColor || '#f9a8d4'})`
                : 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'a\' patternUnits=\'userSpaceOnUse\' width=\'20\' height=\'20\'%3e%3crect x=\'0\' y=\'0\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3e%3crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3e%3crect x=\'0\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23f3f4f6\'/%3e%3crect x=\'10\' y=\'0\' width=\'10\' height=\'10\' fill=\'%23f3f4f6\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3e%3c/svg%3e")'
            }}
          />
        </div>
      </div>
    </div>
  );
} 