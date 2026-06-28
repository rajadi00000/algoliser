import type { Page } from '../types';
import { APP_PAGES, getPageUi } from '../navigation';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV = APP_PAGES;

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-bg-overlay flex safe-bottom">
      {NAV.map(page => {
        const pageUi = getPageUi(page);
        const isActive = currentPage === page;
        const PageIcon = pageUi.icon;
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              isActive ? pageUi.color : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <PageIcon size={20} />
            <span className="text-[10px] font-medium">{pageUi.bottomLabel}</span>
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t" />}
          </button>
        );
      })}
    </nav>
  );
}
