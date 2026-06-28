import { BarChart2, Home as HomeIcon, Map, Search, type LucideIcon } from 'lucide-react';
import { ALGORITHM_META } from './data/algorithms';
import type { Page } from './types';

export const APP_PAGES = ['home', 'sorting', 'searching', 'pathfinding'] as const;
export type AppPage = (typeof APP_PAGES)[number];
export const CONTENT_PAGES = ['sorting', 'searching', 'pathfinding'] as const;
export type ContentPage = (typeof CONTENT_PAGES)[number];

export type NavigationState = {
  page: Page;
  algorithmId?: string;
};

export const HOME_PAGE: Page = 'home';
export const NAV_STATE_KEY = 'algoliser-nav-state';

export type PageUiConfig = {
  title: string;
  sidebarLabel: string;
  bottomLabel: string;
  color: string;
  icon: LucideIcon;
};

export const PAGE_UI: Record<Page, PageUiConfig> = {
  home: {
    title: 'Home',
    sidebarLabel: 'Home',
    bottomLabel: 'Home',
    color: 'text-violet-400',
    icon: HomeIcon,
  },
  sorting: {
    title: 'Sorting',
    sidebarLabel: 'Sorting',
    bottomLabel: 'Sort',
    color: 'text-blue-400',
    icon: BarChart2,
  },
  searching: {
    title: 'Searching',
    sidebarLabel: 'Searching',
    bottomLabel: 'Search',
    color: 'text-emerald-400',
    icon: Search,
  },
  pathfinding: {
    title: 'Pathfinding',
    sidebarLabel: 'Pathfinding',
    bottomLabel: 'Path',
    color: 'text-amber-400',
    icon: Map,
  },
};

export function isHomePage(page: Page) {
  return page === HOME_PAGE;
}

export function isContentPage(page: Page): page is ContentPage {
  return page !== HOME_PAGE;
}

export function isValidPage(page: string): page is Page {
  return (APP_PAGES as readonly string[]).includes(page);
}

export function getPageUi(page: Page) {
  return PAGE_UI[page];
}

export function getAlgorithmsForPage(page: ContentPage) {
  return ALGORITHM_META.filter(algo => algo.category === page);
}

export function getDefaultAlgorithmId(page: ContentPage) {
  return getAlgorithmsForPage(page)[0]?.id ?? '';
}

export function getAlgorithmById(id: string) {
  return ALGORITHM_META.find(algo => algo.id === id);
}

export function buildPath(page: Page, algorithmId?: string) {
  const base = import.meta.env.BASE_URL; // e.g. '/Algoliser/' or '/'
  const prefix = base.replace(/\/$/, ''); // '/Algoliser' or ''
  if (isHomePage(page)) return base;
  return algorithmId ? `${prefix}/${page}/${algorithmId}` : `${prefix}/${page}`;
}

export function parsePathname(pathname: string): NavigationState | null {
  const base = import.meta.env.BASE_URL; // e.g. '/Algoliser/' or '/'
  const prefix = base.replace(/\/$/, ''); // '/Algoliser' or ''
  const relative = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  const [pagePart, algorithmId] = relative.replace(/^\/+|\/+$/g, '').split('/');

  if (pagePart && isValidPage(pagePart)) {
    return isHomePage(pagePart) ? { page: pagePart } : { page: pagePart, algorithmId };
  }

  return null;
}

export function readNavigationState(): NavigationState | null {
  const stored = window.sessionStorage.getItem(NAV_STATE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<NavigationState>;
    if (parsed.page && isValidPage(parsed.page)) {
      return {
        page: parsed.page,
        algorithmId: parsed.algorithmId,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function persistNavigationState(page: Page, algorithmId?: string) {
  window.sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify({ page, algorithmId }));
}
