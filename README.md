# Algoliser — Algorithm Visualizer

An interactive, animated algorithm visualizer built with React, TypeScript, and Tailwind CSS. Step through 16 algorithms across sorting, searching, and pathfinding — control playback speed, edit inputs, and explore complexity analysis all in one place.

**Live demo:** https://rajadi00000.github.io/algoliser/

---

## Features

- **16 algorithms** across 3 categories with real-time animation
- **Step controls** — play, pause, step forward/back, scrub to any frame
- **Speed selector** — 0.25×, 1×, 4×, or turbo (max speed)
- **Algorithm info panel** — time/space complexity, stable/unstable badge, pseudocode
- **Responsive** — collapsible sidebar on desktop, bottom navigation on mobile

---

## Algorithms

### Sorting
| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✓ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ✗ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✓ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✓ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ✗ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ✗ |
| Shell Sort | O(n log n) | O(n log² n) | O(n²) | O(1) | ✗ |

### Searching
| Algorithm | Best | Average | Worst | Notes |
|---|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) | Unsorted arrays |
| Binary Search | O(1) | O(log n) | O(log n) | Sorted arrays |
| Jump Search | O(1) | O(√n) | O(√n) | Sorted arrays |
| Exponential Search | O(1) | O(log n) | O(log n) | Sorted / unbounded |

### Pathfinding
| Algorithm | Complexity | Shortest Path |
|---|---|---|
| BFS | O(V+E) | ✓ (unweighted) |
| DFS | O(V+E) | ✗ |
| Dijkstra | O((V+E) log V) | ✓ |
| A* | O(E log V) | ✓ |
| Greedy Best-First | O(E log V) | ✗ |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — lightning-fast dev server and build tool
- **Tailwind CSS v3** — utility-first styling
- **Lucide React** — icon library

---

## Getting Started

```bash
# Clone
git clone https://github.com/rajadi00000/algoliser.git
cd algoliser

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

---

## Deployment

The project deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

To enable it on your own fork:
1. Go to **Settings → Pages**
2. Set Source to **"GitHub Actions"**

Push to `main` — the workflow handles the rest.
