import React, { useState } from 'react';
import { TextDesignConfig } from '../src/types';

interface TextDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (textDesign: TextDesignConfig) => void;
}

const fonts = [
  { name: 'Bold Impact', value: 'Impact, Arial Black, sans-serif' },
  { name: 'Clean Sans', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Classic Serif', value: 'Georgia, Times, serif' },
  { name: 'Vintage Script', value: 'Brush Script MT, cursive' },
  { name: 'Modern Thin', value: 'Helvetica Neue, Arial, sans-serif' },
  { name: 'Retro Bold', value: 'Arial Black, Gadget, sans-serif' },
];

const styles = [
  { name: 'Simple', value: 'simple', description: 'Clean text only' },
  { name: 'Outlined', value: 'outlined', description: 'Text with outline' },
  { name: 'Shadow', value: 'shadow', description: 'Text with drop shadow' },
  { name: 'Vintage', value: 'vintage', description: 'Retro style effect' },
  { name: 'Modern', value: 'modern', description: 'Contemporary look' },
];

const shapes = [
  { name: 'No Shape', value: 'none' },
  { name: 'Circle', value: 'circle' },
  { name: 'Rectangle', value: 'rectangle' },
  { name: 'Banner', value: 'banner' },
];

// Slider component for the modal
const Slider: React.FC<{
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (value: number) => void; unit?: string; disabled?: boolean;
}> = ({ label, value, min, max, step = 1, onChange, unit = '', disabled = false }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
      <label className={disabled ? 'text-gray-400' : ''}>{label}</label>
      <span className={disabled ? 'text-gray-400' : 'text-gray-800'}>{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      disabled={disabled}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
    />
  </div>
);

export const TextDesignModal: React.FC<TextDesignModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [text, setText] = useState('YOUR TEXT HERE');
  const [fontFamily, setFontFamily] = useState(fonts[0].value);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [style, setStyle] = useState<TextDesignConfig['style']>('simple');
  const [shape, setShape] = useState<TextDesignConfig['shape']>('none');
  
  // Circular text properties
  const [isCircular, setIsCircular] = useState(false);
  const [circularRadius, setCircularRadius] = useState(120);
  const [circularStartAngle, setCircularStartAngle] = useState(0);
  const [circularDirection, setCircularDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      text,
      fontFamily,
      fontSize,
      color,
      backgroundColor,
      style,
      shape,
      isCircular,
      circularRadius,
      circularStartAngle,
      circularDirection
    });
    onClose();
  };

  // Generate circular text path
  const generateCircularPath = () => {
    const size = 300;
    const center = size / 2;
    const radius = circularRadius * 0.8; // Scale for preview
    const circumference = 2 * Math.PI * radius;
    const adjustedRadius = isCircular ? radius : 0;
    
    if (circularDirection === 'clockwise') {
      return `M ${center - adjustedRadius},${center} A ${adjustedRadius},${adjustedRadius} 0 1 1 ${center + adjustedRadius},${center}`;
    } else {
      return `M ${center + adjustedRadius},${center} A ${adjustedRadius},${adjustedRadius} 0 1 0 ${center - adjustedRadius},${center}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-black/20 w-full max-w-4xl p-6 m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tighter">📝 Create Text Design</h2>
            <p className="text-sm text-gray-600">Perfect for POD clothing, logos, and simple graphics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Preview */}
            <div className="bg-gray-100 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300" className="max-w-full max-h-full">
                {/* Background shape */}
                {shape !== 'none' && backgroundColor !== 'transparent' && (
                  <>
                    {shape === 'circle' && (
                      <circle cx="150" cy="150" r="130" fill={backgroundColor} opacity="0.9"/>
                    )}
                    {shape === 'rectangle' && (
                      <rect x="20" y="100" width="260" height="100" fill={backgroundColor} rx="8" opacity="0.9"/>
                    )}
                    {shape === 'banner' && (
                      <rect x="20" y="120" width="260" height="60" fill={backgroundColor} stroke="#333" strokeWidth="2" opacity="0.9"/>
                    )}
                  </>
                )}
                
                {/* Text */}
                {isCircular ? (
                  <>
                    <defs>
                      <path id="textPath" d={generateCircularPath()} />
                    </defs>
                    <text
                      fontFamily={fontFamily}
                      fontSize={fontSize * 0.4}
                      fill={color}
                      textAnchor="middle"
                      style={{
                        textShadow: style === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                        WebkitTextStroke: style === 'outlined' ? '1px #333' : 'none',
                      }}
                      className={style === 'vintage' ? 'opacity-80' : ''}
                    >
                      <textPath href="#textPath" startOffset="50%">
                        {text || 'YOUR TEXT HERE'}
                      </textPath>
                    </text>
                  </>
                ) : (
                  <text
                    x="150"
                    y="160"
                    textAnchor="middle"
                    fontFamily={fontFamily}
                    fontSize={fontSize * 0.4}
                    fill={color}
                    style={{
                      textShadow: style === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                      WebkitTextStroke: style === 'outlined' ? '1px #333' : 'none',
                    }}
                    className={style === 'vintage' ? 'opacity-80' : ''}
                  >
                    {text || 'YOUR TEXT HERE'}
                  </text>
                )}
              </svg>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Step 1: Basic Text */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="bg-sky-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">1</div>
                  Basic Text
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Text
                    </label>
                    <input
                      type="text"
                      id="text"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      className="w-full bg-white/50 border border-gray-900/10 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-lg"
                      placeholder="Enter your text here..."
                      autoFocus
                    />
                  </div>
                  <Slider
                    label="Font Size"
                    value={fontSize}
                    onChange={setFontSize}
                    min={16}
                    max={120}
                    unit="px"
                  />
                </div>
              </div>

              {/* Step 2: Styling */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="bg-sky-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">2</div>
                  Styling
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Font Selection */}
                    <div>
                      <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                        Font Style
                      </label>
                      <select
                        id="fontFamily"
                        value={fontFamily}
                        onChange={e => setFontFamily(e.target.value)}
                        className="w-full bg-white/50 border border-gray-900/10 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
                      >
                        {fonts.map(font => (
                          <option key={font.name} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2 bg-white/50 border border-gray-900/10 rounded-md p-1">
                        <input
                          type="color"
                          id="color"
                          value={color}
                          onChange={e => setColor(e.target.value)}
                          className="w-8 h-8 p-0 border-none bg-transparent appearance-none cursor-pointer rounded-md"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={e => setColor(e.target.value)}
                          className="bg-transparent flex-1 focus:outline-none text-gray-800 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effect Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {styles.map(styleOption => (
                        <button
                          key={styleOption.value}
                          type="button"
                          onClick={() => setStyle(styleOption.value as TextDesignConfig['style'])}
                          className={`p-2 rounded-md text-sm transition-colors ${
                            style === styleOption.value 
                              ? 'bg-sky-500 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {styleOption.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Circular Text */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="bg-sky-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">3</div>
                  Circular Text
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isCircular"
                      checked={isCircular}
                      onChange={e => setIsCircular(e.target.checked)}
                      className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="isCircular" className="text-sm font-medium text-gray-700">
                      Enable Circular Text
                    </label>
                  </div>
                  
                  {isCircular && (
                    <div className="space-y-3 pl-4 border-l-2 border-sky-200">
                      <Slider
                        label="Circular Radius"
                        value={circularRadius}
                        onChange={setCircularRadius}
                        min={60}
                        max={200}
                        unit="px"
                      />
                      <Slider
                        label="Start Angle"
                        value={circularStartAngle}
                        onChange={setCircularStartAngle}
                        min={0}
                        max={360}
                        unit="°"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCircularDirection('clockwise')}
                            className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                              circularDirection === 'clockwise' 
                                ? 'bg-sky-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            Clockwise
                          </button>
                          <button
                            type="button"
                            onClick={() => setCircularDirection('counterclockwise')}
                            className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                              circularDirection === 'counterclockwise' 
                                ? 'bg-sky-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            Counter-clockwise
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Shape & Background */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="bg-sky-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">4</div>
                  Shape & Background
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Shape</label>
                    <div className="grid grid-cols-2 gap-2">
                      {shapes.map(shapeOption => (
                        <button
                          key={shapeOption.value}
                          type="button"
                          onClick={() => setShape(shapeOption.value as TextDesignConfig['shape'])}
                          className={`p-2 rounded-md text-sm transition-colors ${
                            shape === shapeOption.value 
                              ? 'bg-sky-500 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {shapeOption.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {shape !== 'none' && (
                    <div>
                      <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2 bg-white/50 border border-gray-900/10 rounded-md p-1">
                        <input
                          type="color"
                          id="backgroundColor"
                          value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                          onChange={e => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 p-0 border-none bg-transparent appearance-none cursor-pointer rounded-md"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={e => setBackgroundColor(e.target.value)}
                          className="bg-transparent flex-1 focus:outline-none text-gray-800 text-sm"
                          placeholder="transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold"
            >
              ✨ Create Text Design
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 