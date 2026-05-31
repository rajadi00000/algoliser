// ─── Sorting ─────────────────────────────────────────────────────────────────
export interface SortFrame {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  description: string;
}

// ─── Searching ────────────────────────────────────────────────────────────────
export interface SearchFrame {
  array: number[];
  target: number;
  current: number[];      // cells currently being examined
  eliminated: boolean[];  // which indices are eliminated from search
  low: number;
  high: number;
  mid: number;
  found: number;          // -1 = searching, -2 = not found, >=0 = found index
  description: string;
}

// ─── Pathfinding ──────────────────────────────────────────────────────────────
export type CellKind = 'empty' | 'wall' | 'start' | 'end';

export interface GridCell {
  row: number;
  col: number;
  kind: CellKind;
  distance: number;
  heuristic: number;
  previous: [number, number] | null;
}

export interface PathfindingResult {
  visitedInOrder: [number, number][];
  path: [number, number][];
  noPath: boolean;
}

export interface PathFrame {
  visitedSet: Set<string>;
  pathSet: Set<string>;
  currentCell: string | null;
  done: boolean;
  noPath: boolean;
}

// ─── Algorithm metadata ───────────────────────────────────────────────────────
export type AlgorithmCategory = 'sorting' | 'searching' | 'pathfinding';

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  stable: boolean;
  description: string;
  pseudoCode: string[];
}

// ─── App State ────────────────────────────────────────────────────────────────
export type Page = 'home' | 'sorting' | 'searching' | 'pathfinding';
export type Speed = 'slow' | 'medium' | 'fast' | 'turbo';
export const SPEED_MS: Record<Speed, number> = {
  slow:   400,
  medium: 120,
  fast:   30,
  turbo:  5,
};
