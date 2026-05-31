import type { SearchFrame } from '../types';

type Frames = SearchFrame[];

function blankFrame(
  array: number[],
  target: number,
  low: number,
  high: number,
  mid: number,
  current: number[],
  eliminated: boolean[],
  found: number,
  description: string,
): SearchFrame {
  return { array: [...array], target, current, eliminated: [...eliminated], low, high, mid, found, description };
}

// ─── Linear Search ────────────────────────────────────────────────────────────
export function linearSearch(array: number[], target: number): Frames {
  const frames: Frames = [];
  const n = array.length;
  const eliminated = Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    frames.push(blankFrame(array, target, 0, n - 1, i, [i], eliminated, -1, `Checking index ${i}: value = ${array[i]}`));
    if (array[i] === target) {
      frames.push(blankFrame(array, target, 0, n - 1, i, [i], eliminated, i, `Found ${target} at index ${i}! ✓`));
      return frames;
    }
    eliminated[i] = true;
  }
  frames.push(blankFrame(array, target, 0, n - 1, -1, [], eliminated, -2, `${target} not found in array`));
  return frames;
}

// ─── Binary Search ────────────────────────────────────────────────────────────
export function binarySearch(array: number[], target: number): Frames {
  const frames: Frames = [];
  const sorted = [...array].sort((a, b) => a - b);
  const n = sorted.length;
  const eliminated = Array(n).fill(false);
  let low = 0;
  let high = n - 1;

  frames.push(blankFrame(sorted, target, low, high, -1, [], eliminated, -1, `Array sorted. Searching for ${target}. low=${low}, high=${high}`));

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    // Mark eliminated zones
    for (let i = 0; i < low; i++) eliminated[i] = true;
    for (let i = high + 1; i < n; i++) eliminated[i] = true;

    frames.push(blankFrame(sorted, target, low, high, mid, [mid], eliminated, -1, `mid=${mid}, value=${sorted[mid]}. Comparing with target ${target}`));

    if (sorted[mid] === target) {
      frames.push(blankFrame(sorted, target, low, high, mid, [mid], eliminated, mid, `Found ${target} at index ${mid}! ✓`));
      return frames;
    }
    if (sorted[mid] < target) {
      frames.push(blankFrame(sorted, target, mid + 1, high, mid, [], eliminated, -1, `${sorted[mid]} < ${target} → search right half`));
      low = mid + 1;
    } else {
      frames.push(blankFrame(sorted, target, low, mid - 1, mid, [], eliminated, -1, `${sorted[mid]} > ${target} → search left half`));
      high = mid - 1;
    }
  }
  frames.push(blankFrame(sorted, target, low, high, -1, [], Array(n).fill(true), -2, `${target} not found in array`));
  return frames;
}

// ─── Jump Search ──────────────────────────────────────────────────────────────
export function jumpSearch(array: number[], target: number): Frames {
  const frames: Frames = [];
  const sorted = [...array].sort((a, b) => a - b);
  const n = sorted.length;
  const eliminated = Array(n).fill(false);
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;

  frames.push(blankFrame(sorted, target, 0, n - 1, -1, [], eliminated, -1, `Jump step = √${n} ≈ ${step}. Array sorted.`));

  // Jump phase
  let curr = Math.min(step, n) - 1;
  while (curr < n && sorted[curr] < target) {
    frames.push(blankFrame(sorted, target, prev, curr, curr, [curr], eliminated, -1, `Jump: arr[${curr}]=${sorted[curr]} < ${target}, jump forward`));
    for (let i = prev; i < curr; i++) eliminated[i] = true;
    prev = curr + 1;
    curr = Math.min(curr + step, n - 1);
    if (prev >= n) {
      frames.push(blankFrame(sorted, target, 0, n - 1, -1, [], Array(n).fill(true), -2, `${target} not found`));
      return frames;
    }
  }

  // Linear search within block
  frames.push(blankFrame(sorted, target, prev, curr, -1, [], eliminated, -1, `Linear search in block [${prev}..${curr}]`));
  for (let i = prev; i <= Math.min(curr, n - 1); i++) {
    frames.push(blankFrame(sorted, target, prev, curr, i, [i], eliminated, -1, `Checking index ${i}: value=${sorted[i]}`));
    if (sorted[i] === target) {
      frames.push(blankFrame(sorted, target, prev, curr, i, [i], eliminated, i, `Found ${target} at index ${i}! ✓`));
      return frames;
    }
    eliminated[i] = true;
  }
  frames.push(blankFrame(sorted, target, 0, n - 1, -1, [], Array(n).fill(true), -2, `${target} not found`));
  return frames;
}

// ─── Exponential Search ───────────────────────────────────────────────────────
export function exponentialSearch(array: number[], target: number): Frames {
  const frames: Frames = [];
  const sorted = [...array].sort((a, b) => a - b);
  const n = sorted.length;
  const eliminated = Array(n).fill(false);

  frames.push(blankFrame(sorted, target, 0, n - 1, -1, [], eliminated, -1, `Array sorted. Starting exponential search for ${target}`));

  if (sorted[0] === target) {
    frames.push(blankFrame(sorted, target, 0, 0, 0, [0], eliminated, 0, `Found ${target} at index 0! ✓`));
    return frames;
  }

  let i = 1;
  while (i < n && sorted[i] <= target) {
    frames.push(blankFrame(sorted, target, 0, i, i, [i], eliminated, -1, `Exponential probe at index ${i}: value=${sorted[i]}`));
    if (sorted[i] === target) {
      frames.push(blankFrame(sorted, target, 0, i, i, [i], eliminated, i, `Found ${target} at index ${i}! ✓`));
      return frames;
    }
    i *= 2;
  }

  // Binary search in range [i/2, min(i, n-1)]
  let low = Math.floor(i / 2);
  let high = Math.min(i, n - 1);
  for (let k = 0; k < low; k++) eliminated[k] = true;
  for (let k = high + 1; k < n; k++) eliminated[k] = true;

  frames.push(blankFrame(sorted, target, low, high, -1, [], eliminated, -1, `Binary search in range [${low}, ${high}]`));

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    frames.push(blankFrame(sorted, target, low, high, mid, [mid], eliminated, -1, `mid=${mid}, value=${sorted[mid]}`));
    if (sorted[mid] === target) {
      frames.push(blankFrame(sorted, target, low, high, mid, [mid], eliminated, mid, `Found ${target} at index ${mid}! ✓`));
      return frames;
    }
    if (sorted[mid] < target) {
      for (let k = low; k <= mid; k++) eliminated[k] = true;
      low = mid + 1;
    } else {
      for (let k = mid; k <= high; k++) eliminated[k] = true;
      high = mid - 1;
    }
  }
  frames.push(blankFrame(sorted, target, 0, n - 1, -1, [], Array(n).fill(true), -2, `${target} not found`));
  return frames;
}

// ─── registry ─────────────────────────────────────────────────────────────────
export const SEARCH_ALGORITHMS: Record<string, (array: number[], target: number) => Frames> = {
  linear:      linearSearch,
  binary:      binarySearch,
  jump:        jumpSearch,
  exponential: exponentialSearch,
};
