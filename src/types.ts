export interface ComicManifest {
  title: string;
  author?: string;
  description?: string;
  cover?: string;
  pages: string[];
  direction?: 'rtl' | 'ltr'; // reading direction
}

export interface ComicConfig {
  baseUrl: string;       // Base URL where comic files are hosted
  manifestUrl?: string;  // Direct manifest URL (overrides baseUrl)
  startPage?: number;    // Page to start on (0-indexed)
  theme?: 'dark' | 'light';
}

export type ViewMode = 'single' | 'double' | 'scroll';

export interface ViewerState {
  currentPage: number;
  viewMode: ViewMode;
  zoom: number;
  showThumbnails: boolean;
  showControls: boolean;
  isFullscreen: boolean;
  direction: 'ltr' | 'rtl';
}
