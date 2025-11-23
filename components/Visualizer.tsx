import React from 'react';
import { VisualizerState } from '../types';

interface VisualizerProps {
  state: VisualizerState;
}

const Visualizer: React.FC<VisualizerProps> = ({ state }) => {
  const { array, compareIndices, swapIndices, sortedIndices } = state;
  const maxValue = Math.max(...array, 1);
  const count = array.length;

  // Determine bar color based on state
  const getBarColor = (index: number) => {
    if (swapIndices.includes(index)) return 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.6)] z-10'; // Red for swap with glow
    if (compareIndices.includes(index)) return 'bg-accent shadow-[0_0_10px_rgba(245,158,11,0.6)] z-10'; // Amber for compare with glow
    if (sortedIndices.includes(index)) return 'bg-secondary'; // Green for sorted
    return 'bg-primary/90 hover:bg-primary'; // Indigo for normal
  };

  // Adjust styling based on array count to ensure visibility
  // If many items, remove gap and rounding to prevent visual noise
  const gapClass = count > 60 ? 'gap-0' : 'gap-[2px]';
  const roundClass = count > 60 ? 'rounded-none' : 'rounded-t-sm';

  return (
    <div className="w-full h-full min-h-[400px] flex items-end justify-center px-4 pb-0 pt-8 bg-dark/50 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
        {/* Background grid lines for reference (optional visual aid) */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col justify-between p-4 pb-0">
            <div className="w-full h-px bg-white"></div>
            <div className="w-full h-px bg-white"></div>
            <div className="w-full h-px bg-white"></div>
            <div className="w-full h-px bg-white"></div>
        </div>

      <div className={`w-full h-full flex items-end ${gapClass}`}>
        {array.map((value, idx) => {
          const heightPercent = (value / maxValue) * 100;
          return (
            <div
              key={idx}
              className={`flex-1 transition-all duration-75 ${getBarColor(idx)} ${roundClass}`}
              style={{ 
                height: `${heightPercent}%`,
              }}
              title={`Index: ${idx}, Value: ${value}`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;