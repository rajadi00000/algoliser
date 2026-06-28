import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Eraser, Play, RotateCcw, MousePointer2, Square } from 'lucide-react';
import AlgorithmInfo from './AlgorithmInfo';
import { PATHFINDING_ALGORITHMS, createGrid } from '../algorithms/pathfinding';
import { getAlgorithmsByCategory } from '../data/algorithms';
import type { GridCell, PathFrame, Speed } from '../types';
import { SPEED_MS } from '../types';

interface Props {
  initialAlgorithm?: string;
}

type DrawMode = 'wall' | 'start' | 'end' | 'erase';

const ROWS = 20;
const COLS = 40;

function cellKey(r: number, c: number) { return `${r},${c}`; }

// Generate frames for animation
function buildPathFrames(
  visitedInOrder: [number, number][],
  path: [number, number][],
  noPath: boolean,
): PathFrame[] {
  const frames: PathFrame[] = [];
  const visitedSet = new Set<string>();

  for (const [r, c] of visitedInOrder) {
    visitedSet.add(cellKey(r, c));
    frames.push({ visitedSet: new Set(visitedSet), pathSet: new Set(), currentCell: cellKey(r, c), done: false, noPath: false });
  }
  if (noPath) {
    frames.push({ visitedSet: new Set(visitedSet), pathSet: new Set(), currentCell: null, done: true, noPath: true });
    return frames;
  }
  // Highlight path
  const pathSet = new Set<string>();
  for (const [r, c] of path) {
    pathSet.add(cellKey(r, c));
    frames.push({ visitedSet: new Set(visitedSet), pathSet: new Set(pathSet), currentCell: null, done: pathSet.size === path.length, noPath: false });
  }
  return frames;
}

