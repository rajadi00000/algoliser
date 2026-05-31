import type { GridCell, PathfindingResult } from '../types';

export type Grid = GridCell[][];

// ─── Grid utilities ───────────────────────────────────────────────────────────
export function createGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col): GridCell => ({
      row, col,
      kind: 'empty',
      distance: Infinity,
      heuristic: 0,
      previous: null,
    }))
  );
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

function getNeighbours(grid: Grid, row: number, col: number): GridCell[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const neighbours: GridCell[] = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 4-directional
  for (const [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbours.push(grid[nr][nc]);
    }
  }
  return neighbours;
}

function reconstructPath(grid: Grid, end: [number, number]): [number, number][] {
  const path: [number, number][] = [];
  let current: [number, number] | null = end;
  while (current) {
    path.unshift(current);
    const [r, c] = current;
    current = grid[r][c].previous;
  }
  return path;
}

function manhattan(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

// ─── BFS ──────────────────────────────────────────────────────────────────────
export function bfs(inputGrid: Grid, start: [number, number], end: [number, number]): PathfindingResult {
  const grid = cloneGrid(inputGrid);
  const [sr, sc] = start;
  const [er, ec] = end;
  const visitedInOrder: [number, number][] = [];
  const queue: [number, number][] = [[sr, sc]];
  const visited = new Set<string>();
  visited.add(`${sr},${sc}`);
  grid[sr][sc].distance = 0;

  while (queue.length) {
    const [r, c] = queue.shift()!;
    visitedInOrder.push([r, c]);
    if (r === er && c === ec) {
      return { visitedInOrder, path: reconstructPath(grid, end), noPath: false };
    }
    for (const nb of getNeighbours(grid, r, c)) {
      const key = `${nb.row},${nb.col}`;
      if (!visited.has(key) && nb.kind !== 'wall') {
        visited.add(key);
        nb.previous = [r, c];
        queue.push([nb.row, nb.col]);
      }
    }
  }
  return { visitedInOrder, path: [], noPath: true };
}

// ─── DFS ──────────────────────────────────────────────────────────────────────
export function dfs(inputGrid: Grid, start: [number, number], end: [number, number]): PathfindingResult {
  const grid = cloneGrid(inputGrid);
  const [sr, sc] = start;
  const [er, ec] = end;
  const visitedInOrder: [number, number][] = [];
  const stack: [number, number][] = [[sr, sc]];
  const visited = new Set<string>();

  while (stack.length) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    visitedInOrder.push([r, c]);
    if (r === er && c === ec) {
      return { visitedInOrder, path: reconstructPath(grid, end), noPath: false };
    }
    for (const nb of getNeighbours(grid, r, c)) {
      const nbKey = `${nb.row},${nb.col}`;
      if (!visited.has(nbKey) && nb.kind !== 'wall') {
        if (!nb.previous) nb.previous = [r, c];
        stack.push([nb.row, nb.col]);
      }
    }
  }
  return { visitedInOrder, path: [], noPath: true };
}

// ─── Dijkstra ─────────────────────────────────────────────────────────────────
export function dijkstra(inputGrid: Grid, start: [number, number], end: [number, number]): PathfindingResult {
  const grid = cloneGrid(inputGrid);
  const [sr, sc] = start;
  const [er, ec] = end;
  const visitedInOrder: [number, number][] = [];
  grid[sr][sc].distance = 0;

  // Simple priority queue using sorted array (good enough for grid sizes)
  const unvisited: GridCell[] = [];
  for (const row of grid) for (const cell of row) if (cell.kind !== 'wall') unvisited.push(cell);

  const visited = new Set<string>();

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift()!;
    if (current.distance === Infinity) break;
    const { row: r, col: c } = current;
    if (visited.has(`${r},${c}`)) continue;
    visited.add(`${r},${c}`);
    visitedInOrder.push([r, c]);
    if (r === er && c === ec) {
      return { visitedInOrder, path: reconstructPath(grid, end), noPath: false };
    }
    for (const nb of getNeighbours(grid, r, c)) {
      if (nb.kind === 'wall' || visited.has(`${nb.row},${nb.col}`)) continue;
      const newDist = current.distance + 1;
      if (newDist < nb.distance) {
        nb.distance = newDist;
        nb.previous = [r, c];
      }
    }
  }
  return { visitedInOrder, path: [], noPath: true };
}

// ─── A* ───────────────────────────────────────────────────────────────────────
export function aStar(inputGrid: Grid, start: [number, number], end: [number, number]): PathfindingResult {
  const grid = cloneGrid(inputGrid);
  const [sr, sc] = start;
  const [er, ec] = end;
  const visitedInOrder: [number, number][] = [];

  grid[sr][sc].distance = 0;
  grid[sr][sc].heuristic = manhattan(sr, sc, er, ec);

  const openSet: GridCell[] = [grid[sr][sc]];
  const visited = new Set<string>();
  const gScore = new Map<string, number>();
  gScore.set(`${sr},${sc}`, 0);

  while (openSet.length) {
    openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
    const current = openSet.shift()!;
    const { row: r, col: c } = current;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    visitedInOrder.push([r, c]);

    if (r === er && c === ec) {
      return { visitedInOrder, path: reconstructPath(grid, end), noPath: false };
    }

    for (const nb of getNeighbours(grid, r, c)) {
      if (nb.kind === 'wall' || visited.has(`${nb.row},${nb.col}`)) continue;
      const tentativeG = (gScore.get(key) ?? Infinity) + 1;
      const nbKey = `${nb.row},${nb.col}`;
      if (tentativeG < (gScore.get(nbKey) ?? Infinity)) {
        gScore.set(nbKey, tentativeG);
        nb.distance = tentativeG;
        nb.heuristic = manhattan(nb.row, nb.col, er, ec);
        nb.previous = [r, c];
        openSet.push(nb);
      }
    }
  }
  return { visitedInOrder, path: [], noPath: true };
}

// ─── Greedy Best-First Search ─────────────────────────────────────────────────
export function greedyBFS(inputGrid: Grid, start: [number, number], end: [number, number]): PathfindingResult {
  const grid = cloneGrid(inputGrid);
  const [sr, sc] = start;
  const [er, ec] = end;
  const visitedInOrder: [number, number][] = [];
  grid[sr][sc].heuristic = manhattan(sr, sc, er, ec);

  const openSet: GridCell[] = [grid[sr][sc]];
  const visited = new Set<string>();

  while (openSet.length) {
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const current = openSet.shift()!;
    const { row: r, col: c } = current;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    visitedInOrder.push([r, c]);

    if (r === er && c === ec) {
      return { visitedInOrder, path: reconstructPath(grid, end), noPath: false };
    }

    for (const nb of getNeighbours(grid, r, c)) {
      if (nb.kind === 'wall' || visited.has(`${nb.row},${nb.col}`)) continue;
      nb.heuristic = manhattan(nb.row, nb.col, er, ec);
      if (!nb.previous) nb.previous = [r, c];
      openSet.push(nb);
    }
  }
  return { visitedInOrder, path: [], noPath: true };
}

// ─── Registry ─────────────────────────────────────────────────────────────────
export const PATHFINDING_ALGORITHMS: Record<
  string,
  (grid: Grid, start: [number, number], end: [number, number]) => PathfindingResult
> = {
  bfs,
  dfs,
  dijkstra,
  astar:  aStar,
  greedy: greedyBFS,
};
