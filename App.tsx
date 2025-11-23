import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SortingAlgorithm, VisualizerState, AlgoInfo } from './types';
import { getSorter } from './services/sortingAlgorithms';
import { fetchAlgorithmDetails } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import InfoPanel from './components/InfoPanel';
import { BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(SortingAlgorithm.BUBBLE);
  const [arraySize, setArraySize] = useState<number>(60); // Default to a reasonable size
  const [speed, setSpeed] = useState<number>(50); // Delay in ms
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [visualState, setVisualState] = useState<VisualizerState>({
    array: [],
    compareIndices: [],
    swapIndices: [],
    sortedIndices: [],
  });

  const [algoInfo, setAlgoInfo] = useState<AlgoInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(false);

  // --- Refs ---
  const sortingRef = useRef<boolean>(false); // Tracks if sort is active loop
  const speedRef = useRef<number>(speed);
  const pauseRef = useRef<boolean>(false); // Tracks pause state for the async loop

  // Sync refs
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pauseRef.current = isPaused; }, [isPaused]);

  // --- Helpers ---
  const generateArray = useCallback((size: number) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5); // +5 min value for visuals
    setVisualState({
      array: newArray,
      compareIndices: [],
      swapIndices: [],
      sortedIndices: [],
    });
    setIsSorting(false);
    setIsPaused(false);
    sortingRef.current = false;
  }, []);

  // --- Effects ---
  // Generate array on size change
  useEffect(() => {
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  // Fetch AI Info on algo change
  useEffect(() => {
    const loadInfo = async () => {
      setIsLoadingInfo(true);
      const info = await fetchAlgorithmDetails(algorithm);
      setAlgoInfo(info);
      setIsLoadingInfo(false);
    };
    loadInfo();
  }, [algorithm]);

  // --- Handlers ---
  const handleStart = async () => {
    // If currently sorting but paused, resume
    if (isSorting && isPaused) {
      setIsPaused(false);
      return;
    }
    
    // If currently sorting and running, pause
    if (isSorting && !isPaused) {
      setIsPaused(true);
      return;
    }

    // Start fresh sort
    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current = true;

    // Reset sorted states visually before starting, keep array
    setVisualState(prev => ({
       ...prev,
       compareIndices: [],
       swapIndices: [],
       sortedIndices: []
    }));

    const sorter = getSorter(algorithm);

    try {
      await sorter(
        visualState.array,
        async (newState) => {
          // Check cancellation
          if (!sortingRef.current) throw new Error("Reset");
          
          // Handle Pause: loop until unpaused or cancelled
          while (pauseRef.current) {
             if (!sortingRef.current) throw new Error("Reset");
             await new Promise(r => setTimeout(r, 100));
          }

          setVisualState((prev) => ({ ...prev, ...newState }));
        },
        () => !sortingRef.current, // Check cancel function
        () => speedRef.current // Get delay function
      );
    } catch (e) {
      // Sorter was cancelled/reset
      // console.log("Sort stopped:", e);
    } finally {
      if (sortingRef.current) {
         setIsSorting(false);
         setIsPaused(false);
         sortingRef.current = false;
      }
    }
  };

  const handleReset = () => {
    sortingRef.current = false; // Stops the async loop
    setIsPaused(false);
    setIsSorting(false);
    generateArray(arraySize);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-lg shadow-lg shadow-primary/20">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Java 算法可视化 AI
            </h1>
            <p className="text-xs text-slate-400">Powered by Google Gemini</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
             <span>未排序</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
             <span>比较中</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
             <span>交换/写入</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
             <span>已排序</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        
        {/* Left Column: Visualizer & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
          
          {/* Visualizer Area */}
          <div className="flex-1 bg-dark/30 rounded-xl relative flex flex-col">
             <Visualizer state={visualState} />
             {/* Overlay instructions if idle */}
             {!isSorting && visualState.sortedIndices.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-white/90 font-medium shadow-2xl transform translate-y-[-20px]">
                    调整参数并点击 <span className="text-primary font-bold">开始排序</span> 观看动态演示
                  </div>
                </div>
             )}
          </div>

          {/* Controls */}
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            arraySize={arraySize}
            setArraySize={setArraySize}
            speed={speed}
            setSpeed={setSpeed}
            isSorting={isSorting && !isPaused} // Show pause icon if running
            onStart={handleStart}
            onReset={handleReset}
          />
        </div>

        {/* Right Column: AI Info & Code */}
        <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[600px]">
          <InfoPanel info={algoInfo} loading={isLoadingInfo} />
        </div>

      </main>
    </div>
  );
};

export default App;