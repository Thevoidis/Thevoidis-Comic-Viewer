export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                <path strokeWidth="2" d="M3 9h18M9 3v18"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">Comic Viewer</h1>
          </div>
          <a
            href="?comic=demo"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Demo →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Embeddable Comic Viewer
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            A lightweight, self-contained comic reader that you can embed anywhere.
            Host your comic images on any static site and link them with a simple manifest file.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="?comic=demo"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              View Demo
            </a>
            <a
              href="#setup"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Setup Guide
            </a>
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section id="setup" className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8">How to Use</h3>

          {/* Step 1 */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm">1</span>
              Create a comic directory on your site
            </h4>
            <p className="text-gray-400 mb-3 ml-9">
              Create a folder in your site's static directory (e.g., <code className="bg-gray-800 px-2 py-0.5 rounded text-sm">static/comics/my-comic/</code>) and add your comic images there.
            </p>
          </div>

          {/* Step 2 */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm">2</span>
              Add a manifest.json file
            </h4>
            <p className="text-gray-400 mb-3 ml-9">
              Create a <code className="bg-gray-800 px-2 py-0.5 rounded text-sm">manifest.json</code> in the same directory:
            </p>
            <div className="ml-9 bg-gray-900 rounded-lg border border-gray-700 p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">{`{
  "title": "My Awesome Comic",
  "author": "Your Name",
  "description": "A short description of the comic",
  "direction": "ltr",
  "pages": [
    "001.png",
    "002.png",
    "003.png",
    "004.png"
  ]
}`}</pre>
            </div>
            <div className="ml-9 mt-3 text-sm text-gray-500">
              <p><strong className="text-gray-400">Fields:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li><code className="bg-gray-800 px-1 rounded">title</code> — Comic title (required)</li>
                <li><code className="bg-gray-800 px-1 rounded">author</code> — Author name (optional)</li>
                <li><code className="bg-gray-800 px-1 rounded">description</code> — Short description (optional)</li>
                <li><code className="bg-gray-800 px-1 rounded">direction</code> — Reading direction: <code className="bg-gray-800 px-1 rounded">"ltr"</code> (left-to-right) or <code className="bg-gray-800 px-1 rounded">"rtl"</code> (right-to-left, for manga)</li>
                <li><code className="bg-gray-800 px-1 rounded">pages</code> — Array of image filenames in order (required)</li>
                <li><code className="bg-gray-800 px-1 rounded">cover</code> — Cover image filename (optional)</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm">3</span>
              Embed the viewer
            </h4>
            <p className="text-gray-400 mb-3 ml-9">
              Embed the viewer in any page using an iframe:
            </p>
            <div className="ml-9 bg-gray-900 rounded-lg border border-gray-700 p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">{`<!-- Full-page embed -->
<iframe
  src="https://your-site.com/comic-viewer/?comic=/comics/my-comic/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>

<!-- Or with a specific starting page -->
<iframe
  src="https://your-site.com/comic-viewer/?comic=/comics/my-comic/&page=5"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>`}</pre>
            </div>
          </div>

          {/* Step 4 - Hugo specific */}
          <div className="mb-10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm">4</span>
              Hugo site integration
            </h4>
            <p className="text-gray-400 mb-3 ml-9">
              If you're using Hugo (like Thevoidis.github.io), place the comic viewer build output in your <code className="bg-gray-800 px-2 py-0.5 rounded text-sm">static/comic-viewer/</code> directory. Then in your content:
            </p>
            <div className="ml-9 bg-gray-900 rounded-lg border border-gray-700 p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">{`<!-- In your Hugo template or content HTML -->
<iframe
  src="/comic-viewer/?comic=/comics/my-comic/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>`}</pre>
            </div>
            <p className="text-gray-400 mt-3 ml-9 text-sm">
              Your comic files go in <code className="bg-gray-800 px-2 py-0.5 rounded text-sm">static/comics/my-comic/</code> alongside the manifest.
            </p>
          </div>
        </div>
      </section>

      {/* URL Parameters */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8">URL Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400 font-medium">Parameter</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Description</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4"><code className="bg-gray-800 px-2 py-0.5 rounded text-blue-400">comic</code></td>
                  <td className="py-3 px-4 text-gray-300">Base URL of the comic directory</td>
                  <td className="py-3 px-4 text-gray-500"><code>/comics/my-comic/</code></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4"><code className="bg-gray-800 px-2 py-0.5 rounded text-blue-400">manifest</code></td>
                  <td className="py-3 px-4 text-gray-300">Direct URL to manifest.json (overrides comic)</td>
                  <td className="py-3 px-4 text-gray-500"><code>https://cdn.example.com/comic/manifest.json</code></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4"><code className="bg-gray-800 px-2 py-0.5 rounded text-blue-400">page</code></td>
                  <td className="py-3 px-4 text-gray-300">Starting page (0-indexed)</td>
                  <td className="py-3 px-4 text-gray-500"><code>0</code></td>
                </tr>
                <tr>
                  <td className="py-3 px-4"><code className="bg-gray-800 px-2 py-0.5 rounded text-blue-400">theme</code></td>
                  <td className="py-3 px-4 text-gray-300">Color theme</td>
                  <td className="py-3 px-4 text-gray-500"><code>dark</code> or <code>light</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { keys: '← / A', action: 'Previous page' },
              { keys: '→ / D', action: 'Next page' },
              { keys: 'Home', action: 'First page' },
              { keys: 'End', action: 'Last page' },
              { keys: '1', action: 'Single page mode' },
              { keys: '2', action: 'Double page mode' },
              { keys: '3', action: 'Scroll mode' },
              { keys: '+ / -', action: 'Zoom in / out' },
              { keys: '0', action: 'Reset zoom' },
              { keys: 'T', action: 'Toggle thumbnails' },
              { keys: 'F', action: 'Toggle fullscreen' },
              { keys: 'Esc', action: 'Close thumbnails' },
            ].map(({ keys, action }) => (
              <div key={keys} className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 font-mono min-w-[3rem] text-center">
                  {keys}
                </kbd>
                <span className="text-gray-400 text-sm">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📖', title: 'Multiple View Modes', desc: 'Single page, double page spread, or continuous scroll' },
              { icon: '🔍', title: 'Zoom Controls', desc: 'Zoom from 25% to 300% for detailed viewing' },
              { icon: '⌨️', title: 'Keyboard Navigation', desc: 'Full keyboard support for power readers' },
              { icon: '📱', title: 'Responsive', desc: 'Works on desktop, tablet, and mobile' },
              { icon: '🖼️', title: 'Thumbnail Sidebar', desc: 'Quick navigation with page thumbnails' },
              { icon: '🌐', title: 'Embeddable', desc: 'Drop-in iframe embed for any website' },
              { icon: '📐', title: 'RTL Support', desc: 'Right-to-left reading for manga' },
              { icon: '⚡', title: 'Lightweight', desc: 'No dependencies, fast loading' },
              { icon: '🖥️', title: 'Fullscreen', desc: 'Immersive fullscreen reading mode' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-900 rounded-lg p-5 border border-gray-800">
                <div className="text-2xl mb-2">{icon}</div>
                <h4 className="text-white font-semibold mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
          <p>Comic Viewer — MIT License</p>
          <p className="mt-1">
            <a href="https://github.com/Thevoidis/Thevoidis-Comic-Viewer" className="text-blue-400 hover:text-blue-300">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