export default function PathfindingVisualizer({ initialAlgorithm = 'bfs' }: Props) {
  const algorithms = useMemo(() => getAlgorithmsByCategory('pathfinding'), []);
  const [selectedAlgo, setSelectedAlgo] = useState(initialAlgorithm);
  const [grid, setGrid] = useState<GridCell[][]>(() => createGrid(ROWS, COLS));
  const [startCell, setStartCell] = useState<[number, number]>([10, 5]);
  const [endCell, setEndCell] = useState<[number, number]>([10, 34]);
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [frames, setFrames] = useState<PathFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('fast');
  const [hasRun, setHasRun] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const isPointerDownRef = useRef(false);
  const lastTouchedCellRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meta = useMemo(() => algorithms.find(a => a.id === selectedAlgo)!, [algorithms, selectedAlgo]);

  useEffect(() => { setSelectedAlgo(initialAlgorithm); }, [initialAlgorithm]);

  // Update start/end in grid
  useEffect(() => {
    setGrid(prev => {
      const g = prev.map(row => row.map(cell => {
        if (cell.kind === 'start' || cell.kind === 'end') return { ...cell, kind: 'empty' as const };
        return cell;
      }));
      g[startCell[0]][startCell[1]] = { ...g[startCell[0]][startCell[1]], kind: 'start' };
      g[endCell[0]][endCell[1]] = { ...g[endCell[0]][endCell[1]], kind: 'end' };
      return g;
    });
  }, [startCell, endCell]);

  const handleCellInteract = useCallback((row: number, col: number) => {
    if (playing) return;
    setGrid(prev => {
      const g = prev.map(r => r.map(c => ({ ...c })));
      const cell = g[row][col];
      if (cell.kind === 'start' || cell.kind === 'end') return g;

      if (drawMode === 'wall') {
        g[row][col] = { ...cell, kind: cell.kind === 'wall' ? 'empty' : 'wall' };
      } else if (drawMode === 'erase') {
        g[row][col] = { ...cell, kind: 'empty' };
      } else if (drawMode === 'start') {
        // Move start
        g[startCell[0]][startCell[1]] = { ...g[startCell[0]][startCell[1]], kind: 'empty' };
        g[row][col] = { ...cell, kind: 'start' };
        setStartCell([row, col]);
      } else if (drawMode === 'end') {
        g[endCell[0]][endCell[1]] = { ...g[endCell[0]][endCell[1]], kind: 'empty' };
        g[row][col] = { ...cell, kind: 'end' };
        setEndCell([row, col]);
      }
      return g;
    });
    // Clear visualization when grid changes
    setHasRun(false);
    setFrames([]);
    setFrameIdx(-1);
    setNoPath(false);
  }, [drawMode, playing, startCell, endCell]);

  const getCellCoordsFromTarget = useCallback((target: EventTarget | null): [number, number] | null => {
    if (!(target instanceof HTMLElement)) return null;
    const cellElement = target.closest<HTMLElement>('[data-row][data-col]');
    if (!cellElement) return null;

    const row = Number(cellElement.dataset.row);
    const col = Number(cellElement.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return null;
    return [row, col];
  }, []);

  const getCellCoordsFromPoint = useCallback((x: number, y: number): [number, number] | null => {
    const element = document.elementFromPoint(x, y);
    if (!(element instanceof HTMLElement)) return null;
    const cellElement = element.closest<HTMLElement>('[data-row][data-col]');
    if (!cellElement) return null;

    const row = Number(cellElement.dataset.row);
    const col = Number(cellElement.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return null;
    return [row, col];
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (playing) return;
    const coords = getCellCoordsFromTarget(e.target);
    if (!coords) return;

    isPointerDownRef.current = true;
    lastTouchedCellRef.current = cellKey(coords[0], coords[1]);
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }
    handleCellInteract(coords[0], coords[1]);
  }, [getCellCoordsFromTarget, handleCellInteract, playing]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || playing) return;
    if (drawMode === 'start' || drawMode === 'end') return;

    let coords: [number, number] | null = null;
    if (e.pointerType === 'touch') {
      coords = getCellCoordsFromPoint(e.clientX, e.clientY);
    } else {
      coords = getCellCoordsFromTarget(e.target);
    }
    
    if (!coords) return;

    const key = cellKey(coords[0], coords[1]);
    if (key === lastTouchedCellRef.current) return;

    lastTouchedCellRef.current = key;
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }
    handleCellInteract(coords[0], coords[1]);
  }, [drawMode, getCellCoordsFromTarget, getCellCoordsFromPoint, handleCellInteract, playing]);

  const stopPointerInteraction = useCallback(() => {
    isPointerDownRef.current = false;
    lastTouchedCellRef.current = null;
  }, []);

  const handleVisualize = () => {
    if (playing) return;
    const fn = PATHFINDING_ALGORITHMS[selectedAlgo];
    if (!fn) return;

    const result = fn(grid, startCell, endCell);
    const f = buildPathFrames(result.visitedInOrder, result.path, result.noPath);
    setFrames(f);
    setFrameIdx(0);
    setHasRun(true);
    setNoPath(result.noPath);
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopPointerInteraction();
    setFrames([]);
    setFrameIdx(-1);
    setHasRun(false);
    setNoPath(false);
  };

  const handleClearWalls = () => {
    handleReset();
    setGrid(createGrid(ROWS, COLS));
    setStartCell([10, 5]);
    setEndCell([10, 34]);
  };

  // Animation
  useEffect(() => {
    if (playing && frames.length > 0) {
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

  // Determine cell visual state
  const currentFrame = frameIdx >= 0 ? frames[frameIdx] : null;

  function getCellStyle(cell: GridCell): string {
    const key = cellKey(cell.row, cell.col);
    if (cell.kind === 'start') return 'bg-emerald-500 border-emerald-400 scale-105';
    if (cell.kind === 'end') return 'bg-rose-500 border-rose-400 scale-105';
    if (cell.kind === 'wall') return 'bg-slate-600 border-slate-500';

    if (currentFrame) {
      if (currentFrame.pathSet.has(key)) return 'bg-amber-400 border-amber-300 scale-105';
      if (currentFrame.currentCell === key) return 'bg-orange-400 border-orange-300 scale-110';
      if (currentFrame.visitedSet.has(key)) return 'bg-blue-700 border-blue-600';
    }
    return 'bg-bg-elevated border-bg-overlay hover:bg-bg-overlay cursor-crosshair';
  }

  const visited = currentFrame ? currentFrame.visitedSet.size : 0;
  const pathLen = currentFrame ? currentFrame.pathSet.size : 0;

  return (
    <div className="space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {algorithms.map(a => (
          <button
            key={a.id}
            onClick={() => { setSelectedAlgo(a.id); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedAlgo === a.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-bg-elevated text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        {/* Draw modes */}
        <div className="flex flex-wrap bg-bg-elevated rounded-lg p-1 gap-1 w-full lg:w-auto">
          {([
            { mode: 'wall' as DrawMode, Icon: Square, label: 'Wall', color: undefined },
            { mode: 'erase' as DrawMode, Icon: Eraser, label: 'Erase', color: undefined },
            { mode: 'start' as DrawMode, label: 'Move Start', color: 'text-emerald-400' },
            { mode: 'end' as DrawMode, label: 'Move End', color: 'text-rose-400' },
          ] as const).map(({ mode, label, color }) => (
            <button
              key={mode}
              onClick={() => setDrawMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                drawMode === mode ? 'bg-brand text-white' : `text-slate-400 hover:text-white ${color ?? ''}`
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 lg:ml-auto w-full lg:w-auto">
          <button
            onClick={handleClearWalls}
            disabled={playing}
            className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-bg-elevated hover:bg-bg-overlay text-slate-300 rounded-lg transition-colors disabled:opacity-40 w-full sm:w-auto"
          >
            <RotateCcw size={12} />
            Clear
          </button>
          <button
            onClick={playing ? () => setPlaying(false) : handleVisualize}
            className={`flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
              playing
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/25'
            }`}
          >
            <Play size={12} />
            {playing ? 'Stop' : hasRun ? 'Re-run' : 'Visualize'}
          </button>
        </div>
      </div>

      {/* Speed control */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span>Speed:</span>
        <div className="flex flex-wrap bg-bg-elevated rounded-lg p-1 gap-1">
          {(['slow', 'medium', 'fast', 'turbo'] as Speed[]).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                speed === s ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats */}
        {hasRun && (
          <div className="flex flex-wrap gap-4 sm:ml-4">
            <span>Visited: <span className="text-blue-400 font-mono">{visited}</span></span>
            {!noPath && <span>Path: <span className="text-amber-400 font-mono">{pathLen}</span> cells</span>}
            {noPath && <span className="text-rose-400">No path found!</span>}
          </div>
        )}
      </div>

      {/* Grid */}
      <div
        className="bg-bg-surface border border-bg-overlay rounded-xl p-2 sm:p-3 overflow-auto select-none"
      >
        <div
          className="grid gap-px w-full max-w-full mx-auto touch-none"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPointerInteraction}
          onPointerCancel={stopPointerInteraction}
          onPointerLeave={stopPointerInteraction}
        >
          {grid.map(row =>
            row.map(cell => (
              <div
                key={cellKey(cell.row, cell.col)}
                data-row={cell.row}
                data-col={cell.col}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border rounded-[2px] transition-all duration-75 ${getCellStyle(cell)}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
        {[
          { cls: 'bg-emerald-500', label: 'Start' },
          { cls: 'bg-rose-500',    label: 'End' },
          { cls: 'bg-slate-600',   label: 'Wall' },
          { cls: 'bg-blue-700',    label: 'Visited' },
          { cls: 'bg-orange-400',  label: 'Current' },
          { cls: 'bg-amber-400',   label: 'Path' },
        ].map(({ cls, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${cls}`} />
            {label}
          </span>
        ))}
        <span className="text-slate-600 ml-auto hidden sm:block">
          <MousePointer2 size={12} className="inline mr-1" />
          Click &amp; drag to draw walls
        </span>
      </div>

      {/* Algorithm info */}
      <AlgorithmInfo meta={meta} />
    </div>
  );
}
