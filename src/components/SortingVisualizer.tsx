import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Shuffle } from 'lucide-react';
import Controls from './Controls';
import AlgorithmInfo from './AlgorithmInfo';
import { SORT_ALGORITHMS } from '../algorithms/sorting';
import { getAlgorithmsForPage, getDefaultAlgorithmId } from '../navigation';
import type { SortFrame, Speed } from '../types';
import { SPEED_MS } from '../types';

interface Props {
  initialAlgorithm?: string;
}

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function barColor(
  idx: number,
  frame: SortFrame,
): string {
  if (frame.sorted.includes(idx)) return '#34d399';   // emerald – sorted
  if (frame.swapping.includes(idx)) return '#f43f5e';  // rose – swapping
  if (frame.pivot === idx) return '#a78bfa';           // violet – pivot
  if (frame.comparing.includes(idx)) return '#fbbf24'; // amber – comparing
  return '#818cf8';                                    // indigo – default
}

export default function SortingVisualizer({ initialAlgorithm = getDefaultAlgorithmId('sorting') }: Props) {
  const algorithms = useMemo(() => getAlgorithmsForPage('sorting'), []);
  const [selectedAlgo, setSelectedAlgo] = useState(initialAlgorithm);
  const [arraySize, setArraySize] = useState(40);
  const [inputArray, setInputArray] = useState<number[]>(() => randomArray(40));
  const [frames, setFrames] = useState<SortFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('medium');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meta = useMemo(() => algorithms.find(a => a.id === selectedAlgo)!, [algorithms, selectedAlgo]);
  const currentFrame: SortFrame | undefined = frames[frameIdx];

  // Generate frames when algo or array changes
  const generateFrames = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const fn = SORT_ALGORITHMS[selectedAlgo];
    if (fn) {
      const f = fn(inputArray);
      setFrames(f);
      setFrameIdx(0);
    }
  }, [selectedAlgo, inputArray]);

  useEffect(() => { generateFrames(); }, [generateFrames]);

  // Update algo when prop changes
  useEffect(() => { setSelectedAlgo(initialAlgorithm); }, [initialAlgorithm]);

  // Animation loop
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setFrameIdx(prev => {
          if (prev >= frames.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, SPEED_MS[speed]);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, frames.length]);

  const handleNewArray = () => {
    const arr = randomArray(arraySize);
    setInputArray(arr);
  };

  const handleSizeChange = (size: number) => {
    setArraySize(size);
    setInputArray(randomArray(size));
  };

  const handleReset = () => {
    setPlaying(false);
    setFrameIdx(0);
  };

  const handlePlay = () => {
    if (frameIdx >= frames.length - 1) setFrameIdx(0);
    setPlaying(true);
  };

  const displayArray = currentFrame?.array ?? inputArray;
  const maxVal = Math.max(...displayArray, 1);
  const finished = frameIdx >= frames.length - 1;

  return (
    <div className="space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {algorithms.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAlgo(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedAlgo === a.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-bg-elevated text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-bg-surface border border-bg-overlay rounded-xl p-4">
        <div
          className="flex items-end gap-px w-full h-[180px] sm:h-[240px]"
          aria-label="Sorting visualization"
        >
          {displayArray.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t transition-all duration-75"
              style={{
                height: `${(val / maxVal) * 100}%`,
                backgroundColor: currentFrame ? barColor(idx, currentFrame) : '#818cf8',
                minWidth: 2,
              }}
              title={`${val}`}
            />
          ))}
        </div>

        {/* Step description */}
        {currentFrame && (
          <div className="mt-3 text-center text-xs sm:text-sm text-slate-400 min-h-[1.5rem]">
            {currentFrame.description}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        {[
          { color: '#818cf8', label: 'Default' },
          { color: '#fbbf24', label: 'Comparing' },
          { color: '#f43f5e', label: 'Swapping' },
          { color: '#a78bfa', label: 'Pivot' },
          { color: '#34d399', label: 'Sorted' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Controls */}
      <Controls
        playing={playing}
        finished={finished}
        currentFrame={frameIdx}
        totalFrames={frames.length}
        speed={speed}
        onPlay={handlePlay}
        onPause={() => setPlaying(false)}
        onReset={handleReset}
        onStepBack={() => setFrameIdx(p => Math.max(0, p - 1))}
        onStepForward={() => setFrameIdx(p => Math.min(frames.length - 1, p + 1))}
        onSpeedChange={setSpeed}
        onSeek={setFrameIdx}
        extraControls={
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-xs text-slate-400 whitespace-nowrap">Array size: {arraySize}</label>
              <input
                type="range"
                min={10}
                max={100}
                value={arraySize}
                onChange={e => handleSizeChange(Number(e.target.value))}
                className="w-full sm:w-24 accent-violet-500"
                disabled={playing}
              />
            </div>
            <button
              onClick={handleNewArray}
              disabled={playing}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 bg-bg-elevated hover:bg-bg-overlay text-slate-300 hover:text-white rounded-lg transition-colors disabled:opacity-40 w-full sm:w-auto"
            >
              <Shuffle size={12} />
              New Array
            </button>
          </div>
        }
      />

      {/* Algorithm info */}
      <AlgorithmInfo meta={meta} />
    </div>
  );
}
