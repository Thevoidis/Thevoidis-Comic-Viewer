import { useComic } from './hooks/useComic';
import ComicViewer from './components/ComicViewer';
import SetupGuide from './components/SetupGuide';

export default function App() {
  const { manifest, loading, error, config, getPageUrl } = useComic();

  // Check if we're in viewer mode (has comic URL param) or landing mode
  const params = new URLSearchParams(window.location.search);
  const isViewerMode = params.has('comic') || params.has('manifest') || params.has('base');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading comic...</p>
        </div>
      </div>
    );
  }

  if (isViewerMode && manifest) {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-900/90 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg text-sm shadow-lg max-w-md text-center">
            ⚠️ {error} — Showing demo instead.
          </div>
        )}
        <ComicViewer
          manifest={manifest}
          getPageUrl={getPageUrl}
          startPage={config.startPage || 0}
        />
      </>
    );
  }

  // Show setup guide / landing page
  return <SetupGuide />;
}
