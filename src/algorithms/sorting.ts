import type { SortFrame } from '../types';

type Frames = SortFrame[];

// ─── helpers ──────────────────────────────────────────────────────────────────
function frame(
  array: number[],
  comparing: number[],
  swapping: number[],
  sorted: number[],
  description: string,
  pivot?: number,
): SortFrame {
  return { array: [...array], comparing, swapping, sorted: [...sorted], description, pivot };
}

// ─── Bubble Sort ──────────────────────────────────────────────────────────────
export function bubbleSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];
  const sortedSet: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      frames.push(frame(arr, [j, j + 1], [], sortedSet, `Comparing ${arr[j]} and ${arr[j + 1]}`));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        frames.push(frame(arr, [], [j, j + 1], sortedSet, `Swap → ${arr[j]} ↔ ${arr[j + 1]}`));
      }
    }
    sortedSet.push(n - 1 - i);
    if (!swapped) break;
  }
  sortedSet.push(...Array.from({ length: n }, (_, i) => i).filter(i => !sortedSet.includes(i)));
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Selection Sort ───────────────────────────────────────────────────────────
export function selectionSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];
  const sortedSet: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    frames.push(frame(arr, [i], [], sortedSet, `Pass ${i + 1}: find minimum starting at index ${i}`));
    for (let j = i + 1; j < n; j++) {
      frames.push(frame(arr, [j, minIdx], [], sortedSet, `Comparing ${arr[j]} with current min ${arr[minIdx]}`));
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      frames.push(frame(arr, [], [i, minIdx], sortedSet, `Swap minimum ${arr[i]} to position ${i}`));
    }
    sortedSet.push(i);
  }
  sortedSet.push(n - 1);
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Insertion Sort ───────────────────────────────────────────────────────────
export function insertionSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    frames.push(frame(arr, [i], [], Array.from({ length: i }, (_, k) => k), `Insert ${key} into sorted section`));
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      frames.push(frame(arr, [j, j + 1], [], Array.from({ length: i }, (_, k) => k), `Shift ${arr[j]} right`));
      j--;
    }
    arr[j + 1] = key;
    frames.push(frame(arr, [], [j + 1], Array.from({ length: i + 1 }, (_, k) => k), `Placed ${key} at index ${j + 1}`));
  }
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Merge Sort ───────────────────────────────────────────────────────────────
export function mergeSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      frames.push(frame(arr, [left + i, mid + 1 + j], [], [], `Compare ${leftArr[i]} and ${rightArr[j]}`));
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
      frames.push(frame(arr, [], [k - 1], [], `Place ${arr[k - 1]} at index ${k - 1}`));
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; frames.push(frame(arr, [], [k - 1], [], `Copy ${arr[k - 1]}`)); }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; frames.push(frame(arr, [], [k - 1], [], `Copy ${arr[k - 1]}`)); }
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Quick Sort ───────────────────────────────────────────────────────────────
export function quickSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];
  const sortedSet = new Set<number>();

  function partition(low: number, high: number): number {
    const pivotVal = arr[high];
    let i = low - 1;
    frames.push(frame(arr, [], [], [...sortedSet], `Pivot = ${pivotVal} at index ${high}`, high));
    for (let j = low; j < high; j++) {
      frames.push(frame(arr, [j, high], [], [...sortedSet], `Compare ${arr[j]} with pivot ${pivotVal}`, high));
      if (arr[j] <= pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) frames.push(frame(arr, [], [i, j], [...sortedSet], `Swap ${arr[j]} and ${arr[i]}`, high));
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    frames.push(frame(arr, [], [i + 1, high], [...sortedSet], `Pivot ${pivotVal} placed at ${i + 1}`, i + 1));
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sortedSet.add(pi);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
    }
  }

  sort(0, n - 1);
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Heap Sort ────────────────────────────────────────────────────────────────
export function heapSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];
  const sortedSet: number[] = [];

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < size) {
      frames.push(frame(arr, [largest, left], [], sortedSet, `Compare parent ${arr[largest]} with left child ${arr[left]}`));
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      frames.push(frame(arr, [largest, right], [], sortedSet, `Compare ${arr[largest]} with right child ${arr[right]}`));
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      frames.push(frame(arr, [], [root, largest], sortedSet, `Swap ${arr[root]} and ${arr[largest]}`));
      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  frames.push(frame(arr, [], [], [], 'Max-heap built, now extracting elements'));

  // Extract
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedSet.push(i);
    frames.push(frame(arr, [], [0, i], sortedSet, `Extracted max ${arr[i]}, placed at position ${i}`));
    heapify(i, 0);
  }
  sortedSet.push(0);
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── Shell Sort ───────────────────────────────────────────────────────────────
export function shellSort(input: number[]): Frames {
  const arr = [...input];
  const n = arr.length;
  const frames: Frames = [];

  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      frames.push(frame(arr, [i, i - gap], [], [], `Gap=${gap}: Compare ${arr[i]} with ${arr[i - gap]}`));
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        frames.push(frame(arr, [], [j, j - gap], [], `Shift ${arr[j - gap]} to index ${j}`));
        j -= gap;
      }
      arr[j] = temp;
      if (j !== i) frames.push(frame(arr, [], [j], [], `Placed ${temp} at index ${j}`));
    }
    gap = Math.floor(gap / 2);
  }
  frames.push(frame(arr, [], [], Array.from({ length: n }, (_, i) => i), 'Array sorted! ✓'));
  return frames;
}

// ─── registry ─────────────────────────────────────────────────────────────────
export const SORT_ALGORITHMS: Record<string, (input: number[]) => Frames> = {
  bubble:    bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge:     mergeSort,
  quick:     quickSort,
  heap:      heapSort,
  shell:     shellSort,
};
