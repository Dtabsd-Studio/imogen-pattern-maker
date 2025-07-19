import React, { useRef, useEffect } from 'react';

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

interface PatternCanvasProps {
  imageSrc: string | null;
  patternState: PatternState;
  background: Background;
  globalRotation: number;
  zoom: number;
}

export default function PatternCanvas({ 
  imageSrc, 
  patternState, 
  background, 
  globalRotation, 
  zoom 
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate pattern positions based on type
  const generatePatternPositions = () => {
    const { gridCountX, gridCountY, spacing, offset } = patternState;
    const positions: Array<{ x: number; y: number; index: number }> = [];
    
    const canvasWidth = 800;
    const canvasHeight = 600;
    // Double the effect of spacing for faster/more noticeable changes
    const effectiveSpacing = spacing * 2;
    const cellWidth = (canvasWidth - effectiveSpacing * (gridCountX - 1)) / gridCountX;
    const cellHeight = (canvasHeight - effectiveSpacing * (gridCountY - 1)) / gridCountY;

          for (let row = 0; row < gridCountY; row++) {
        for (let col = 0; col < gridCountX; col++) {
          let x = col * (cellWidth + effectiveSpacing) + cellWidth / 2;
          let y = row * (cellHeight + effectiveSpacing) + cellHeight / 2;

          // Apply pattern-specific positioning
          if (patternState.patternType === 'diamond') {
            // Offset alternate rows for diamond pattern
            if (row % 2 === 1) {
              x += cellWidth / 2;
            }
          } else if (patternState.patternType === 'checkerboard') {
            // Skip alternate positions for checkerboard
            if ((row + col) % 2 === 1) {
              continue;
            }
          }

          // Apply pattern offset with doubled effect for faster changes
          const effectiveOffset = offset * 2;
          x += effectiveOffset;
          y += effectiveOffset;

        // Apply alternating pattern if enabled
        if (patternState.alternate && (row + col) % 2 === 1) {
          // Alternate items can be offset, rotated differently, etc.
          x += 10;
          y += 10;
        }

        positions.push({ x, y, index: row * gridCountX + col });
      }
    }

    return positions;
  };

  // Get background style
  const getBackgroundStyle = () => {
    if (background.type === 'solid') {
      return background.color || '#ffffff';
    } else if (background.type === 'gradient') {
      const angle = background.angle || 90;
      const startColor = background.startColor || '#7dd3fc';
      const endColor = background.endColor || '#f9a8d4';
      return `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
    } else {
      return 'transparent';
    }
  };

  // Update canvas whenever props change
  useEffect(() => {
    if (!canvasRef.current || !imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background
      if (background.type !== 'transparent') {
        const backgroundStyle = getBackgroundStyle();
        if (background.type === 'solid') {
          ctx.fillStyle = backgroundStyle;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (background.type === 'gradient') {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, background.startColor || '#7dd3fc');
          gradient.addColorStop(1, background.endColor || '#f9a8d4');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Apply global transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.rotate((globalRotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Generate and draw pattern
      const positions = generatePatternPositions();
      positions.forEach(({ x, y, index }) => {
        ctx.save();
        
        // Move to position
        ctx.translate(x, y);
        
        // Apply image rotation
        ctx.rotate((patternState.rotation * Math.PI) / 180);
        
        // Apply scaling - convert -100 to +100 range to scale factor
        // -100 = 10% (0.1), 0 = 100% (1.0), +100 = 200% (2.0)
        const scaleValue = patternState.scale;
        const scaleFactor = scaleValue >= 0 
          ? 1 + (scaleValue / 100) // 0 to +100 becomes 1.0 to 2.0
          : 0.1 + (0.9 * (scaleValue + 100) / 100); // -100 to 0 becomes 0.1 to 1.0
        const scaledWidth = (img.width * scaleFactor) * 0.3; // Scale down for pattern
        const scaledHeight = (img.height * scaleFactor) * 0.3;
        
        // Apply opacity
        ctx.globalAlpha = patternState.opacity;
        
        // Draw image centered at position
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
      });

      ctx.restore();
    };

    img.src = imageSrc;
  }, [imageSrc, patternState, background, globalRotation, zoom]);

  const positions = generatePatternPositions();

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Pattern Preview</h3>
        <div className="text-sm text-gray-500">
          {positions.length} items • {patternState.patternType} layout
        </div>
      </div>
      
      <div className="relative">
        {/* Canvas for rendering and export */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border border-gray-300 rounded-lg"
          style={{
            background: background.type === 'transparent' 
              ? 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'a\' patternUnits=\'userSpaceOnUse\' width=\'20\' height=\'20\'%3e%3crect x=\'0\' y=\'0\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3e%3crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3e%3crect x=\'0\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23f3f4f6\'/%3e%3crect x=\'10\' y=\'0\' width=\'10\' height=\'10\' fill=\'%23f3f4f6\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3e%3c/svg%3e")'
              : getBackgroundStyle(),
            filter: `hue-rotate(${patternState.filters.hue}deg) saturate(${patternState.filters.saturation}%) brightness(${patternState.filters.brightness}%) contrast(${patternState.filters.contrast}%)`
          }}
        />
        
        {/* SVG overlay for visual debugging (optional) */}
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="absolute top-0 left-0 w-full h-auto pointer-events-none opacity-20"
          style={{ display: 'none' }} // Hidden by default, can be shown for debugging
        >
          {positions.map(({ x, y, index }) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="red"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* No image placeholder */}
        {!imageSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">Upload an image to start</p>
              <p className="text-sm">Your pattern will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Info */}
      {imageSrc && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Pattern:</span>
              <span className="ml-1 text-blue-700 capitalize">{patternState.patternType}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Items:</span>
              <span className="ml-1 text-blue-700">{positions.length}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Grid:</span>
              <span className="ml-1 text-blue-700">{patternState.gridCountX} × {patternState.gridCountY}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Scale:</span>
              <span className="ml-1 text-blue-700">
                {patternState.scale >= 0 
                  ? `${Math.round((1 + patternState.scale / 100) * 100)}%`
                  : `${Math.round((0.1 + 0.9 * (patternState.scale + 100) / 100) * 100)}%`
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 