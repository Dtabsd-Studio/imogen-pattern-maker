import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg';
  width: number;
  height: number;
  dpi: number;
  quality: number; // 0-100 for JPEG
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [preset, setPreset] = useState<string>('custom');
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(3000);
  const [dpi, setDpi] = useState(300);
  const [quality, setQuality] = useState(95);

  // Common POD product presets
  const presets = {
    'custom': { width: 3000, height: 3000, label: 'Custom' },
    'tshirt': { width: 4500, height: 5400, label: 'T-Shirt (15" x 18")' },
    'poster_small': { width: 3600, height: 2400, label: 'Poster 12" x 8"' },
    'poster_large': { width: 7200, height: 4800, label: 'Poster 24" x 16"' },
    'phone_case': { width: 1800, height: 3000, label: 'Phone Case' },
    'tote_bag': { width: 4200, height: 4200, label: 'Tote Bag 14" x 14"' },
    'mug_wrap': { width: 2475, height: 1155, label: 'Mug Wrap 8.25" x 3.85"' },
    'pillow': { width: 4800, height: 4800, label: 'Pillow 16" x 16"' },
    'canvas_print': { width: 7200, height: 7200, label: 'Canvas Print 24" x 24"' }
  };

  const handlePresetChange = (presetKey: string) => {
    setPreset(presetKey);
    if (presetKey !== 'custom') {
      const presetData = presets[presetKey as keyof typeof presets];
      setWidth(presetData.width);
      setHeight(presetData.height);
    }
  };

  const handleExport = () => {
    onExport({
      format,
      width,
      height,
      dpi,
      quality
    });
    onClose();
  };

  const estimatedFileSize = () => {
    const pixels = width * height;
    if (format === 'png') {
      return `~${Math.round(pixels * 4 / 1024 / 1024)}MB`;
    } else if (format === 'jpeg') {
      return `~${Math.round(pixels * 3 * (quality / 100) / 1024 / 1024)}MB`;
    } else {
      return '~1-5MB';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Export Pattern</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* File Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">File Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'png', label: 'PNG', desc: 'Best for transparency' },
                { value: 'jpeg', label: 'JPEG', desc: 'Smaller file size' },
                { value: 'svg', label: 'SVG', desc: 'Vector (scalable)' }
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value as any)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    format === value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Size Preset</label>
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(presets).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (pixels)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="100"
                max="20000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (pixels)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="100"
                max="20000"
              />
            </div>
          </div>

          {/* DPI Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DPI (Dots Per Inch): {dpi}
            </label>
            <input
              type="range"
              min="72"
              max="600"
              step="1"
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>72 DPI (Web)</span>
              <span>300 DPI (Print)</span>
              <span>600 DPI (High-end)</span>
            </div>
          </div>

          {/* JPEG Quality */}
          {format === 'jpeg' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Export Info</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Dimensions:</span>
                <div>{width} × {height} pixels</div>
              </div>
              <div>
                <span className="font-medium">Print Size:</span>
                <div>{(width / dpi).toFixed(1)}" × {(height / dpi).toFixed(1)}"</div>
              </div>
              <div>
                <span className="font-medium">Estimated Size:</span>
                <div>{estimatedFileSize()}</div>
              </div>
              <div>
                <span className="font-medium">Best For:</span>
                <div>{dpi >= 300 ? 'Print' : dpi >= 150 ? 'Web/Print' : 'Web Only'}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
            >
              Export Pattern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 