import { BarChart2, Search, Map, Home } from 'lucide-react';
import type { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV = [
  { page: 'home' as Page,        label: 'Home',    Icon: Home,     activeColor: 'text-violet-400' },
  { page: 'sorting' as Page,     label: 'Sort',    Icon: BarChart2, activeColor: 'text-blue-400' },
  { page: 'searching' as Page,   label: 'Search',  Icon: Search,   activeColor: 'text-emerald-400' },
  { page: 'pathfinding' as Page, label: 'Path',    Icon: Map,      activeColor: 'text-amber-400' },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-bg-overlay flex safe-bottom">
      {NAV.map(({ page, label, Icon, activeColor }) => {
        const isActive = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              isActive ? activeColor : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Icon size={20} />
            <span className={`text-[10px] font-medium ${isActive ? '' : ''}`}>{label}</span>
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t" />}
          </button>
        );
      })}
    </nav>
  );
}
