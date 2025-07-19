import React, { useState } from 'react';
import PatternCanvas from './PatternCanvas';
import PatternControls from './PatternControls';
import BackgroundControls from './BackgroundControls';
import ExportModal, { ExportOptions } from './ExportModal';

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

interface Background {
  type: 'solid' | 'gradient' | 'transparent';
  color?: string;
  startColor?: string;
  endColor?: string;
  angle?: number;
}

export default function PatternWorkspace() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [patternState, setPatternState] = useState<PatternState>({
    patternType: 'grid',
    gridCountX: 8,
    gridCountY: 8,
    spacing: 12,
    scale: 0,
    rotation: 0,
    offset: 0,
    alternate: false,
    opacity: 1,
    colorOverlay: {
      enabled: false,
      type: 'solid',
      color: '#ff6b6b',
      startColor: '#ff6b6b',
      endColor: '#4ecdc4',
      angle: 45,
      blendMode: 'multiply'
    },
    filters: {
      hue: 0,
      saturation: 100,
      brightness: 100,
      contrast: 100
    }
  });
  const [background, setBackground] = useState<Background>({
    type: 'solid',
    color: '#ffffff'
  });
  const [globalRotation, setGlobalRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExport = (options: ExportOptions) => {
    if (!imageSrc) return;

    // Create a temporary high-resolution canvas for export
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    exportCanvas.width = options.width;
    exportCanvas.height = options.height;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Set background
      if (background.type !== 'transparent') {
        if (background.type === 'solid') {
          ctx.fillStyle = background.color || '#ffffff';
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        } else if (background.type === 'gradient') {
          const gradient = ctx.createLinearGradient(0, 0, exportCanvas.width, exportCanvas.height);
          gradient.addColorStop(0, background.startColor || '#7dd3fc');
          gradient.addColorStop(1, background.endColor || '#f9a8d4');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        }
      }

      // Apply global transformations
      ctx.save();
      ctx.translate(exportCanvas.width / 2, exportCanvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.rotate((globalRotation * Math.PI) / 180);
      ctx.translate(-exportCanvas.width / 2, -exportCanvas.height / 2);

      // Generate pattern positions (scaled for export resolution)
      const scaleX = options.width / 800; // Scale from display canvas size
      const scaleY = options.height / 600;
      const { gridCountX, gridCountY, spacing, offset } = patternState;
      
      const effectiveSpacing = spacing * 2;
      const cellWidth = (options.width - effectiveSpacing * scaleX * (gridCountX - 1)) / gridCountX;
      const cellHeight = (options.height - effectiveSpacing * scaleY * (gridCountY - 1)) / gridCountY;

      for (let row = 0; row < gridCountY; row++) {
        for (let col = 0; col < gridCountX; col++) {
          let x = col * (cellWidth + effectiveSpacing * scaleX) + cellWidth / 2;
          let y = row * (cellHeight + effectiveSpacing * scaleY) + cellHeight / 2;

          // Apply pattern-specific positioning
          if (patternState.patternType === 'diamond') {
            if (row % 2 === 1) {
              x += cellWidth / 2;
            }
          } else if (patternState.patternType === 'checkerboard') {
            if ((row + col) % 2 === 1) {
              continue;
            }
          }

          // Apply pattern offset
          const effectiveOffset = offset * 2;
          x += effectiveOffset * scaleX;
          y += effectiveOffset * scaleY;

          // Apply alternating pattern if enabled
          if (patternState.alternate && (row + col) % 2 === 1) {
            x += 10 * scaleX;
            y += 10 * scaleY;
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((patternState.rotation * Math.PI) / 180);
          
          // Apply scaling
          const scaleValue = patternState.scale;
          const scaleFactor = scaleValue >= 0 
            ? 1 + (scaleValue / 100)
            : 0.1 + (0.9 * (scaleValue + 100) / 100);
          
          const scaledWidth = (img.width * scaleFactor) * 0.3 * scaleX;
          const scaledHeight = (img.height * scaleFactor) * 0.3 * scaleY;
          
          // Apply opacity
          ctx.globalAlpha = patternState.opacity;
          
          ctx.drawImage(
            img,
            -scaledWidth / 2,
            -scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );
          
          // Apply color overlay if enabled
          if (patternState.colorOverlay.enabled) {
            ctx.save();
            ctx.globalCompositeOperation = patternState.colorOverlay.blendMode;
            
            if (patternState.colorOverlay.type === 'solid') {
              ctx.fillStyle = patternState.colorOverlay.color || '#ff6b6b';
              ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
            } else if (patternState.colorOverlay.type === 'gradient') {
              const angle = (patternState.colorOverlay.angle || 45) * Math.PI / 180;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              const gradientLength = Math.abs(scaledWidth * cos) + Math.abs(scaledHeight * sin);
              
              const gradient = ctx.createLinearGradient(
                -gradientLength / 2 * cos, -gradientLength / 2 * sin,
                gradientLength / 2 * cos, gradientLength / 2 * sin
              );
              gradient.addColorStop(0, patternState.colorOverlay.startColor || '#ff6b6b');
              gradient.addColorStop(1, patternState.colorOverlay.endColor || '#4ecdc4');
              
              ctx.fillStyle = gradient;
              ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
            }
            
            ctx.restore();
          }
          
          // Reset blend mode and alpha
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          
          ctx.restore();
        }
      }

      ctx.restore();

      // Export based on format
      let dataURL: string;
      let filename: string;

      if (options.format === 'png') {
        dataURL = exportCanvas.toDataURL('image/png');
        filename = `pattern-${options.width}x${options.height}.png`;
      } else if (options.format === 'jpeg') {
        dataURL = exportCanvas.toDataURL('image/jpeg', options.quality / 100);
        filename = `pattern-${options.width}x${options.height}.jpg`;
      } else {
        // SVG export would need different implementation
        console.warn('SVG export not yet implemented');
        return;
      }

      // Download the file
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      link.click();
    };

    img.src = imageSrc;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pattern Maker</h1>
          <p className="text-gray-600">Upload an image and create patterns for print-on-demand items</p>
        </header>
        
        <div className="flex gap-6">
          {/* Controls Panel */}
          <aside className="w-[380px] space-y-6">
            {/* Upload Section */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-semibold text-gray-700 mb-4">Upload Image</h3>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageSrc && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">✅ Image uploaded! Configure your pattern below.</p>
                </div>
              )}
            </div>

            <PatternControls 
              state={patternState} 
              setState={setPatternState}
              disabled={!imageSrc}
            />
          </aside>

          {/* Canvas Area */}
          <main className="flex-1 space-y-6">
            <PatternCanvas
              imageSrc={imageSrc}
              patternState={patternState}
              background={background}
              globalRotation={globalRotation}
              zoom={zoom}
            />
            
            {/* Background and Canvas Controls - Positioned directly under canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BackgroundControls 
                background={background} 
                setBackground={setBackground} 
              />

              {/* Canvas Controls */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-semibold text-gray-700 mb-4">Canvas Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Global Zoom: {zoom.toFixed(2)}x
                    </label>
                    <input 
                      type="range" 
                      min="0.2" 
                      max="3" 
                      step="0.1" 
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Global Rotation: {globalRotation}°
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      step="1" 
                      value={globalRotation}
                      onChange={(e) => setGlobalRotation(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button 
                    onClick={() => setIsExportModalOpen(true)}
                    disabled={!imageSrc}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Export Pattern
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
} 