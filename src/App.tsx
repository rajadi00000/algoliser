import { useState } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './components/HomePage';
import SortingVisualizer from './components/SortingVisualizer';
import SearchingVisualizer from './components/SearchingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import { ALGORITHM_META } from './data/algorithms';
import type { Page } from './types';
import { BarChart2, Search, Map, Home as HomeIcon, Menu } from 'lucide-react';

const PAGE_ICONS: Record<Page, React.ElementType> = {
  home:        HomeIcon,
  sorting:     BarChart2,
  searching:   Search,
  pathfinding: Map,
};

const PAGE_TITLES: Record<Page, string> = {
  home:        'Home',
  sorting:     'Sorting',
  searching:   'Searching',
  pathfinding: 'Pathfinding',
};

const PAGE_COLORS: Record<Page, string> = {
  home:        'text-violet-400',
  sorting:     'text-blue-400',
  searching:   'text-emerald-400',
  pathfinding: 'text-amber-400',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubble');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = (page: Page, algorithmId?: string) => {
    setCurrentPage(page);
    if (algorithmId) {
      setCurrentAlgorithm(algorithmId);
    } else if (page !== 'home') {
      // Default to first algo of that category
      const first = ALGORITHM_META.find(a => a.category === page);
      if (first) setCurrentAlgorithm(first.id);
    }
  };

  const PageIcon = PAGE_ICONS[currentPage];
  const algMeta = ALGORITHM_META.find(a => a.id === currentAlgorithm);
  const pageTitle = currentPage !== 'home' && algMeta ? algMeta.name : PAGE_TITLES[currentPage];

  return (
    <div className="flex min-h-screen bg-bg-base text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        currentAlgorithm={currentAlgorithm}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-bg-base/90 backdrop-blur border-b border-bg-overlay flex items-center gap-3 px-4 sm:px-6 h-16">
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarCollapsed(v => !v)}
          >
            <Menu size={20} />
          </button>
          <PageIcon size={18} className={PAGE_COLORS[currentPage]} />
          <div>
            <h1 className="font-semibold text-white text-sm sm:text-base leading-tight">{pageTitle}</h1>
            {currentPage !== 'home' && (
              <p className="text-xs text-slate-500 capitalize">{currentPage} algorithms</p>
            )}
          </div>
          {/* Breadcrumb on desktop */}
          <div className="hidden sm:flex items-center gap-2 ml-auto text-xs text-slate-500">
            <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Algoliser</button>
            {currentPage !== 'home' && (
              <>
                <span>/</span>
                <button onClick={() => navigate(currentPage)} className="hover:text-white transition-colors capitalize">{currentPage}</button>
                {algMeta && currentPage !== 'home' && (
                  <>
                    <span>/</span>
                    <span className="text-slate-300">{algMeta.name}</span>
                  </>
                )}
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-auto">
          {currentPage === 'home' && <HomePage onNavigate={navigate} />}
          {currentPage === 'sorting' && (
            <SortingVisualizer key={currentAlgorithm} initialAlgorithm={currentAlgorithm} />
          )}
          {currentPage === 'searching' && (
            <SearchingVisualizer key={currentAlgorithm} initialAlgorithm={currentAlgorithm} />
          )}
          {currentPage === 'pathfinding' && (
            <PathfindingVisualizer key={currentAlgorithm} initialAlgorithm={currentAlgorithm} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav currentPage={currentPage} onNavigate={navigate} />
    </div>
  );
}
