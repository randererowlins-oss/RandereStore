import React from 'react';

interface ScarcityBadgeProps {
  status: string;
  oneOfOne?: boolean;
  stockQuantity?: number;
  className?: string;
}

export const ScarcityBadge: React.FC<ScarcityBadgeProps> = ({
  status,
  oneOfOne,
  stockQuantity = 1,
  className = '',
}) => {
  if (status === 'SOLD' || stockQuantity <= 0) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-widest font-semibold uppercase bg-neutral-900 text-neutral-400 border border-neutral-700 ${className}`}
      >
        SOLD OUT
      </span>
    );
  }

  if (oneOfOne) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-widest font-bold uppercase bg-randere-accent text-black ${className}`}
      >
        ONE OF ONE
      </span>
    );
  }

  if (stockQuantity === 1) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-widest font-bold uppercase bg-randere-orange text-white ${className}`}
      >
        1 LEFT
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-widest font-medium uppercase border border-neutral-700 text-neutral-300 ${className}`}
    >
      LIMITED DROP
    </span>
  );
};
