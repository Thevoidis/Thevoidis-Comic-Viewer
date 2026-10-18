# Comic Viewer

An embeddable, lightweight comic reader for static websites. Host your comic images anywhere and view them with a beautiful, full-featured reader interface.

## Features

- **Multiple View Modes**: Single page, double page spread, or continuous scroll
- **Zoom Controls**: Zoom from 25% to 300% for detailed viewing
- **Keyboard Navigation**: Full keyboard support (arrow keys, shortcuts)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Thumbnail Sidebar**: Quick navigation with page thumbnails
- **Embeddable**: Drop-in iframe embed for any website
- **RTL Support**: Right-to-left reading for manga
- **Fullscreen Mode**: Immersive fullscreen reading
- **Lightweight**: No heavy dependencies, fast loading

## Quick Start

### 1. Host your comic files

Place your comic images in a directory on your static site:

```
your-site.com/
  comics/
    my-comic/
      manifest.json
      001.png
      002.png
      003.png
```

### 2. Create a manifest.json

```json
{
  "title": "My Comic",
  "author": "Your Name",
  "description": "A short description",
  "direction": "ltr",
  "pages": ["001.png", "002.png", "003.png"]
}
```

### 3. Embed the viewer

```html
<iframe
  src="https://your-site.com/comic-viewer/?comic=/comics/my-comic/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>
```

## URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `comic` | Base URL of the comic directory | `/comics/my-comic/` |
| `manifest` | Direct URL to manifest.json | `https://cdn.example.com/manifest.json` |
| `page` | Starting page (0-indexed) | `0` |
| `theme` | Color theme | `dark` or `light` |

## Manifest Format

```json
{
  "title": "Comic Title",
  "author": "Author Name",
  "description": "Short description",
  "direction": "ltr",
  "cover": "cover.png",
  "pages": ["001.png", "002.png", "003.png"]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Comic title |
| `pages` | Yes | Array of image filenames in order |
| `author` | No | Author name |
| `description` | No | Short description |
| `direction` | No | `"ltr"` (default) or `"rtl"` for manga |
| `cover` | No | Cover image filename |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `A` | Previous page |
| `→` / `D` | Next page |
| `Home` | First page |
| `End` | Last page |
| `1` | Single page mode |
| `2` | Double page mode |
| `3` | Scroll mode |
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom |
| `T` | Toggle thumbnails |
| `F` | Toggle fullscreen |
| `Esc` | Close thumbnails |

## Hugo Integration

For Hugo sites (like Thevoidis.github.io):

1. Build this project: `npm run build`
2. Copy the `dist/` folder to `static/comic-viewer/` in your Hugo site
3. Add comic files to `static/comics/my-comic/`
4. Embed in your content:

```html
<iframe
  src="/comic-viewer/?comic=/comics/my-comic/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>
```

## Development

```bash
npm install
npm run dev     # Start dev server
npm run build   # Production build
```

## License

MIT
