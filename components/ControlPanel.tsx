import React from 'react';
import { SortingAlgorithm } from '../types';
import { Play, RotateCcw, Pause, Settings2 } from 'lucide-react';

interface ControlPanelProps {
  algorithm: SortingAlgorithm;
  setAlgorithm: (algo: SortingAlgorithm) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isSorting: boolean;
  onStart: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  isSorting,
  onStart,
  onReset,
}) => {
  
  // Calculate display speed label
  const speedMultiplier = Math.round(1000 / Math.max(speed, 1));
  let speedLabel = `${speedMultiplier}x`;
  if (speedMultiplier > 200) speedLabel = "极速 (Max)";
  else if (speedMultiplier < 5) speedLabel = "慢速 (Slow)";

  return (
    <div className="flex flex-col gap-5 p-6 bg-dark rounded-xl border border-white/10 shadow-xl">
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings2 size={20} className="text-primary"/>
          参数配置
        </h2>
        
        {/* Algorithm Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">选择排序算法</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
            disabled={isSorting}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50 text-sm font-medium"
          >
            {Object.values(SortingAlgorithm).map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        {/* Array Size Slider */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-400">数据量 (数组大小)</label>
            <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{arraySize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed hover:accent-indigo-400 transition-all"
          />
        </div>

        {/* Speed Slider */}
        <div className="mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-400">动画速度</label>
            <span className="text-sm font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">{speedLabel}</span>
          </div>
          <input
            type="range"
            min="1"
            max="500"
            step="10"
            value={501 - speed}
            onChange={(e) => setSpeed(501 - Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary hover:accent-emerald-400 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
        <button
          onClick={onStart}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
            isSorting 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' 
              : 'bg-primary hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isSorting ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isSorting ? '暂停' : '开始排序'}
        </button>

        <button
          onClick={onReset}
          disabled={isSorting}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={20} />
          重置
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;