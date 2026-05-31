import { BarChart2, Search, Map, ArrowRight, Zap, GitBranch, Clock } from 'lucide-react';
import type { Page } from '../types';
import { ALGORITHM_META } from '../data/algorithms';

interface HomePageProps {
  onNavigate: (page: Page, algorithmId?: string) => void;
}

const CATEGORY_CARDS = [
  {
    page: 'sorting' as Page,
    title: 'Sorting Algorithms',
    description: 'Watch elements rearrange themselves with bubble, merge, quick, heap, and more.',
    Icon: BarChart2,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/20 hover:border-blue-400/40',
    badge: 'bg-blue-500/20 text-blue-300',
    iconColor: 'text-blue-400',
  },
  {
    page: 'searching' as Page,
    title: 'Searching Algorithms',
    description: 'Observe how linear, binary, jump, and exponential search locate target values.',
    Icon: Search,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20 hover:border-emerald-400/40',
    badge: 'bg-emerald-500/20 text-emerald-300',
    iconColor: 'text-emerald-400',
  },
  {
    page: 'pathfinding' as Page,
    title: 'Pathfinding Algorithms',
    description: 'Draw mazes and watch BFS, DFS, Dijkstra, A* and Greedy find the shortest path.',
    Icon: Map,
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/20 hover:border-amber-400/40',
    badge: 'bg-amber-500/20 text-amber-300',
    iconColor: 'text-amber-400',
  },
];

const STATS = [
  { label: 'Algorithms', value: ALGORITHM_META.length, Icon: GitBranch },
  { label: 'Categories', value: 3, Icon: BarChart2 },
  { label: 'Interactive', value: '100%', Icon: Zap },
  { label: 'Avg Steps', value: '< 1ms', Icon: Clock },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand-lighter text-xs px-3 py-1.5 rounded-full">
          <Zap size={12} />
          Interactive Algorithm Visualizer
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Understand Algorithms{' '}
          <span className="bg-gradient-to-r from-brand-lighter to-blue-400 bg-clip-text text-transparent">
            Visually
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
          Step through sorting, searching, and pathfinding algorithms with real-time animations.
          Control speed, edit inputs, and view complexity analysis.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('sorting')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-brand/25"
          >
            Start Exploring <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('pathfinding')}
            className="flex items-center gap-2 px-5 py-2.5 bg-bg-surface hover:bg-bg-elevated text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors border border-bg-overlay"
          >
            <Map size={16} />
            Draw a Maze
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, Icon }) => (
          <div key={label} className="bg-bg-surface border border-bg-overlay rounded-xl p-4 text-center space-y-1">
            <Icon size={18} className="mx-auto text-brand-lighter" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Category cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {CATEGORY_CARDS.map(({ page, title, description, Icon, gradient, border, badge, iconColor }) => {
          const algos = ALGORITHM_META.filter(a => a.category === page);
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`text-left bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] group`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`p-2.5 rounded-xl bg-bg-surface/80 ${iconColor}`}>
                  <Icon size={22} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                  {algos.length} algorithms
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {algos.slice(0, 4).map(a => (
                  <span
                    key={a.id}
                    onClick={(e) => { e.stopPropagation(); onNavigate(page, a.id); }}
                    className="text-[11px] px-2 py-0.5 bg-bg-base/60 text-slate-400 hover:text-white rounded-md border border-bg-overlay/50 cursor-pointer transition-colors"
                  >
                    {a.name}
                  </span>
                ))}
                {algos.length > 4 && (
                  <span className="text-[11px] px-2 py-0.5 text-slate-600">+{algos.length - 4} more</span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* All algorithms quick grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest">All Algorithms</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ALGORITHM_META.map(algo => {
            const categoryColor = {
              sorting: 'border-blue-500/20 hover:border-blue-400/40',
              searching: 'border-emerald-500/20 hover:border-emerald-400/40',
              pathfinding: 'border-amber-500/20 hover:border-amber-400/40',
            }[algo.category];
            const categoryText = {
              sorting: 'text-blue-400',
              searching: 'text-emerald-400',
              pathfinding: 'text-amber-400',
            }[algo.category];
            return (
              <button
                key={algo.id}
                onClick={() => onNavigate(algo.category as Page, algo.id)}
                className={`text-left bg-bg-surface border ${categoryColor} rounded-xl p-3 transition-all hover:bg-bg-elevated group`}
              >
                <div className={`text-xs font-medium ${categoryText} capitalize mb-0.5`}>{algo.category}</div>
                <div className="text-sm text-white font-medium leading-snug">{algo.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{algo.timeComplexity.average}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
