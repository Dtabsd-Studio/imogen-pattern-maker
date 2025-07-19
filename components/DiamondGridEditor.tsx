/*  components/DiamondGridEditor.tsx
    ---------------------------------------------------------------
    One–file “playground” for the diamond grid generator:
      • gridCount   (tiles per row / column)
      • scale       (% of natural edge)
      • spacing     (extra gap in px)

    Usage:
      <DiamondGridEditor imageUrl={dataURL} />
---------------------------------------------------------------- */
import React, { useState } from 'react';
import { DiamondGridCanvas } from '@/components/DiamondGridCanvas';

/* --- Slider helper --- */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}
const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm font-medium">
      <span>{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      className="w-full accent-sky-500"
    />
  </div>
);

/* --- Editor component --- */
interface EditorProps {
  imageUrl: string;
}
export const DiamondGridEditor: React.FC<EditorProps> = ({ imageUrl }) => {
  const [grid, setGrid] = useState(5);           // 1-50
  const [scale, setScale] = useState(100);       // 5-300 %
  const [gap, setGap] = useState(0);             // 0-400 px

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* controls */}
      <aside className="w-full md:w-72 p-4 bg-white/70 backdrop-blur rounded-lg border border-white/30 shadow">
        <Slider label="Grid Tiles" min={1} max={50} value={grid} onChange={setGrid} />
        <Slider
          label="Icon Size"
          min={5}
          max={300}
          value={scale}
          unit="%"
          onChange={setScale}
        />
        <Slider
          label="Spacing"
          min={0}
          max={400}
          value={gap}
          unit="px"
          onChange={setGap}
        />
      </aside>

      {/* canvas */}
      <div className="flex-1 flex items-center justify-center">
        <DiamondGridCanvas
          imageUrl={imageUrl}
          gridCount={grid}
          scalePercent={scale}
          spacing={gap}
        />
      </div>
    </div>
  );
};

export { DiamondGridCanvas };
