import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import SortingVisualizer from './components/SortingVisualizer';
import SearchingVisualizer from './components/SearchingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import { Menu } from 'lucide-react';
import type { Page } from './types';
import {
  buildPath,
  getAlgorithmById,
  getDefaultAlgorithmId,
  HOME_PAGE,
  isContentPage,
  isHomePage,
  parsePathname,
  persistNavigationState,
  readNavigationState,
  CONTENT_PAGES,
  getPageUi,
} from './navigation';
import type { ComponentType } from 'react';

const PAGE_COMPONENTS: Record<Exclude<Page, 'home'>, ComponentType<{ initialAlgorithm: string }>> = {
  sorting: SortingVisualizer,
  searching: SearchingVisualizer,
  pathfinding: PathfindingVisualizer,
};

const DEFAULT_ALGORITHM_PAGE = CONTENT_PAGES[0];

function getDefaultAlgorithm(page: Exclude<Page, 'home'>) {
  return getDefaultAlgorithmId(page);
}

export default function App() {
  const initialLocation = parsePathname(window.location.pathname) ?? readNavigationState() ?? { page: HOME_PAGE };
  const [currentPage, setCurrentPage] = useState<Page>(initialLocation.page);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(
    initialLocation.algorithmId ?? (isHomePage(initialLocation.page) ? getDefaultAlgorithm(DEFAULT_ALGORITHM_PAGE) : getDefaultAlgorithm(initialLocation.page)),
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      const nextLocation = parsePathname(window.location.pathname) ?? readNavigationState() ?? { page: HOME_PAGE };
      setCurrentPage(nextLocation.page);

      if (isHomePage(nextLocation.page)) {
        persistNavigationState(HOME_PAGE);
        return;
      }

      const nextAlgorithm = nextLocation.algorithmId ?? getDefaultAlgorithm(nextLocation.page);
      setCurrentAlgorithm(nextAlgorithm);
      persistNavigationState(nextLocation.page, nextAlgorithm);
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (page: Page, algorithmId?: string) => {
    setCurrentPage(page);
    if (algorithmId) {
      setCurrentAlgorithm(algorithmId);
    } else if (!isHomePage(page)) {
      setCurrentAlgorithm(getDefaultAlgorithm(page));
    }
    const nextAlgorithmId = algorithmId ?? (isHomePage(page) ? undefined : getDefaultAlgorithm(page));
    const nextPath = buildPath(page, nextAlgorithmId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    persistNavigationState(page, nextAlgorithmId);
    setMobileSidebarOpen(false);
  };

  const pageUi = getPageUi(currentPage);
  const PageIcon = pageUi.icon;
  const algMeta = getAlgorithmById(currentAlgorithm);
  const pageTitle = isHomePage(currentPage) || !algMeta ? pageUi.title : algMeta.name;
  const ActivePageComponent = isContentPage(currentPage) ? PAGE_COMPONENTS[currentPage] : null;

  return (
    <div className="flex min-h-screen bg-bg-base text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        currentAlgorithm={currentAlgorithm}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-bg-base/90 backdrop-blur border-b border-bg-overlay flex items-center gap-3 px-4 sm:px-6 h-16">
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileSidebarOpen(v => !v)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <PageIcon size={18} className={pageUi.color} />
          <div>
            <h1 className="font-semibold text-white text-sm sm:text-base leading-tight">{pageTitle}</h1>
            {!isHomePage(currentPage) && (
              <p className="text-xs text-slate-500 capitalize">{currentPage} algorithms</p>
            )}
          </div>
          {/* Breadcrumb on desktop */}
          <div className="hidden sm:flex items-center gap-2 ml-auto text-xs text-slate-500">
            <button onClick={() => navigate(HOME_PAGE)} className="hover:text-white transition-colors">Algoliser</button>
            {!isHomePage(currentPage) && (
              <>
                <span>/</span>
                <button onClick={() => navigate(currentPage)} className="hover:text-white transition-colors capitalize">{currentPage}</button>
                {algMeta && !isHomePage(currentPage) && (
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
        <main className="flex-1 p-4 sm:p-6 md:pb-6 overflow-auto">
          {isHomePage(currentPage) && <HomePage onNavigate={navigate} />}
          {ActivePageComponent && (
            <ActivePageComponent key={currentAlgorithm} initialAlgorithm={currentAlgorithm} />
          )}
        </main>
      </div>
    </div>
  );
}
