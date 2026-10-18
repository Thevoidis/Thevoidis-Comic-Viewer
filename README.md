# Comic Viewer

An embeddable, lightweight comic reader for static websites. Host your comic images anywhere and view them with a beautiful, full-featured reader interface.

**Live demo:** https://thevoidis.github.io/Thevoidis-Comic-Viewer/

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
  src="https://thevoidis.github.io/Thevoidis-Comic-Viewer/?comic=/comics/my-comic/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>
```

## Deployment

This repo auto-deploys to GitHub Pages via GitHub Actions.

### Setup

1. Go to your repo **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` will build and deploy automatically

The viewer will be live at: `https://<username>.github.io/<repo-name>/`

### Manual deployment

```bash
npm install
npm run build
# Upload the contents of dist/ to your hosting
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

## Hugo Integration (Thevoidis.github.io)

For your Hugo site:

1. Add comic files to `static/comics/<comic-name>/` (images + `manifest.json`)
2. Embed in your content or template:

```html
<iframe
  src="https://thevoidis.github.io/Thevoidis-Comic-Viewer/?comic=/comics/<comic-name>/"
  width="100%"
  height="800"
  style="border: none;"
  allowfullscreen
></iframe>
```

Since both the viewer and the comics are on the same GitHub Pages domain, relative paths like `/comics/<name>/` work perfectly.

## Development

```bash
npm install
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build to dist/
```

## License

MIT
