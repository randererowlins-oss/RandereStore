import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'FOUND (THRIFT SOURCE)',
  afterLabel = 'RANDERE REWORKED',
  title = 'THE TRANSFORMATION',
  subtitle = 'Drag the slider to reveal how forgotten thrift garments are deconstructed, tailored, and hand-treated into runway-grade streetwear.',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full">
      {/* Slider viewport */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden bg-neutral-900 border border-randere-border cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />

        {/* Before Image (Clipped Foreground) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 h-full w-full object-cover object-center filter grayscale contrast-125"
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 text-[11px] font-mono tracking-widest font-bold uppercase bg-black/80 text-neutral-300 border border-neutral-700 backdrop-blur-sm">
            {beforeLabel}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 text-[11px] font-mono tracking-widest font-bold uppercase bg-randere-accent text-black font-semibold shadow-md">
            {afterLabel}
          </span>
        </div>

        {/* Divider Line & Drag Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-black border-2 border-randere-accent text-white flex items-center justify-center rounded-none shadow-2xl">
            <ArrowLeftRight className="w-4 h-4 text-randere-accent" />
          </div>
        </div>
      </div>

      {/* Instructional caption */}
      <div className="flex items-center justify-between text-xs font-mono text-randere-muted mt-3">
        <span>← FOUND ARCHIVE</span>
        <span className="text-randere-chalk uppercase tracking-widest flex items-center gap-1">
          SLIDE TO COMPARE
        </span>
        <span>RANDERE REWORK →</span>
      </div>
    </div>
  );
};
