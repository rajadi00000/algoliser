import type { AlgorithmMeta } from '../types';

export const ALGORITHM_META: AlgorithmMeta[] = [
  // ── Sorting ──────────────────────────────────────────────────────────────
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass is repeated until no swaps are needed.',
    pseudoCode: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-2',
      '    if arr[j] > arr[j+1]',
      '      swap arr[j] and arr[j+1]',
    ],
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Divides the array into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
    pseudoCode: [
      'for i = 0 to n-1',
      '  minIdx = i',
      '  for j = i+1 to n',
      '    if arr[j] < arr[minIdx]: minIdx = j',
      '  swap arr[i] and arr[minIdx]',
    ],
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Builds the sorted array one element at a time by taking each element and inserting it into its correct position among the already-sorted elements.',
    pseudoCode: [
      'for i = 1 to n-1',
      '  key = arr[i]; j = i-1',
      '  while j >= 0 and arr[j] > key',
      '    arr[j+1] = arr[j]; j--',
      '  arr[j+1] = key',
    ],
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description:
      'Divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges the two sorted halves back together.',
    pseudoCode: [
      'mergeSort(arr, l, r)',
      '  if l < r',
      '    mid = (l+r)/2',
      '    mergeSort(arr, l, mid)',
      '    mergeSort(arr, mid+1, r)',
      '    merge(arr, l, mid, r)',
    ],
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description:
      'Picks a pivot element, partitions the array around it so elements less than pivot come before it and greater after, then recursively sorts both partitions.',
    pseudoCode: [
      'quickSort(arr, low, high)',
      '  if low < high',
      '    pivot = partition(arr, low, high)',
      '    quickSort(arr, low, pivot-1)',
      '    quickSort(arr, pivot+1, high)',
    ],
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Builds a max-heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted region.',
    pseudoCode: [
      'buildMaxHeap(arr)',
      'for i = n-1 to 1',
      '  swap arr[0] and arr[i]',
      '  heapify(arr, 0, i)',
    ],
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    category: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description:
      'Generalisation of insertion sort. Compares elements separated by a gap and reduces the gap over time, allowing elements to move faster to their correct positions.',
    pseudoCode: [
      'gap = n/2',
      'while gap > 0',
      '  for i = gap to n-1',
      '    temp = arr[i]; j = i',
      '    while j >= gap and arr[j-gap] > temp',
      '      arr[j] = arr[j-gap]; j -= gap',
      '    arr[j] = temp',
      '  gap = gap/2',
    ],
  },

  // ── Searching ─────────────────────────────────────────────────────────────
  {
    id: 'linear',
    name: 'Linear Search',
    category: 'searching',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Sequentially checks each element in the list until a match is found or the end of the list is reached. Works on unsorted arrays.',
    pseudoCode: [
      'for i = 0 to n-1',
      '  if arr[i] == target',
      '    return i',
      'return -1',
    ],
  },
  {
    id: 'binary',
    name: 'Binary Search',
    category: 'searching',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Works on sorted arrays. Repeatedly divides the search interval in half. If the target is less than the middle element, search left half; otherwise search right half.',
    pseudoCode: [
      'low = 0; high = n-1',
      'while low <= high',
      '  mid = (low+high)/2',
      '  if arr[mid] == target: return mid',
      '  if arr[mid] < target: low = mid+1',
      '  else: high = mid-1',
      'return -1',
    ],
  },
  {
    id: 'jump',
    name: 'Jump Search',
    category: 'searching',
    timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Works on sorted arrays. Jumps ahead by fixed steps (√n) to find the block containing the target, then performs linear search in that block.',
    pseudoCode: [
      'step = √n; prev = 0',
      'while arr[min(step,n)-1] < target',
      '  prev = step; step += √n',
      '  if prev >= n: return -1',
      'while arr[prev] < target',
      '  prev++; if prev == min(step,n): return -1',
      'if arr[prev] == target: return prev',
      'return -1',
    ],
  },
  {
    id: 'exponential',
    name: 'Exponential Search',
    category: 'searching',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description:
      'Finds the range where the element may be present by doubling the index, then applies binary search on that range. Useful for unbounded/infinite arrays.',
    pseudoCode: [
      'if arr[0] == target: return 0',
      'i = 1',
      'while i < n and arr[i] <= target: i *= 2',
      'binary_search(arr, i/2, min(i, n-1), target)',
    ],
  },

  // ── Pathfinding ───────────────────────────────────────────────────────────
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'pathfinding',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description:
      'Explores all neighbour nodes at the present depth before moving to nodes at the next depth level. Guarantees the shortest path in an unweighted graph.',
    pseudoCode: [
      'queue = [start]',
      'while queue not empty',
      '  node = queue.dequeue()',
      '  for each neighbour of node',
      '    if not visited: queue.enqueue(neighbour)',
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'pathfinding',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description:
      'Explores as far as possible along each branch before backtracking. Does not guarantee shortest path but uses less memory than BFS.',
    pseudoCode: [
      'stack = [start]',
      'while stack not empty',
      '  node = stack.pop()',
      '  if node == end: done',
      '  for each neighbour: stack.push(neighbour)',
    ],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'pathfinding',
    timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description:
      'Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative weights. Guarantees the optimal shortest path.',
    pseudoCode: [
      'dist[start] = 0; pq = [(0, start)]',
      'while pq not empty',
      '  (d, u) = pq.pop_min()',
      '  for each (v, w) in adj[u]',
      '    if dist[u]+w < dist[v]',
      '      dist[v] = dist[u]+w',
      '      pq.push((dist[v], v))',
    ],
  },
  {
    id: 'astar',
    name: 'A* Search',
    category: 'pathfinding',
    timeComplexity: { best: 'O(E)', average: 'O(E log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description:
      'Uses a heuristic function (Manhattan distance) to guide the search towards the goal, combining Dijkstra\'s guarantee with efficient directional exploration.',
    pseudoCode: [
      'open = [(f(start), start)]',
      'while open not empty',
      '  node = open.pop_min()',
      '  if node == end: reconstruct path',
      '  for each neighbour',
      '    g = g[node]+1',
      '    f = g + heuristic(neighbour, end)',
      '    open.push((f, neighbour))',
    ],
  },
  {
    id: 'greedy',
    name: 'Greedy Best-First',
    category: 'pathfinding',
    timeComplexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    stable: false,
    description:
      'Always expands the node closest to the goal (by heuristic only). Faster than A* in practice but does not guarantee the shortest path.',
    pseudoCode: [
      'open = [(h(start), start)]',
      'while open not empty',
      '  node = open.pop_min_h()',
      '  if node == end: done',
      '  for each neighbour',
      '    h = heuristic(neighbour, end)',
      '    open.push((h, neighbour))',
    ],
  },
];

export function getAlgorithmById(id: string): AlgorithmMeta | undefined {
  return ALGORITHM_META.find(a => a.id === id);
}

export function getAlgorithmsByCategory(category: string): AlgorithmMeta[] {
  return ALGORITHM_META.filter(a => a.category === category);
}
