import {
  BarChart2, Search, Map, Home,
  ChevronRight, Zap, GitBranch,
} from 'lucide-react';
import type { Page } from '../types';
import { ALGORITHM_META } from '../data/algorithms';

interface SidebarProps {
  currentPage: Page;
  currentAlgorithm: string;
  onNavigate: (page: Page, algorithmId?: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { page: 'home' as Page,        label: 'Home',        Icon: Home,     color: 'text-violet-400' },
  { page: 'sorting' as Page,     label: 'Sorting',     Icon: BarChart2, color: 'text-blue-400' },
  { page: 'searching' as Page,   label: 'Searching',   Icon: Search,   color: 'text-emerald-400' },
  { page: 'pathfinding' as Page, label: 'Pathfinding', Icon: Map,      color: 'text-amber-400' },
];

export default function Sidebar({ currentPage, currentAlgorithm, onNavigate, collapsed, onToggle }: SidebarProps) {
  const algorithmsForPage = (page: Page) =>
    ALGORITHM_META.filter(a => a.category === page || (page === 'pathfinding' && a.category === 'pathfinding'));

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-bg-surface border-r border-bg-overlay transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo / toggle */}
      {collapsed ? (
        <div className="flex items-center justify-center border-b border-bg-overlay min-h-[64px]">
          <button
            onClick={onToggle}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-5 border-b border-bg-overlay min-h-[64px]">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-white tracking-tight text-lg">Algoliser</span>
            <p className="text-[10px] text-slate-500 -mt-0.5">Algorithm Visualizer</p>
          </div>
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="flex-shrink-0 p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-bg-elevated transition-colors"
          >
            <ChevronRight size={16} className="rotate-180 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ page, label, Icon, color }) => {
          const isActive = currentPage === page;
          const algos = ALGORITHM_META.filter(a => {
            if (page === 'sorting') return a.category === 'sorting';
            if (page === 'searching') return a.category === 'searching';
            if (page === 'pathfinding') return a.category === 'pathfinding';
            return false;
          });

          return (
            <div key={page}>
              <button
                onClick={() => onNavigate(page)}
                title={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? 'bg-brand/20 text-white'
                    : 'text-slate-400 hover:bg-bg-elevated hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={18} className={`flex-shrink-0 ${isActive ? color : 'group-hover:' + color}`} />
                {!collapsed && (
                  <span className="font-medium text-sm flex-1 text-left">{label}</span>
                )}
                {!collapsed && isActive && (
                  <span className="text-xs bg-brand/30 text-brand-lighter px-1.5 py-0.5 rounded-full">
                    {algos.length}
                  </span>
                )}
              </button>

              {/* Sub-items */}
              {!collapsed && isActive && page !== 'home' && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-bg-overlay pl-3">
                  {algos.map(algo => (
                    <button
                      key={algo.id}
                      onClick={() => onNavigate(page, algo.id)}
                      title={algo.name}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                        currentAlgorithm === algo.id
                          ? 'text-white bg-bg-elevated'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {algo.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-bg-overlay">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <GitBranch size={12} />
            <span>16 algorithms</span>
          </div>
        </div>
      )}
    </aside>
  );
}
