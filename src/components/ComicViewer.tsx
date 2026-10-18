import { useState, useEffect, useCallback, useRef } from 'react';
import { ViewerState, ViewMode } from '../types';
import { ComicManifest } from '../types';

interface Props {
  manifest: ComicManifest;
  getPageUrl: (page: string) => string;
  startPage: number;
}

export default function ComicViewer({ manifest, getPageUrl, startPage }: Props) {
  const [state, setState] = useState<ViewerState>({
    currentPage: startPage,
    viewMode: 'single',
    zoom: 100,
    showThumbnails: false,
    showControls: true,
    isFullscreen: false,
    direction: manifest.direction || 'ltr',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const totalPages = manifest.pages.length;

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, page));
    setState(prev => ({ ...prev, currentPage: clamped }));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (state.direction === 'rtl') {
      goToPage(state.currentPage - 1);
    } else {
      goToPage(state.currentPage + 1);
    }
  }, [state.currentPage, state.direction, goToPage]);

  const prevPage = useCallback(() => {
    if (state.direction === 'rtl') {
      goToPage(state.currentPage + 1);
    } else {
      goToPage(state.currentPage - 1);
    }
  }, [state.currentPage, state.direction, goToPage]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleThumbnails = useCallback(() => {
    setState(prev => ({ ...prev, showThumbnails: !prev.showThumbnails }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(25, Math.min(300, zoom)) }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setState(prev => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          prevPage();
          break;
        case 'Home':
          e.preventDefault();
          goToPage(0);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages - 1);
          break;
        case 't':
          e.preventDefault();
          toggleThumbnails();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(state.zoom + 25);
          break;
        case '-':
          e.preventDefault();
          setZoom(state.zoom - 25);
          break;
        case '0':
          e.preventDefault();
          setZoom(100);
          break;
        case '1':
          e.preventDefault();
          setViewMode('single');
          break;
        case '2':
          e.preventDefault();
          setViewMode('double');
          break;
        case '3':
          e.preventDefault();
          setViewMode('scroll');
          break;
        case 'Escape':
          if (state.showThumbnails) {
            toggleThumbnails();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, goToPage, totalPages, toggleThumbnails, toggleFullscreen, setZoom, state.zoom, state.showThumbnails, setViewMode]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setState(prev => ({ ...prev, showControls: true }));
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (state.viewMode !== 'scroll') {
        setState(prev => ({ ...prev, showControls: false }));
      }
    }, 3000);
  }, [state.viewMode]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({ ...prev, isFullscreen: !!document.fullscreenElement }));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderPage = (pageIndex: number, key?: string) => {
    const page = manifest.pages[pageIndex];
    if (!page) return null;

    const isDemo = page.startsWith('demo-');
    const url = isDemo ? null : getPageUrl(page);

    return (
      <div
        key={key || `page-${pageIndex}`}
        className="flex items-center justify-center"
        style={{ minHeight: state.viewMode === 'scroll' ? 'auto' : '100%' }}
      >
        {isDemo ? (
          <DemoPage pageNumber={pageIndex + 1} totalPages={totalPages} />
        ) : (
          <img
            src={url!}
            alt={`Page ${pageIndex + 1}`}
            className="max-w-full object-contain select-none"
            style={{
              width: state.zoom !== 100 ? `${state.zoom}%` : 'auto',
              maxHeight: state.viewMode === 'scroll' ? 'none' : '90vh',
            }}
            draggable={false}
            loading={state.viewMode === 'scroll' ? 'lazy' : 'eager'}
          />
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-950 overflow-hidden flex flex-col"
      onMouseMove={resetControlsTimeout}
      onClick={(e) => {
        // Click left/right side to navigate in single mode
        if (state.viewMode === 'single' && !(e.target as HTMLElement).closest('button, .controls-area')) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const width = rect.width;
          if (x < width * 0.3) {
            prevPage();
          } else if (x > width * 0.7) {
            nextPage();
          }
        }
        resetControlsTimeout();
      }}
    >
      {/* Top bar */}
      <div
        className={`controls-area absolute top-0 left-0 right-0 z-30 transition-transform duration-300 ${
          state.showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-b from-black/90 to-transparent px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-white font-semibold text-sm md:text-base truncate max-w-[200px] md:max-w-none">
                {manifest.title}
              </h1>
              {manifest.author && (
                <span className="text-gray-400 text-xs hidden sm:inline">by {manifest.author}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('single')}
                className={`p-2 rounded ${state.viewMode === 'single' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Single page (1)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="6" y="4" width="12" height="16" rx="1" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('double')}
                className={`p-2 rounded ${state.viewMode === 'double' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Double page (2)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="8" height="16" rx="1" strokeWidth="2"/>
                  <rect x="13" y="4" width="8" height="16" rx="1" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('scroll')}
                className={`p-2 rounded ${state.viewMode === 'scroll' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Scroll mode (3)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" d="M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z"/>
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-700 mx-1" />
              <button
                onClick={() => setZoom(state.zoom - 25)}
                className="p-2 text-gray-400 hover:text-white rounded"
                title="Zoom out (-)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2"/>
                  <path strokeWidth="2" d="M8 11h6M16 16l4 4"/>
                </svg>
              </button>
              <span className="text-gray-400 text-xs min-w-[3rem] text-center">{state.zoom}%</span>
              <button
                onClick={() => setZoom(state.zoom + 25)}
                className="p-2 text-gray-400 hover:text-white rounded"
                title="Zoom in (+)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2"/>
                  <path strokeWidth="2" d="M8 11h6M11 8v6M16 16l4 4"/>
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-700 mx-1" />
              <button
                onClick={toggleThumbnails}
                className={`p-2 rounded ${state.showThumbnails ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Thumbnails (T)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-white rounded"
                title="Fullscreen (F)"
              >
                {state.isFullscreen ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" d="M8 3v4a1 1 0 01-1 1H3M16 3v4a1 1 0 001 1h4M8 21v-4a1 1 0 00-1-1H3M16 21v-4a1 1 0 011-1h4"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" d="M3 8V5a2 2 0 012-2h3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails sidebar */}
        {state.showThumbnails && (
          <div className="w-48 md:w-56 bg-gray-900 border-r border-gray-800 overflow-y-auto flex-shrink-0 z-20">
            <div className="p-2 space-y-2">
              {manifest.pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { goToPage(idx); if (state.viewMode !== 'scroll') toggleThumbnails(); }}
                  className={`w-full rounded overflow-hidden transition-all ${
                    idx === state.currentPage
                      ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[3/4] bg-gray-800 flex items-center justify-center">
                    {manifest.pages[idx].startsWith('demo-') ? (
                      <span className="text-gray-500 text-xs">Page {idx + 1}</span>
                    ) : (
                      <img
                        src={getPageUrl(manifest.pages[idx])}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="text-center text-xs text-gray-400 py-1">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comic display area */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-auto flex items-center justify-center ${
            state.viewMode === 'scroll' ? 'flex-col' : ''
          }`}
        >
          {state.viewMode === 'single' && renderPage(state.currentPage)}
          {state.viewMode === 'double' && (
            <div className="flex items-center justify-center gap-1 h-full w-full">
              {state.currentPage % 2 === 0 && state.currentPage > 0
                ? renderPage(state.currentPage - 1, 'left')
                : null}
              {renderPage(state.currentPage, 'right')}
              {state.currentPage % 2 === 0 && state.currentPage < totalPages - 1
                ? null
                : state.currentPage < totalPages - 1
                ? renderPage(state.currentPage + 1, 'right2')
                : null}
            </div>
          )}
          {state.viewMode === 'scroll' && (
            <div className="w-full py-4 space-y-2">
              {manifest.pages.map((_, idx) => renderPage(idx, `scroll-${idx}`))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className={`controls-area absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
          state.showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={prevPage}
              disabled={state.currentPage === 0}
              className="p-2 text-white disabled:text-gray-600 hover:text-blue-400 transition-colors"
              title="Previous page (←)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            {/* Progress bar */}
            <div className="flex-1 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                value={state.currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value, 10))}
                className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0"
              />
              <span className="text-gray-400 text-xs whitespace-nowrap min-w-[4rem] text-right">
                {state.currentPage + 1} / {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={state.currentPage === totalPages - 1}
              className="p-2 text-white disabled:text-gray-600 hover:text-blue-400 transition-colors"
              title="Next page (→)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows (visible on hover in single mode) */}
      {state.viewMode === 'single' && state.showControls && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevPage(); }}
            disabled={state.currentPage === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextPage(); }}
            disabled={state.currentPage === totalPages - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

function DemoPage({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const colors = [
    'from-purple-600 to-blue-600',
    'from-emerald-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-pink-600 to-rose-600',
    'from-cyan-600 to-blue-600',
    'from-violet-600 to-indigo-600',
  ];
  const color = colors[(pageNumber - 1) % colors.length];

  return (
    <div className={`w-[min(600px,90vw)] aspect-[3/4] bg-gradient-to-br ${color} rounded-lg flex flex-col items-center justify-center p-8 shadow-2xl`}>
      <div className="text-white/30 text-8xl font-bold mb-4">{pageNumber}</div>
      <div className="text-white text-xl font-semibold mb-2">Demo Page {pageNumber}</div>
      <div className="text-white/60 text-sm text-center">
        Page {pageNumber} of {totalPages}
      </div>
      <div className="mt-6 text-white/40 text-xs text-center max-w-xs">
        Replace with your own comic images by hosting a manifest.json file.
        See the documentation for setup instructions.
      </div>
    </div>
  );
}
