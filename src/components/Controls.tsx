import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap } from 'lucide-react';
import type { Speed } from '../types';
import { SPEED_MS } from '../types';

interface ControlsProps {
  playing: boolean;
  finished: boolean;
  currentFrame: number;
  totalFrames: number;
  speed: Speed;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (s: Speed) => void;
  onSeek?: (frame: number) => void;
  extraControls?: React.ReactNode;
}

const SPEEDS: Speed[] = ['slow', 'medium', 'fast', 'turbo'];
const SPEED_LABELS: Record<Speed, string> = { slow: '0.25×', medium: '1×', fast: '4×', turbo: 'Max' };

export default function Controls({
  playing, finished, currentFrame, totalFrames,
  speed, onPlay, onPause, onReset, onStepBack,
  onStepForward, onSpeedChange, onSeek, extraControls,
}: ControlsProps) {
  const progress = totalFrames > 0 ? (currentFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div className="bg-bg-surface border border-bg-overlay rounded-xl p-4 space-y-3">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Step {currentFrame + 1}</span>
          <span>{totalFrames} total</span>
        </div>
        <div className="relative h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-brand-lighter rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        {onSeek && (
          <input
            type="range"
            min={0}
            max={Math.max(0, totalFrames - 1)}
            value={currentFrame}
            onChange={e => onSeek(Number(e.target.value))}
            className="w-full h-1 mt-1 appearance-none bg-transparent cursor-pointer"
            style={{ marginTop: '-10px', opacity: 0, position: 'relative', zIndex: 10 }}
          />
        )}
      </div>

      {/* Playback buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onStepBack}
          disabled={currentFrame === 0}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step back"
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={playing ? onPause : onPlay}
          disabled={finished && !playing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand/25"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? 'Pause' : finished ? 'Replay' : 'Play'}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentFrame >= totalFrames - 1}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step forward"
        >
          <SkipForward size={16} />
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1 ml-2 bg-bg-elevated rounded-lg p-1">
          <Zap size={12} className="text-slate-500 ml-1" />
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                speed === s
                  ? 'bg-brand text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {SPEED_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Extra controls (e.g. array size, target value) */}
      {extraControls && <div className="pt-2 border-t border-bg-overlay">{extraControls}</div>}
    </div>
  );
}
