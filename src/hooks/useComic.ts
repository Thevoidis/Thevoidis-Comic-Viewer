import { useState, useEffect, useCallback } from 'react';
import { ComicManifest, ComicConfig } from '../types';

function parseConfig(): ComicConfig {
  const params = new URLSearchParams(window.location.search);
  
  const baseUrl = params.get('comic') || params.get('base') || '';
  const manifestUrl = params.get('manifest') || '';
  const startPage = parseInt(params.get('page') || '0', 10);
  const theme = (params.get('theme') as 'dark' | 'light') || 'dark';

  return { baseUrl, manifestUrl, startPage, theme };
}

export function useComic() {
  const [manifest, setManifest] = useState<ComicManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config] = useState<ComicConfig>(parseConfig);

  const loadManifest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let manifestUrl: string;
      
      if (config.manifestUrl) {
        manifestUrl = config.manifestUrl;
      } else if (config.baseUrl) {
        // Try to load manifest.json from the comic directory
        const base = config.baseUrl.endsWith('/') ? config.baseUrl : config.baseUrl + '/';
        manifestUrl = base + 'manifest.json';
      } else {
        // Demo mode - use sample data
        setManifest(getDemoManifest());
        setLoading(false);
        return;
      }

      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate manifest
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error('Invalid manifest: missing or invalid "pages" array');
      }

      setManifest({
        title: data.title || 'Untitled Comic',
        author: data.author || '',
        description: data.description || '',
        cover: data.cover || '',
        pages: data.pages,
        direction: data.direction || 'ltr',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comic');
      // Fall back to demo mode
      setManifest(getDemoManifest());
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  const getPageUrl = useCallback((page: string) => {
    if (page.startsWith('http://') || page.startsWith('https://') || page.startsWith('//')) {
      return page;
    }
    if (config.baseUrl) {
      const base = config.baseUrl.endsWith('/') ? config.baseUrl : config.baseUrl + '/';
      return base + page;
    }
    return page;
  }, [config.baseUrl]);

  return { manifest, loading, error, config, getPageUrl, reload: loadManifest };
}

function getDemoManifest(): ComicManifest {
  return {
    title: 'Demo Comic',
    author: 'Comic Viewer',
    description: 'This is a demo comic showing the viewer capabilities. Host your own comics by providing a manifest.json file.',
    pages: [
      'demo-1',
      'demo-2',
      'demo-3',
      'demo-4',
      'demo-5',
      'demo-6',
    ],
    direction: 'ltr',
  };
}
