import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RefreshCw, Target } from 'lucide-react';
import Controls from './Controls';
import AlgorithmInfo from './AlgorithmInfo';
import { SEARCH_ALGORITHMS } from '../algorithms/searching';
import { getAlgorithmsByCategory } from '../data/algorithms';
import type { SearchFrame, Speed } from '../types';
import { SPEED_MS } from '../types';

interface Props {
  initialAlgorithm?: string;
}

function randomSortedArray(size: number): number[] {
  const s = new Set<number>();
  while (s.size < size) s.add(Math.floor(Math.random() * size * 3) + 1);
  return [...s].sort((a, b) => a - b);
}

function cellColor(idx: number, frame: SearchFrame): { bg: string; border: string; text: string } {
  if (frame.found === idx) return { bg: 'bg-emerald-500/30', border: 'border-emerald-400', text: 'text-emerald-300' };
  if (frame.found === -2 && frame.eliminated[idx]) return { bg: 'bg-slate-800/60', border: 'border-slate-700', text: 'text-slate-600' };
  if (frame.current.includes(idx)) return { bg: 'bg-amber-500/30', border: 'border-amber-400', text: 'text-amber-200' };
  if (frame.mid === idx) return { bg: 'bg-orange-500/30', border: 'border-orange-400', text: 'text-orange-200' };
  if (frame.eliminated[idx]) return { bg: 'bg-slate-800/40', border: 'border-slate-700/50', text: 'text-slate-600' };
  if (idx >= frame.low && idx <= frame.high) return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-slate-300' };
  return { bg: 'bg-bg-elevated', border: 'border-bg-overlay', text: 'text-slate-400' };
}

export default function SearchingVisualizer({ initialAlgorithm = 'binary' }: Props) {
  const algorithms = useMemo(() => getAlgorithmsByCategory('searching'), []);
  const [selectedAlgo, setSelectedAlgo] = useState(initialAlgorithm);
  const [arraySize, setArraySize] = useState(20);
  const [inputArray, setInputArray] = useState<number[]>(() => randomSortedArray(20));
  const [targetValue, setTargetValue] = useState<number>(0);
  const [targetInput, setTargetInput] = useState('');
  const [frames, setFrames] = useState<SearchFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('slow');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meta = useMemo(() => algorithms.find(a => a.id === selectedAlgo)!, [algorithms, selectedAlgo]);
  const currentFrame: SearchFrame | undefined = frames[frameIdx];

  // Pick random target from array
  const pickRandomTarget = useCallback((arr: number[]) => {
    const val = arr[Math.floor(Math.random() * arr.length)];
    setTargetValue(val);
    setTargetInput(String(val));
    return val;
  }, []);

  useEffect(() => {
    const arr = randomSortedArray(arraySize);
    setInputArray(arr);
    pickRandomTarget(arr);
  }, [arraySize, pickRandomTarget]);

  useEffect(() => { setSelectedAlgo(initialAlgorithm); }, [initialAlgorithm]);

  const generateFrames = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const fn = SEARCH_ALGORITHMS[selectedAlgo];
    if (fn) {
      const f = fn(inputArray, targetValue);
      setFrames(f);
      setFrameIdx(0);
    }
  }, [selectedAlgo, inputArray, targetValue]);

  useEffect(() => { generateFrames(); }, [generateFrames]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setFrameIdx(prev => {
          if (prev >= frames.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, SPEED_MS[speed]);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, frames.length]);

  const handleTargetChange = (val: string) => {
    setTargetInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n)) setTargetValue(n);
  };

  const handleNewArray = () => {
    const arr = randomSortedArray(arraySize);
    setInputArray(arr);
    pickRandomTarget(arr);
  };

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
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-bg-elevated text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Array visualization */}
      <div className="bg-bg-surface border border-bg-overlay rounded-xl p-4 space-y-4">
        {/* Target indicator */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Target size={14} className="text-orange-400" />
          <span className="text-slate-400">Target:</span>
          <span className="font-mono font-bold text-orange-300 text-lg">{targetValue}</span>
          {currentFrame && currentFrame.found >= 0 && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Found at index {currentFrame.found}
            </span>
          )}
          {currentFrame && currentFrame.found === -2 && (
            <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Not found
            </span>
          )}
        </div>

        {/* Array cells */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1.5 min-w-max sm:min-w-0">
            {(currentFrame?.array ?? inputArray).map((val, idx) => {
              const colors = currentFrame ? cellColor(idx, currentFrame) : { bg: 'bg-bg-elevated', border: 'border-bg-overlay', text: 'text-slate-400' };
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border font-mono text-xs sm:text-sm font-medium transition-all duration-150 ${colors.bg} ${colors.border} ${colors.text}`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] text-slate-600">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Range indicators (for binary/jump) */}
        {currentFrame && (currentFrame.low !== undefined || currentFrame.mid !== undefined) && (
          <div className="flex flex-wrap gap-3 text-xs">
            {currentFrame.low >= 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-slate-500">Low:</span>
                <span className="font-mono text-blue-300">{currentFrame.low}</span>
              </span>
            )}
            {currentFrame.mid >= 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-slate-500">Mid:</span>
                <span className="font-mono text-orange-300">{currentFrame.mid}</span>
              </span>
            )}
            {currentFrame.high >= 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                <span className="text-slate-500">High:</span>
                <span className="font-mono text-pink-300">{currentFrame.high}</span>
              </span>
            )}
          </div>
        )}

        {/* Step description */}
        {currentFrame && (
          <div className="text-sm text-slate-400 min-h-[1.25rem]">
            {currentFrame.description}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        {[
          { color: 'bg-indigo-500/10 border border-indigo-500/30', label: 'Search range' },
          { color: 'bg-amber-500/30 border border-amber-400', label: 'Checking' },
          { color: 'bg-orange-500/30 border border-orange-400', label: 'Mid point' },
          { color: 'bg-emerald-500/30 border border-emerald-400', label: 'Found' },
          { color: 'bg-slate-800/40 border border-slate-700/50', label: 'Eliminated' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded flex-shrink-0 ${color}`} />
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
        onPlay={() => { if (frameIdx >= frames.length - 1) setFrameIdx(0); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onReset={() => { setPlaying(false); setFrameIdx(0); }}
        onStepBack={() => setFrameIdx(p => Math.max(0, p - 1))}
        onStepForward={() => setFrameIdx(p => Math.min(frames.length - 1, p + 1))}
        onSpeedChange={setSpeed}
        onSeek={setFrameIdx}
        extraControls={
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-xs text-slate-400">Target value:</label>
              <input
                type="number"
                value={targetInput}
                onChange={e => handleTargetChange(e.target.value)}
                disabled={playing}
                className="w-full sm:w-20 bg-bg-elevated border border-bg-overlay rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-brand disabled:opacity-40"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-xs text-slate-400">Size: {arraySize}</label>
              <input
                type="range"
                min={8}
                max={32}
                value={arraySize}
                onChange={e => setArraySize(Number(e.target.value))}
                disabled={playing}
                className="w-full sm:w-20 accent-emerald-500"
              />
            </div>
            <button
              onClick={handleNewArray}
              disabled={playing}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 bg-bg-elevated hover:bg-bg-overlay text-slate-300 hover:text-white rounded-lg transition-colors disabled:opacity-40 w-full sm:w-auto"
            >
              <RefreshCw size={12} />
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
